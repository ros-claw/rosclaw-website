#!/usr/bin/env python3
"""
ROSClaw Bulk Import Script
自动批量导入 MCP 包和 Skills 到 rosclaw.io

功能：
- 从 GitHub URL 自动获取仓库信息
- 自动推断分类、标签、机器人类型
- 去重检查（基于 name 字段）
- 使用 API Key 直接发布（跳过审核）
- 支持批量导入和错误重试

使用方法：
    python bulk_import.py --type mcp --file mcp_repos.txt
    python bulk_import.py --type skill --file skill_repos.txt --api-key YOUR_API_KEY
"""

import argparse
import json
import re
import sys
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urlparse

import requests

# 配置
BASE_URL = "https://www.rosclaw.io"
# BASE_URL = "http://localhost:3000"  # 本地开发时使用


class RosclawImporter:
    def __init__(self, api_key: Optional[str] = None, base_url: str = BASE_URL):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.session = requests.Session()
        self.session.headers.update({
            "Content-Type": "application/json",
            "Accept": "application/json",
        })
        if api_key:
            self.session.headers.update({"x-api-key": api_key})

        # 统计
        self.stats = {
            "success": 0,
            "skipped": 0,
            "failed": 0,
            "errors": [],
        }

    def parse_github_url(self, url: str) -> tuple[str, str]:
        """解析 GitHub URL，返回 (owner, repo)"""
        # 处理各种格式的 GitHub URL
        patterns = [
            r"github\.com/([^/]+)/([^/]+?)(?:\.git)?/?$",
            r"github\.com/([^/]+)/([^/]+?)(?:\.git)?/#",
            r"github\.com/([^/]+)/([^/]+?)(?:\.git)?/",
        ]

        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1), match.group(2)

        raise ValueError(f"无法解析 GitHub URL: {url}")

    def get_github_data(self, repo_url: str) -> Optional[dict]:
        """从 GitHub API 获取仓库数据"""
        try:
            owner, repo = self.parse_github_url(repo_url)
            headers = {
                "Accept": "application/vnd.github+json",
                "User-Agent": "rosclaw-importer",
            }

            # 获取仓库信息
            repo_api_url = f"https://api.github.com/repos/{owner}/{repo}"
            repo_res = requests.get(repo_api_url, headers=headers, timeout=30)

            if repo_res.status_code == 404:
                print(f"  ⚠️  仓库不存在或私有: {repo_url}")
                return None
            elif repo_res.status_code == 403:
                print(f"  ⚠️  GitHub API 速率限制，请稍后重试")
                return None

            repo_res.raise_for_status()
            repo_data = repo_res.json()

            # 获取 README
            readme_url = f"https://api.github.com/repos/{owner}/{repo}/readme"
            readme_res = requests.get(readme_url, headers=headers, timeout=30)
            readme_content = ""

            if readme_res.status_code == 200:
                readme_data = readme_res.json()
                if readme_data.get("content"):
                    import base64
                    try:
                        readme_content = base64.b64decode(
                            readme_data["content"].replace("\n", "")
                        ).decode("utf-8")
                    except Exception:
                        pass

            # 提取 topics 作为 tags
            tags = repo_data.get("topics", []) or []

            # 推断机器人类型
            robot_type = self.infer_robot_type(repo, tags, readme_content)

            # 推断分类
            category = self.infer_category(repo, tags, readme_content)

            return {
                "name": f"{owner}/{repo}",
                "display_name": repo_data.get("full_name", f"{owner}/{repo}"),
                "description": repo_data.get("description", "") or "",
                "long_description": readme_content,
                "github_repo_url": repo_data.get("html_url", repo_url),
                "author_name": repo_data.get("owner", {}).get("login", owner),
                "author_url": repo_data.get("owner", {}).get("html_url", ""),
                "tags": tags[:10],  # 限制标签数量
                "github_stars": repo_data.get("stargazers_count", 0),
                "github_forks": repo_data.get("forks_count", 0),
                "robot_type": robot_type,
                "category": category,
                "version": self.extract_version(readme_content) or "1.0.0",
                "license": repo_data.get("license", {}).get("name", ""),
            }

        except Exception as e:
            print(f"  ❌ 获取 GitHub 数据失败: {e}")
            return None

    def infer_robot_type(self, repo_name: str, tags: list, readme: str) -> str:
        """推断机器人类型"""
        text = f"{repo_name} {' '.join(tags)} {readme[:2000]}".lower()

        robot_types = {
            "humanoid": ["humanoid", "g1", "unitree", "h1", "optimus", "robotis-op", "nao", "pepper"],
            "manipulator": ["ur5", "ur10", "ur3", "franka", "panda", "xarm", "kinova", "manipulator", "arm", "gripper"],
            "mobile": ["turtlebot", "mobile", "navigation", "slam", "amr", "agv", "husky", "jackal"],
            "drone": ["drone", "uav", "quadcopter", "mavlink", "px4", "ardupilot"],
            "legged": ["quadruped", "dog", "a1", "go1", "aliengo", "spot", "anymal"],
        }

        for robot_type, keywords in robot_types.items():
            if any(kw in text for kw in keywords):
                return robot_type

        return "universal"  # 默认通用

    def infer_category(self, repo_name: str, tags: list, readme: str) -> str:
        """推断分类"""
        text = f"{repo_name} {' '.join(tags)} {readme[:2000]}".lower()

        categories = {
            "manipulation": ["manipulation", "grasp", "pick", "place", "assembly"],
            "vision": ["vision", "perception", "camera", "object detection", "segmentation", "opencv"],
            "navigation": ["navigation", "path planning", "slam", "localization", "mapping"],
            "simulation": ["simulation", "gazebo", "mujoco", "isaac", "pybullet", "rviz"],
            "control": ["control", "controller", "pid", "mpc", "trajectory"],
            "planning": ["planning", "motion planning", "path planning", "task planning"],
            "communication": ["communication", "middleware", "dds", "ros bridge", "mqtt"],
            "mcp_package": ["mcp", "model context protocol", "server"],
        }

        for category, keywords in categories.items():
            if any(kw in text for kw in keywords):
                return category

        return "general"

    def extract_version(self, readme: str) -> Optional[str]:
        """从 README 提取版本号"""
        # 匹配常见的版本号格式
        patterns = [
            r"version[:\s]+v?(\d+\.\d+(?:\.\d+)?)",
            r"v(\d+\.\d+(?:\.\d+)?)",
            r"version\s*[=:]\s*['\"]?(\d+\.\d+(?:\.\d+)?)['\"]?",
        ]

        for pattern in patterns:
            match = re.search(pattern, readme, re.IGNORECASE)
            if match:
                return match.group(1)

        return None

    def check_exists(self, name: str, item_type: str) -> bool:
        """检查项目是否已存在"""
        try:
            endpoint = "mcp-packages" if item_type == "mcp" else "skills"
            url = f"{self.base_url}/api/{endpoint}/{name}"
            res = requests.get(url, timeout=10)
            return res.status_code == 200
        except Exception:
            return False

    def import_item(self, repo_url: str, item_type: str, force: bool = False) -> bool:
        """导入单个项目"""
        print(f"\n📦 处理: {repo_url}")

        try:
            # 获取 GitHub 数据
            data = self.get_github_data(repo_url)
            if not data:
                self.stats["failed"] += 1
                return False

            print(f"  📋 {data['name']}: {data['description'][:60]}...")
            print(f"  🏷️  分类: {data['category']}, 机器人: {data['robot_type']}")
            print(f"  ⭐ Stars: {data['github_stars']}")

            # 检查是否已存在
            if not force and self.check_exists(data["name"], item_type):
                print(f"  ⏭️  已存在，跳过")
                self.stats["skipped"] += 1
                return True

            # 准备请求数据
            if item_type == "mcp":
                payload = {
                    "name": data["name"],
                    "description": data["description"],
                    "long_description": data["long_description"],
                    "github_repo_url": data["github_repo_url"],
                    "author_name": data["author_name"],
                    "category": data["category"],
                    "robot_type": data["robot_type"],
                    "tags": data["tags"],
                    "version": data["version"],
                    "tools": [],  # TODO: 可以尝试解析 MCP 工具定义
                }
                endpoint = "mcp-packages"
            else:  # skill
                payload = {
                    "name": data["name"],
                    "display_name": data["display_name"],
                    "description": data["description"],
                    "long_description": data["long_description"],
                    "github_repo_url": data["github_repo_url"],
                    "author_name": data["author_name"],
                    "author_url": data["author_url"],
                    "category": data["category"],
                    "robot_types": [data["robot_type"]] if data["robot_type"] != "universal" else [],
                    "tags": data["tags"],
                    "version": data["version"],
                    "compatible_robots": [],
                    "dependencies": [],
                }
                endpoint = "skills"

            # 发送创建请求
            url = f"{self.base_url}/api/{endpoint}"
            res = self.session.post(url, json=payload, timeout=30)

            if res.status_code == 201:
                result = res.json()
                print(f"  ✅ 创建成功 (ID: {result.get('id', 'N/A')})")
                self.stats["success"] += 1
                return True
            elif res.status_code == 409:
                print(f"  ⏭️  已存在 (409)")
                self.stats["skipped"] += 1
                return True
            else:
                error = res.json().get("error", "Unknown error")
                print(f"  ❌ 创建失败: {error}")
                self.stats["failed"] += 1
                self.stats["errors"].append({"url": repo_url, "error": error})
                return False

        except Exception as e:
            print(f"  ❌ 异常: {e}")
            self.stats["failed"] += 1
            self.stats["errors"].append({"url": repo_url, "error": str(e)})
            return False

    def import_from_file(self, filepath: str, item_type: str, force: bool = False, delay: float = 1.0):
        """从文件批量导入"""
        path = Path(filepath)
        if not path.exists():
            print(f"❌ 文件不存在: {filepath}")
            return

        # 读取 URL 列表
        urls = []
        with open(path, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    urls.append(line)

        print(f"\n{'='*60}")
        print(f"🚀 开始批量导入 {item_type.upper()}")
        print(f"📁 文件: {filepath}")
        print(f"📊 共 {len(urls)} 个项目")
        print(f"{'='*60}")

        # 逐个导入
        for i, url in enumerate(urls, 1):
            print(f"\n[{i}/{len(urls)}]", end="")
            self.import_item(url, item_type, force)

            # 延迟避免速率限制
            if i < len(urls) and delay > 0:
                time.sleep(delay)

        # 打印统计
        print(f"\n{'='*60}")
        print("📊 导入统计:")
        print(f"  ✅ 成功: {self.stats['success']}")
        print(f"  ⏭️  跳过: {self.stats['skipped']}")
        print(f"  ❌ 失败: {self.stats['failed']}")
        print(f"{'='*60}")

        # 如果有错误，保存到文件
        if self.stats["errors"]:
            error_file = f"import_errors_{int(time.time())}.json"
            with open(error_file, "w") as f:
                json.dump(self.stats["errors"], f, indent=2)
            print(f"\n⚠️  错误详情已保存到: {error_file}")

    def import_from_json(self, filepath: str, item_type: str):
        """从 JSON 文件导入（自定义数据）"""
        path = Path(filepath)
        if not path.exists():
            print(f"❌ 文件不存在: {filepath}")
            return

        with open(path, "r") as f:
            items = json.load(f)

        print(f"\n{'='*60}")
        print(f"🚀 开始从 JSON 导入 {item_type.upper()}")
        print(f"📊 共 {len(items)} 个项目")
        print(f"{'='*60}")

        endpoint = "mcp-packages" if item_type == "mcp" else "skills"

        for i, item in enumerate(items, 1):
            print(f"\n[{i}/{len(items)}] 📦 {item.get('name', 'Unknown')}")

            try:
                url = f"{self.base_url}/api/{endpoint}"
                res = self.session.post(url, json=item, timeout=30)

                if res.status_code == 201:
                    print(f"  ✅ 创建成功")
                    self.stats["success"] += 1
                elif res.status_code == 409:
                    print(f"  ⏭️  已存在")
                    self.stats["skipped"] += 1
                else:
                    error = res.json().get("error", "Unknown error")
                    print(f"  ❌ 失败: {error}")
                    self.stats["failed"] += 1

            except Exception as e:
                print(f"  ❌ 异常: {e}")
                self.stats["failed"] += 1

            time.sleep(0.5)

        print(f"\n{'='*60}")
        print("📊 导入统计:")
        print(f"  ✅ 成功: {self.stats['success']}")
        print(f"  ⏭️  跳过: {self.stats['skipped']}")
        print(f"  ❌ 失败: {self.stats['failed']}")


def create_example_files():
    """创建示例输入文件"""
    # MCP 示例
    mcp_example = """# MCP 包 GitHub URL 列表
# 每行一个 URL，支持以下格式：
# - https://github.com/owner/repo
# - https://github.com/owner/repo.git
# - 空行和以 # 开头的行会被忽略

https://github.com/modelcontextprotocol/servers
https://github.com/anthropics/anthropic-cookbook
"""

    # Skill 示例
    skill_example = """# Skill GitHub URL 列表
# 每行一个 URL

https://github.com/ros-planning/moveit
https://github.com/IntelRealSense/realsense-ros
"""

    # JSON 示例
    json_example = [
        {
            "name": "example/mcp-server",
            "description": "示例 MCP 服务器",
            "github_repo_url": "https://github.com/example/mcp-server",
            "author_name": "example",
            "category": "vision",
            "robot_type": "universal",
            "tags": ["example", "mcp"],
            "version": "1.0.0",
        }
    ]

    Path("mcp_repos.txt").write_text(mcp_example)
    Path("skill_repos.txt").write_text(skill_example)
    Path("custom_import.json").write_text(json.dumps(json_example, indent=2))

    print("✅ 已创建示例文件:")
    print("  - mcp_repos.txt")
    print("  - skill_repos.txt")
    print("  - custom_import.json")


def main():
    parser = argparse.ArgumentParser(
        description="ROSClaw 批量导入工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 从文件导入 MCP 包
  python bulk_import.py --type mcp --file mcp_repos.txt --api-key YOUR_KEY

  # 从文件导入 Skills
  python bulk_import.py --type skill --file skill_repos.txt --api-key YOUR_KEY

  # 强制重新导入（跳过去重检查）
  python bulk_import.py --type mcp --file mcp_repos.txt --api-key YOUR_KEY --force

  # 使用自定义 JSON 数据导入
  python bulk_import.py --type mcp --json-file custom_import.json --api-key YOUR_KEY

  # 创建示例文件
  python bulk_import.py --init
        """,
    )

    parser.add_argument(
        "--type",
        choices=["mcp", "skill"],
        help="导入类型: mcp 或 skill",
    )
    parser.add_argument(
        "--file",
        help="包含 GitHub URL 的文本文件",
    )
    parser.add_argument(
        "--json-file",
        help="包含自定义数据的 JSON 文件",
    )
    parser.add_argument(
        "--api-key",
        help="API Key（用于直接发布，跳过审核）",
    )
    parser.add_argument(
        "--base-url",
        default=BASE_URL,
        help=f"API 基础 URL (默认: {BASE_URL})",
    )
    parser.add_argument(
        "--force",
        action="store_true",
        help="强制导入，跳过已存在检查",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=1.0,
        help="请求间隔（秒），避免速率限制 (默认: 1.0)",
    )
    parser.add_argument(
        "--init",
        action="store_true",
        help="创建示例输入文件",
    )

    args = parser.parse_args()

    if args.init:
        create_example_files()
        return

    if not args.api_key:
        print("⚠️  警告: 未提供 API Key，导入的项目将进入待审核状态")
        print("   如需直接发布，请提供 --api-key")
        print()

    if args.json_file:
        importer = RosclawImporter(args.api_key, args.base_url)
        importer.import_from_json(args.json_file, args.type)
    elif args.file and args.type:
        importer = RosclawImporter(args.api_key, args.base_url)
        importer.import_from_file(args.file, args.type, args.force, args.delay)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
