# ROSClaw 批量导入工具

自动批量导入 MCP 包和 Skills 到 rosclaw.io 网站。

## 功能特性

- 🔗 **自动获取 GitHub 信息**: 从 GitHub API 自动抓取仓库描述、Topics、Stars、Forks
- 🤖 **LLM 智能分析**: 默认使用 LLM 分析 README，自动提取 MCP Tools、标签、分类（可禁用）
- 🏷️ **智能分类**: 根据仓库名称、Topics、README 自动推断分类和机器人类型
- 🚫 **自动去重**: 基于 `name` 字段检查是否已存在，避免重复导入
- 🔑 **API Key 支持**: 使用 API Key 直接发布，跳过审核流程
- 📅 **自动版本号**: 基于 GitHub 最后更新时间生成版本号 (YYYY.MM.DD)
- 📊 **导入统计**: 显示成功、跳过、失败的数量和详细错误日志
- 📝 **多种输入格式**: 支持 URL 列表文件或自定义 JSON 数据

## 安装依赖

```bash
cd scripts
pip install -r requirements.txt
```

## 环境变量配置（推荐）

脚本支持从环境变量自动读取配置，无需在命令行中重复输入。

### 方式一：使用 .env 文件（推荐）

1. 复制示例文件：
```bash
cp .env.example .env
```

2. 编辑 `.env` 文件，填入你的 API Key：
```bash
ADMIN_API_KEY=your_rosclaw_admin_key
BAILIAN_API_KEY=your_bailian_api_key
GITHUB_TOKEN=your_github_token
```

3. 直接运行脚本（自动读取 .env）：
```bash
python bulk_import.py --type mcp --file urls.txt
```

### 方式二：导出到系统环境变量

```bash
# 必需：设置 API Key（用于认证）
export ADMIN_API_KEY="your_rosclaw_admin_key"
# 或
export NEXT_PUBLIC_ADMIN_KEY="your_rosclaw_admin_key"

# 可选：设置 LLM API Key（用于智能分析）
export BAILIAN_API_KEY="your_bailian_api_key"

# 运行脚本
python bulk_import.py --type mcp --file urls.txt
```

## 工具说明

- `bulk_import.py` - 从 URL 列表或 JSON 文件批量导入
- `github_crawler.py` - 自动爬取 GitHub 仓库并导入

## 使用方法

### 方式一：GitHub 自动爬取（推荐）

自动搜索 GitHub 仓库并导入：

```bash
# 搜索 MCP 相关仓库
python github_crawler.py \
  --type mcp \
  --query "mcp server ros" \
  --limit 50 \
  --token YOUR_GITHUB_TOKEN \
  --api-key YOUR_ADMIN_API_KEY

# 搜索 ROS2 Skills
python github_crawler.py \
  --type skill \
  --query "ros2 manipulation robot" \
  --min-stars 10 \
  --limit 100
```

#### Crawler 参数

| 参数 | 说明 | 必需 |
|------|------|------|
| `--type` | 导入类型：`mcp` 或 `skill` | 是 |
| `--query` | GitHub 搜索关键词 | 是 |
| `--limit` | 最大获取数量 | 否 (默认: 50) |
| `--min-stars` | 最低 Stars 数 | 否 |
| `--language` | 编程语言过滤 | 否 |
| `--require-topics` | 必须包含的 topics | 否 |
| `--exclude` | 排除的关键词 | 否 |
| `--token` | GitHub Personal Access Token | 否 |
| `--api-key` | ROSClaw Admin API Key | 否 |
| `--dry-run` | 只搜索，不导入 | 否 |
| `--save` | 保存搜索结果到 JSON | 否 |

#### 常用搜索词

```bash
# MCP 相关
"mcp server"
"model context protocol"
"anthropic mcp"
"mcp ros2"

# Skills 相关
"ros2 skill"
"ros manipulation"
"robot navigation"
"computer vision ros"
"gazebo simulation"
```

### 方式二：从文件批量导入

### 1. 创建示例文件

```bash
python bulk_import.py --init
```

这会创建三个示例文件：
- `mcp_repos.txt` - MCP 包 GitHub URL 列表
- `skill_repos.txt` - Skill GitHub URL 列表
- `custom_import.json` - 自定义 JSON 格式数据

### 2. 准备导入列表

创建文本文件，每行一个 GitHub URL：

```bash
# mcp_repos.txt
https://github.com/modelcontextprotocol/servers
https://github.com/anthropics/anthropic-cookbook
https://github.com/example/ros2-mcp-server
```

### 3. 执行导入

**导入 MCP 包：**
```bash
python bulk_import.py \
  --type mcp \
  --file mcp_repos.txt \
  --api-key YOUR_ADMIN_API_KEY
```

**导入 Skills：**
```bash
python bulk_import.py \
  --type skill \
  --file skill_repos.txt \
  --api-key YOUR_ADMIN_API_KEY
```

### 4. 使用自定义 JSON 数据

如果需要更精细的控制，可以使用 JSON 格式：

```bash
python bulk_import.py \
  --type mcp \
  --json-file custom_import.json \
  --api-key YOUR_ADMIN_API_KEY
```

JSON 格式示例 (`custom_import.json`)：
```json
[
  {
    "name": "owner/repo",
    "description": "自定义描述",
    "github_repo_url": "https://github.com/owner/repo",
    "author_name": "Author Name",
    "category": "vision",
    "robot_type": "manipulator",
    "tags": ["ros2", "vision", "mcp"],
    "version": "1.0.0",
    "tools": [
      {"name": "tool1", "description": "工具描述"}
    ]
  }
]
```

## LLM 智能分析（默认启用）

批量导入工具默认使用 LLM（百炼/qwen-turbo）分析 README 内容，自动提取：

- **MCP Tools**: 工具名称和描述
- **分类 (category)**: 更准确的分类
- **机器人类型 (robot_type)**: 具体机器型号
- **标签 (tags)**: 相关关键词

### 配置方法

**方式一：环境变量（推荐）**
```bash
export BAILIAN_API_KEY=your_api_key_here
python bulk_import.py --type mcp --file mcp_repos.txt --api-key YOUR_ADMIN_KEY
```

**方式二：命令行参数**
```bash
python bulk_import.py \
  --type mcp \
  --file mcp_repos.txt \
  --api-key YOUR_ADMIN_KEY \
  --llm-api-key YOUR_BAILIAN_KEY
```

**方式三：跳过 LLM 分析**
```bash
python bulk_import.py \
  --type mcp \
  --file mcp_repos.txt \
  --api-key YOUR_ADMIN_KEY \
  --skip-llm
```

### 版本号规则

版本号自动基于 GitHub 仓库的最后更新时间生成：
- 格式：`YYYY.MM.DD`
- 示例：`2025.04.28`
- 如需自定义版本号，请使用 `--json-file` 方式导入

## 参数说明

| 参数 | 说明 | 必需 |
|------|------|------|
| `--type` | 导入类型：`mcp` 或 `skill` | 是 |
| `--file` | GitHub URL 列表文件路径 | 是（与 `--json-file` 二选一） |
| `--json-file` | 自定义 JSON 数据文件 | 是（与 `--file` 二选一） |
| `--api-key` | Admin API Key，用于直接发布 | 否 |
| `--base-url` | API 基础 URL，默认 `https://www.rosclaw.io` | 否 |
| `--force` | 强制导入，跳过已存在检查 | 否 |
| `--delay` | 请求间隔（秒），默认 1.0 | 否 |
| `--init` | 创建示例文件 | 否 |
| `--skip-llm` | 跳过 LLM 分析（默认启用 LLM） | 否 |
| `--llm-api-key` | LLM API Key（百炼/Bailian），默认从环境变量 `BAILIAN_API_KEY` 读取 | 否 |

## API Key 获取

1. 在网站的 `.env.local` 或环境变量中设置 `ADMIN_API_KEY`
2. 使用该 Key 调用 API 时会直接发布，跳过审核

## 自动推断规则

### 机器人类型 (robot_type)
根据仓库名称、Topics、README 自动推断：

| 类型 | 关键词 |
|------|--------|
| `humanoid` | humanoid, g1, unitree, h1, optimus, nao, pepper |
| `manipulator` | ur5, ur10, franka, panda, xarm, kinova, arm, gripper |
| `mobile` | turtlebot, mobile, navigation, slam, amr, agv |
| `drone` | drone, uav, quadcopter, mavlink, px4 |
| `legged` | quadruped, dog, a1, go1, spot |
| `universal` | 默认 |

### 分类 (category)

| 分类 | 关键词 |
|------|--------|
| `manipulation` | manipulation, grasp, pick, place |
| `vision` | vision, perception, camera, detection |
| `navigation` | navigation, path planning, slam |
| `simulation` | simulation, gazebo, mujoco, isaac |
| `control` | control, controller, pid, mpc |
| `planning` | planning, motion planning |
| `communication` | middleware, dds, bridge |
| `mcp_package` | mcp, model context protocol |
| `general` | 默认 |

## 去重机制

脚本通过以下方式检查重复：

1. **本地检查**: 调用 `/api/{type}/{name}` 检查是否已存在
2. **API 响应**: 如果 API 返回 409 (Conflict)，说明已存在
3. **跳过逻辑**: 默认跳过已存在的项目，除非使用 `--force`

## 错误处理

- 仓库不存在（404）会自动跳过并提示
- 失败的导入会记录到 `import_errors_{timestamp}.json`
- GitHub API 速率限制会自动检测并提示
- 网络错误会重试，单个失败不影响其他项目

## 删除错误导入的项目

如果导入了不存在的项目（如已被删除的仓库），可以通过 API 删除：

```bash
# 删除 MCP 包
curl -X DELETE "https://www.rosclaw.io/api/mcp-packages/owner/repo" \
  -H "x-api-key: YOUR_ADMIN_KEY"

# 删除 Skill
curl -X DELETE "https://www.rosclaw.io/api/skills/owner/repo" \
  -H "x-api-key: YOUR_ADMIN_KEY"
```

---

## 数据同步脚本 (sync_github.py)

定期同步已导入项目的 GitHub 数据：

```bash
# 基础同步（版本号、Stars、Forks、README）
python sync_github.py \
  --api-key YOUR_KEY \
  --github-token GITHUB_TOKEN

# 完整同步（包含 LLM 分析 MCP Tools）
python sync_github.py \
  --api-key YOUR_KEY \
  --github-token GITHUB_TOKEN \
  --llm-api-key BAILIAN_KEY
```

**参数说明**:
| 参数 | 说明 |
|------|------|
| `--api-key` | ROSClaw Admin API Key（必需） |
| `--github-token` | GitHub Token（提高速率限制） |
| `--llm-api-key` | Bailian LLM API Key（提取 MCP Tools） |
| `--type` | 只同步 mcp 或 skill |
| `--delay` | 请求间隔，默认 1.0 秒 |

**定时任务配置**:
```cron
# 每小时同步一次
0 * * * * cd /path/to/scripts && python sync_github.py --api-key $KEY --llm-api-key $LLM_KEY
```

## 注意事项

1. **GitHub API 限制**: 未认证请求每小时 60 次，请合理设置 `--delay`
2. **私有仓库**: 无法获取私有仓库信息，请使用 `--json-file` 手动填写
3. **API Key 安全**: 不要将 API Key 提交到 Git 仓库
4. **数据备份**: 建议先在小批量数据上测试

## 示例输出

```
============================================================
🚀 开始批量导入 MCP
📁 文件: mcp_repos.txt
📊 共 3 个项目
============================================================

[1/3]
📦 处理: https://github.com/owner/repo1
  📋 owner/repo1: A ROS2 package for robot manipulation...
  🏷️ 分类: manipulation, 机器人: manipulator
  ⭐ Stars: 42
  ✅ 创建成功 (ID: xxx-xxx-xxx)

[2/3]
📦 处理: https://github.com/owner/repo2
  📋 owner/repo2: Computer vision tools...
  🏷️ 分类: vision, 机器人: universal
  ⭐ Stars: 128
  ⏭️  已存在，跳过

[3/3]
📦 处理: https://github.com/owner/repo3
  ❌ 获取 GitHub 数据失败: 404

============================================================
📊 导入统计:
  ✅ 成功: 1
  ⏭️  跳过: 1
  ❌ 失败: 1
============================================================

⚠️  错误详情已保存到: import_errors_1234567890.json
```
