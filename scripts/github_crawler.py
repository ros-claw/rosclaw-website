#!/usr/bin/env python3
"""
GitHub 仓库自动爬取工具

自动搜索 GitHub 上与 ROS/MCP 相关的仓库，并批量导入到 rosclaw.io

使用方法：
    # 搜索 MCP 相关仓库
    python github_crawler.py --type mcp --query "mcp server ros2" --limit 50

    # 搜索 ROS Skills
    python github_crawler.py --type skill --query "ros2 skill manipulation" --limit 100

    # 使用 GitHub Token 提高速率限制
    python github_crawler.py --type mcp --query "ros mcp" --token YOUR_GITHUB_TOKEN --api-key YOUR_ADMIN_KEY
"""

import argparse
import json
import os
import sys
import time
from typing import Optional

import requests
from dotenv import load_dotenv

# 加载 .env 文件（如果存在）
load_dotenv()

from bulk_import import RosclawImporter


class GitHubCrawler:
    def __init__(self, github_token: Optional[str] = None):
        self.github_token = github_token
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/vnd.github+json",
            "User-Agent": "rosclaw-crawler",
            "X-GitHub-Api-Version": "2022-11-28",
        })
        if github_token:
            self.session.headers["Authorization"] = f"Bearer {github_token}"

    def search_repos(
        self,
        query: str,
        limit: int = 50,
        sort: str = "stars",
        order: str = "desc",
        language: Optional[str] = None,
        min_stars: int = 0,
    ) -> list[dict]:
        """搜索 GitHub 仓库"""
        repos = []
        page = 1
        per_page = min(100, limit)

        # 构建查询
        search_query = query
        if min_stars > 0:
            search_query += f" stars:>={min_stars}"
        if language:
            search_query += f" language:{language}"

        print(f"🔍 搜索: {search_query}")
        print(f"📊 目标数量: {limit}")

        while len(repos) < limit:
            url = "https://api.github.com/search/repositories"
            params = {
                "q": search_query,
                "sort": sort,
                "order": order,
                "per_page": per_page,
                "page": page,
            }

            try:
                res = self.session.get(url, params=params, timeout=30)

                if res.status_code == 403:
                    reset_time = res.headers.get("X-RateLimit-Reset")
                    if reset_time:
                        wait_time = int(reset_time) - int(time.time())
                        print(f"⏳ 速率限制，等待 {wait_time} 秒...")
                        time.sleep(max(wait_time, 60))
                        continue
                    else:
                        print("⚠️  速率限制，请提供 GitHub Token")
                        break

                res.raise_for_status()
                data = res.json()

                items = data.get("items", [])
                if not items:
                    break

                for item in items:
                    if len(repos) >= limit:
                        break
                    repos.append({
                        "name": item["full_name"],
                        "url": item["html_url"],
                        "description": item.get("description", ""),
                        "stars": item["stargazers_count"],
                        "language": item.get("language", ""),
                        "topics": item.get("topics", []),
                    })

                print(f"  📦 已获取 {len(repos)}/{limit} 个仓库...")

                # 检查是否有更多结果
                if len(items) < per_page:
                    break

                page += 1
                time.sleep(2)  # 避免速率限制

            except Exception as e:
                print(f"❌ 搜索失败: {e}")
                break

        return repos[:limit]

    def filter_repos(
        self,
        repos: list[dict],
        exclude_forks: bool = True,
        min_stars: int = 0,
        require_topics: Optional[list[str]] = None,
        exclude_names: Optional[list[str]] = None,
    ) -> list[dict]:
        """过滤仓库列表"""
        filtered = []

        for repo in repos:
            # 排除 forks
            if exclude_forks and "/" in repo["name"]:
                # GitHub API 返回的 item 中有 fork 字段
                pass  # 已在搜索时排除

            # 最低 stars
            if repo["stars"] < min_stars:
                continue

            # 需要特定 topics
            if require_topics:
                if not any(t in repo["topics"] for t in require_topics):
                    continue

            # 排除特定名称
            if exclude_names:
                if any(ex in repo["name"].lower() for ex in exclude_names):
                    continue

            filtered.append(repo)

        return filtered


def main():
    parser = argparse.ArgumentParser(
        description="GitHub 仓库自动爬取工具",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
示例:
  # 搜索 MCP + ROS 相关仓库
  python github_crawler.py --type mcp --query "mcp server ros" --limit 50

  # 搜索 ROS2 manipulation skills
  python github_crawler.py --type skill --query "ros2 manipulation robot" --min-stars 10

  # 使用 GitHub Token 和 Admin API Key
  python github_crawler.py --type mcp --query "model context protocol" \
    --token GITHUB_TOKEN --api-key ADMIN_API_KEY --limit 100

常用搜索词:
  MCP: "mcp server", "model context protocol", "anthropic mcp"
  Skills: "ros2 skill", "ros manipulation", "robot navigation"
        """,
    )

    # 搜索参数
    parser.add_argument("--type", choices=["mcp", "skill"], required=True, help="导入类型")
    parser.add_argument("--query", required=True, help="GitHub 搜索关键词")
    parser.add_argument("--limit", type=int, default=50, help="最大获取数量 (默认: 50)")
    parser.add_argument("--min-stars", type=int, default=0, help="最低 Stars 数")
    parser.add_argument("--language", help="编程语言过滤 (如: python, cpp)")
    parser.add_argument("--require-topics", nargs="+", help="必须包含的 topics")
    parser.add_argument("--exclude", nargs="+", help="排除的关键词")

    # 认证
    parser.add_argument("--token", help="GitHub Personal Access Token")
    parser.add_argument("--api-key", default=os.environ.get("ADMIN_API_KEY") or os.environ.get("NEXT_PUBLIC_ADMIN_KEY"), help="ROSClaw Admin API Key，默认从环境变量 ADMIN_API_KEY 或 NEXT_PUBLIC_ADMIN_KEY 读取")

    # 导入参数
    parser.add_argument("--base-url", default="https://www.rosclaw.io", help="API 基础 URL")
    parser.add_argument("--delay", type=float, default=1.0, help="导入间隔 (秒)")
    parser.add_argument("--dry-run", action="store_true", help="只搜索，不导入")

    # 保存结果
    parser.add_argument("--save", help="保存搜索结果到文件 (JSON)")
    parser.add_argument("--import-file", help="从保存的文件导入")

    args = parser.parse_args()

    # 从文件导入模式
    if args.import_file:
        print(f"📁 从文件导入: {args.import_file}")
        importer = RosclawImporter(args.api_key, args.base_url)
        importer.import_from_file(args.import_file, args.type, delay=args.delay)
        return

    # 搜索模式
    crawler = GitHubCrawler(args.token)

    repos = crawler.search_repos(
        query=args.query,
        limit=args.limit,
        min_stars=args.min_stars,
        language=args.language,
    )

    if not repos:
        print("❌ 未找到仓库")
        return

    # 过滤
    repos = crawler.filter_repos(
        repos,
        min_stars=args.min_stars,
        require_topics=args.require_topics,
        exclude_names=args.exclude,
    )

    print(f"\n📊 找到 {len(repos)} 个仓库:")
    for i, repo in enumerate(repos[:10], 1):
        print(f"  {i}. {repo['name']} (⭐ {repo['stars']})")
    if len(repos) > 10:
        print(f"  ... 还有 {len(repos) - 10} 个")

    # 保存到文件
    if args.save:
        with open(args.save, "w") as f:
            json.dump(repos, f, indent=2)
        print(f"\n💾 已保存到: {args.save}")

    # 生成 URL 列表文件
    url_file = f"crawled_{args.type}_repos.txt"
    with open(url_file, "w") as f:
        for repo in repos:
            f.write(f"{repo['url']}\n")
    print(f"💾 URL 列表已保存到: {url_file}")

    # 试运行模式
    if args.dry_run:
        print("\n🏃 试运行模式，跳过导入")
        return

    # 导入确认
    print(f"\n⚠️  即将导入 {len(repos)} 个 {args.type.upper()}")
    if not args.api_key:
        print("   未提供 API Key，导入将进入待审核状态")

    try:
        input("\n按 Enter 开始导入，Ctrl+C 取消...")
    except KeyboardInterrupt:
        print("\n❌ 已取消")
        return

    # 开始导入
    importer = RosclawImporter(args.api_key, args.base_url)
    importer.import_from_file(url_file, args.type, delay=args.delay)


if __name__ == "__main__":
    main()
