#!/usr/bin/env python3
"""
ROSClaw GitHub 数据同步脚本

自动同步所有 MCP 包和 Skills 的 GitHub 数据：
- README 内容
- GitHub Stars
- Forks
- 最后更新时间

使用方法：
    # 同步所有项目
    python sync_github.py --api-key YOUR_KEY

    # 同步特定类型
    python sync_github.py --type mcp --api-key YOUR_KEY

    # 同步单个项目
    python sync_github.py --name owner/repo --type mcp --api-key YOUR_KEY

    # 使用 GitHub Token 提高速率限制
    python sync_github.py --api-key YOUR_KEY --github-token GITHUB_TOKEN

建议定时任务：
    # 每小时同步一次
    0 * * * * cd /path/to/scripts && python sync_github.py --api-key YOUR_KEY
"""

import argparse
import base64
import json
import sys
import time
from datetime import datetime
from typing import Optional

import requests


class GitHubSync:
    def __init__(self, api_key: str, base_url: str, github_token: Optional[str] = None):
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.github_token = github_token

        # 设置 headers
        self.api_headers = {
            "x-api-key": api_key,
            "Content-Type": "application/json",
        }

        self.github_headers = {
            "Accept": "application/vnd.github+json",
            "User-Agent": "rosclaw-sync",
            "X-GitHub-Api-Version": "2022-11-28",
        }
        if github_token:
            self.github_headers["Authorization"] = f"Bearer {github_token}"

        # 统计
        self.stats = {
            "success": 0,
            "failed": 0,
            "skipped": 0,
            "errors": [],
        }

    def get_all_items(self, item_type: str) -> list[dict]:
        """获取所有项目"""
        endpoint = "mcp-packages" if item_type == "mcp" else "skills"
        url = f"{self.base_url}/api/{endpoint}"

        try:
            res = requests.get(url, headers=self.api_headers, timeout=30)
            if res.status_code == 200:
                return res.json()
            else:
                print(f"❌ 获取列表失败: {res.status_code}")
                return []
        except Exception as e:
            print(f"❌ 获取列表异常: {e}")
            return []

    def get_github_data(self, repo_url: str) -> Optional[dict]:
        """从 GitHub 获取仓库数据"""
        try:
            # 解析 URL
            match = requests.utils.urlparse(repo_url)
            parts = match.path.strip("/").split("/")
            if len(parts) < 2:
                return None

            owner, repo = parts[0], parts[1]
            base_api = f"https://api.github.com/repos/{owner}/{repo}"

            # 获取仓库信息
            repo_res = requests.get(
                base_api,
                headers=self.github_headers,
                timeout=30
            )

            if repo_res.status_code == 404:
                print(f"    ⚠️  仓库不存在或私有")
                return None
            elif repo_res.status_code == 403:
                print(f"    ⚠️  GitHub API 速率限制")
                return None

            repo_res.raise_for_status()
            repo_data = repo_res.json()

            # 获取 README
            readme_content = ""
            readme_res = requests.get(
                f"{base_api}/readme",
                headers=self.github_headers,
                timeout=30
            )

            if readme_res.status_code == 200:
                readme_data = readme_res.json()
                if readme_data.get("content"):
                    try:
                        readme_content = base64.b64decode(
                            readme_data["content"].replace("\n", "")
                        ).decode("utf-8")
                    except Exception:
                        pass

            return {
                "stars": repo_data.get("stargazers_count", 0),
                "forks": repo_data.get("forks_count", 0),
                "updated_at": repo_data.get("updated_at", ""),
                "readme": readme_content,
                "description": repo_data.get("description", ""),
            }

        except Exception as e:
            print(f"    ❌ 获取 GitHub 数据失败: {e}")
            return None

    def update_item(self, name: str, item_type: str, data: dict) -> bool:
        """更新项目"""
        endpoint = "mcp-packages" if item_type == "mcp" else "skills"
        url = f"{self.base_url}/api/{endpoint}/{name}"

        try:
            res = requests.put(
                url,
                headers=self.api_headers,
                json=data,
                timeout=30
            )

            if res.status_code == 200:
                return True
            else:
                error = res.json().get("error", "Unknown error")
                print(f"    ❌ 更新失败: {error}")
                return False

        except Exception as e:
            print(f"    ❌ 更新异常: {e}")
            return False

    def sync_item(self, item: dict, item_type: str, force: bool = False) -> bool:
        """同步单个项目"""
        name = item.get("name", "")
        github_url = item.get("githubRepoUrl") or item.get("github_repo_url", "")

        if not github_url:
            print(f"⏭️  {name}: 无 GitHub URL，跳过")
            self.stats["skipped"] += 1
            return False

        print(f"\n📦 {name}")
        print(f"   URL: {github_url}")

        # 获取 GitHub 数据
        gh_data = self.get_github_data(github_url)
        if not gh_data:
            self.stats["failed"] += 1
            return False

        print(f"   ⭐ Stars: {gh_data['stars']}")
        print(f"   📝 README: {len(gh_data['readme'])} chars")

        # 准备更新数据
        update_data = {
            "github_stars": gh_data["stars"],
            "readme_content": gh_data["readme"],
            "last_synced_at": datetime.now().isoformat(),
        }

        # 如果描述为空，使用 GitHub 描述
        if not item.get("description") and gh_data["description"]:
            update_data["description"] = gh_data["description"]

        # 更新
        if self.update_item(name, item_type, update_data):
            print(f"   ✅ 同步成功")
            self.stats["success"] += 1
            return True
        else:
            self.stats["failed"] += 1
            return False

    def sync_all(self, item_type: Optional[str] = None, force: bool = False, delay: float = 1.0):
        """同步所有项目"""
        types_to_sync = [item_type] if item_type else ["mcp", "skill"]

        for t in types_to_sync:
            print(f"\n{'='*60}")
            print(f"🔄 同步 {t.upper()} 项目")
            print(f"{'='*60}")

            items = self.get_all_items(t)
            print(f"📊 共 {len(items)} 个项目\n")

            for i, item in enumerate(items, 1):
                print(f"[{i}/{len(items)}]", end=" ")
                self.sync_item(item, t, force)

                if i < len(items):
                    time.sleep(delay)

        # 打印统计
        print(f"\n{'='*60}")
        print("📊 同步统计:")
        print(f"  ✅ 成功: {self.stats['success']}")
        print(f"  ⏭️  跳过: {self.stats['skipped']}")
        print(f"  ❌ 失败: {self.stats['failed']}")
        print(f"{'='*60}")

        # 保存错误日志
        if self.stats["errors"]:
            error_file = f"sync_errors_{int(time.time())}.json"
            with open(error_file, "w") as f:
                json.dump(self.stats["errors"], f, indent=2)
            print(f"\n⚠️  错误详情已保存到: {error_file}")


def main():
    parser = argparse.ArgumentParser(
        description="ROSClaw GitHub 数据同步工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 同步所有项目
  python sync_github.py --api-key YOUR_KEY

  # 只同步 MCP 包
  python sync_github.py --type mcp --api-key YOUR_KEY

  # 使用 GitHub Token（提高速率限制）
  python sync_github.py --api-key YOUR_KEY --github-token GITHUB_TOKEN

  # 更快的同步（减少延迟）
  python sync_github.py --api-key YOUR_KEY --delay 0.5
        """,
    )

    parser.add_argument("--api-key", required=True, help="ROSClaw Admin API Key")
    parser.add_argument("--base-url", default="https://www.rosclaw.io", help="API 基础 URL")
    parser.add_argument("--type", choices=["mcp", "skill"], help="只同步特定类型")
    parser.add_argument("--github-token", help="GitHub Personal Access Token")
    parser.add_argument("--delay", type=float, default=1.0, help="请求间隔（秒）")
    parser.add_argument("--force", action="store_true", help="强制同步所有项目")

    args = parser.parse_args()

    print("🚀 ROSClaw GitHub 同步工具")
    print(f"📍 API: {args.base_url}")

    sync = GitHubSync(args.api_key, args.base_url, args.github_token)
    sync.sync_all(args.type, args.force, args.delay)


if __name__ == "__main__":
    main()
