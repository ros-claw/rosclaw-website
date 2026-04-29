# ROSClaw 批量导入指南

## 文档版本
- **版本**: v1.0
- **日期**: 2026-04-25
- **适用对象**: 外部数据团队/爬虫团队

---

> **✅ 更新提示（2026-04-29）**
> 
> **LLM 分析现已默认启用**，无需手动添加参数：
> - MCP Tools 会自动从 README 中提取
> - 分类和机器人类型由 LLM 智能推断
> - 如需禁用 LLM，请使用 `--skip-llm` 参数
> 
> 示例：`python bulk_import.py --type mcp --file urls.txt --api-key KEY`

---

## 一、系统概述

### 1.1 什么是 ROSClaw

ROSClaw 是面向具身智能（Embodied AI）领域的开源平台，包含两个核心市场：

| 市场 | 说明 | 示例内容 |
|------|------|----------|
| **MCP Hub** | Model Context Protocol 包市场 | ROS2 驱动、硬件接口、MCP 服务器 |
| **Skill Market** | 机器人技能市场 | 抓取、导航、视觉识别等技能包 |

### 1.2 批量导入架构

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   外部数据源     │     │   批量导入工具   │     │   ROSClaw 平台   │
│  (GitHub/爬虫)   │────▶│  (Python 脚本)   │────▶│   (数据库/API)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │  LLM 智能分析    │
                       │  (可选，推荐)    │
                       └─────────────────┘
```

---

## 二、工作原理

### 2.1 数据流向

```
GitHub URL
    │
    ▼
┌──────────────────────────────────────┐
│ Step 1: 获取 GitHub 元数据            │
│ - 仓库描述、Topics、Stars、Forks      │
│ - README 内容 (Base64 解码)           │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 2: 内容分析 (默认 LLM)           │
│                                      │
│ 方式 A: LLM 智能分析 (默认启用)        │
│ - 使用大模型理解 README 语义           │
│ - 自动提取工具、依赖、标签             │
│ - 准确率高，推荐用于 MCP 包            │
│                                      │
│ 方式 B: 本地规则匹配 (禁用 LLM 时)     │
│ - 关键词匹配分类和机器人类型            │
│ - 使用 `--skip-llm` 参数启用           │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 3: 数据去重检查                  │
│ - 检查 name (owner/repo) 是否已存在   │
│ - 存在则跳过或更新                    │
└──────────────────────────────────────┘
    │
    ▼
┌──────────────────────────────────────┐
│ Step 4: 提交到 ROSClaw API            │
│ - 使用 Admin API Key 直接发布         │
│ - 数据存入 Supabase 数据库            │
└──────────────────────────────────────┘
```

### 2.2 核心字段说明

#### MCP 包字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 格式: `owner/repo`，唯一标识 |
| `description` | string | ✅ | 简短描述，用于列表展示 |
| `long_description` | string | 可选 | 详细描述，默认为 README 内容 |
| `readme_content` | string | 可选 | 缓存的完整 README |
| `github_repo_url` | string | ✅ | GitHub 仓库地址 |
| `author_name` | string | ✅ | 作者名 |
| `category` | string | 可选 | 分类: `manipulation`/`vision`/`navigation`/`simulation`/`control`/`planning`/`communication`/`mcp_package`/`general` |
| `robot_type` | string | 可选 | 机器人类型: `humanoid`/`manipulator`/`mobile`/`drone`/`legged`/`universal` |
| `tags` | string[] | 可选 | 标签数组，最多10个 |
| `version` | string | 可选 | 版本号，自动从 GitHub 更新时间生成 (YYYY.MM.DD) |
| `tools` | object[] | 可选 | MCP 工具列表，`{name, description}`。**必须使用 `--use-llm` 才能正确提取** |
| `github_stars` | number | 可选 | GitHub Stars 数 |
| `github_forks` | number | 可选 | GitHub Forks 数 |

#### Skill 字段

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 格式: `owner/repo`，唯一标识 |
| `display_name` | string | 可选 | 显示名称，默认使用 `name` |
| `description` | string | ✅ | 简短描述 |
| `long_description` | string | 可选 | 详细描述/ README |
| `readme_content` | string | 可选 | 缓存的完整 README |
| `github_repo_url` | string | ✅ | GitHub 仓库地址 |
| `author_name` | string | ✅ | 作者名 |
| `author_url` | string | 可选 | 作者主页 |
| `category` | string | 可选 | 同 MCP 分类 |
| `robot_types` | string[] | 可选 | 支持的机器人类型列表 |
| `compatible_robots` | string[] | 可选 | 具体兼容的机器人型号，如 `["UR5", "Franka Panda"]` |
| `tags` | string[] | 可选 | 标签数组 |
| `version` | string | 可选 | 版本号 |
| `dependencies` | string[] | 可选 | 依赖包列表，如 `["moveit2", "ros2_control"]` |
| `github_stars` | number | 可选 | GitHub Stars 数 |

### 2.3 智能分类原理

#### 本地规则匹配

**机器人类型推断**（基于关键词）：
```python
humanoid:   ["humanoid", "g1", "unitree", "h1", "optimus", "nao", "pepper"]
manipulator: ["ur5", "ur10", "franka", "panda", "xarm", "kinova", "arm", "gripper"]
mobile:     ["turtlebot", "mobile", "navigation", "slam", "amr", "agv"]
drone:      ["drone", "uav", "quadcopter", "mavlink", "px4"]
legged:     ["quadruped", "dog", "a1", "go1", "spot"]
```

**分类推断**（基于关键词）：
```python
manipulation: ["manipulation", "grasp", "pick", "place"]
vision:       ["vision", "perception", "camera", "detection"]
navigation:   ["navigation", "path planning", "slam"]
simulation:   ["simulation", "gazebo", "mujoco", "isaac"]
control:      ["control", "controller", "pid", "mpc"]
```

#### LLM 智能分析（推荐）

使用阿里云百炼 (Bailian) API 进行语义分析：
- **输入**: README 内容 + 仓库描述
- **输出**: 结构化 JSON（分类、机器人类型、标签、工具列表）
- **模型**: `qwen-turbo`
- **优势**: 理解自然语言语义，准确率高

---

## 三、快速开始

### 3.1 环境准备

```bash
# 1. 克隆代码仓库
git clone https://github.com/ros-claw/rosclaw-website.git
cd rosclaw-website/scripts

# 2. 安装依赖
pip install -r requirements.txt

# 3. 配置环境变量（两种方式任选其一）

# 方式一：使用 .env 文件（推荐，自动读取）
cp .env.example .env
# 然后编辑 .env 文件填入你的 API Key

# 方式二：导出到系统环境变量
export ADMIN_API_KEY="your_rosclaw_admin_key"
# 或 export NEXT_PUBLIC_ADMIN_KEY="your_rosclaw_admin_key"
export BAILIAN_API_KEY="your_aliyun_bailian_key"  # 可选，用于 LLM 分析
```

### 3.2 准备导入文件

创建文本文件，每行一个 GitHub URL：

**mcp_repos.txt**:
```
# MCP 包列表
https://github.com/ros-claw/realsense-ros-mcp
https://github.com/ros-claw/ur-rtde-mcp
https://github.com/ros-claw/ur-ros2-mcp
```

**skill_repos.txt**:
```
# Skills 列表
https://github.com/ros-planning/moveit
https://github.com/IntelRealSense/realsense-ros
```

### 3.3 标准导入（默认启用 LLM）

```bash
python bulk_import.py \
  --type mcp \
  --file mcp_repos.txt \
  --api-key $ADMIN_API_KEY
```

**默认行为：**
- ✅ LLM 自动分析 README，提取 MCP Tools
- ✅ 智能推断分类和机器人类型
- ✅ 版本号基于 GitHub 更新时间 (YYYY.MM.DD)

### 3.4 仅使用本地规则（跳过 LLM）

如需禁用 LLM 分析（使用关键词匹配）：

```bash
python bulk_import.py \
  --type mcp \
  --file mcp_repos.txt \
  --api-key $ADMIN_API_KEY \
  --skip-llm
```

**注意：**
- **使用 `--skip-llm`**：MCP Tools 提取依赖简单的正则匹配，**结果通常为空或不完整**
- **不使用 `--skip-llm`**：LLM 智能分析 README，**准确提取工具名称、描述和功能**
- **推荐配置**：保持默认启用 LLM 分析

---

## 四、API 接口文档

### 4.1 认证方式

所有 API 请求需要携带 Header：
```
x-api-key: YOUR_ADMIN_API_KEY
Content-Type: application/json
```

### 4.2 MCP 包 API

#### 创建 MCP 包
```http
POST https://www.rosclaw.io/api/mcp-packages
Headers:
  x-api-key: YOUR_KEY
  Content-Type: application/json

Body:
{
  "name": "owner/repo",
  "description": "简短的描述",
  "github_repo_url": "https://github.com/owner/repo",
  "author_name": "Author Name",
  "category": "vision",
  "robot_type": "manipulator",
  "tags": ["ros2", "vision", "mcp"],
  "version": "1.0.0",
  "tools": [
    {"name": "get_camera_feed", "description": "获取相机画面"}
  ]
}

Response (201 Created):
{
  "id": "uuid",
  "name": "owner/repo",
  "status": "approved",
  "message": "Package created successfully"
}
```

#### 更新 MCP 包
```http
PUT https://www.rosclaw.io/api/mcp-packages/owner/repo
Headers:
  x-api-key: YOUR_KEY

Body:
{
  "github_stars": 100,
  "readme_content": "最新的 README 内容",
  "last_synced_at": "2026-04-25T10:00:00Z"
}

Response (200 OK):
{
  "id": "uuid",
  "name": "owner/repo",
  "message": "Package updated successfully"
}
```

#### 检查是否存在
```http
GET https://www.rosclaw.io/api/mcp-packages/owner/repo

Response:
- 200: 存在
- 404: 不存在
```

### 4.3 Skills API

#### 创建 Skill
```http
POST https://www.rosclaw.io/api/skills
Headers:
  x-api-key: YOUR_KEY

Body:
{
  "name": "owner/repo",
  "display_name": "Display Name",
  "description": "简短的描述",
  "github_repo_url": "https://github.com/owner/repo",
  "author_name": "Author Name",
  "category": "manipulation",
  "robot_types": ["manipulator"],
  "compatible_robots": ["UR5", "Franka Panda"],
  "tags": ["ros2", "grasping"],
  "version": "1.0.0",
  "dependencies": ["moveit2", "ros2_control"]
}
```

#### 更新 Skill
```http
PUT https://www.rosclaw.io/api/skills/owner/repo
Headers:
  x-api-key: YOUR_KEY

Body:
{
  "github_stars": 50,
  "readme_content": "更新的 README",
  "last_synced_at": "2026-04-25T10:00:00Z"
}
```

---

## 五、高级功能

### 5.1 GitHub 自动爬虫

自动搜索 GitHub 仓库并导入：

```bash
python github_crawler.py \
  --type mcp \
  --query "mcp server ros" \
  --limit 50 \
  --min-stars 10 \
  --api-key $ADMIN_API_KEY \
  --token $GITHUB_TOKEN
```

**参数说明**:
- `--query`: GitHub 搜索关键词
- `--limit`: 最大获取数量
- `--min-stars`: 最低 Stars 数过滤
- `--language`: 编程语言过滤
- `--dry-run`: 预览模式，只搜索不导入

### 5.2 定时数据同步

保持网站数据与 GitHub 同步（版本号、Stars、Forks、README、MCP Tools）：

```bash
# 基础同步（更新版本号、Stars、README）
python sync_github.py \
  --api-key $ADMIN_API_KEY \
  --github-token $GITHUB_TOKEN

# 完整同步（包含 LLM 分析 MCP Tools）
python sync_github.py \
  --api-key $ADMIN_API_KEY \
  --github-token $GITHUB_TOKEN \
  --llm-api-key $BAILIAN_API_KEY
```

**同步内容**:
- ✅ 版本号（基于 GitHub 更新时间 YYYY.MM.DD）
- ✅ GitHub Stars / Forks
- ✅ README 内容
- ✅ MCP Tools（需配置 `--llm-api-key`）

**建议配置定时任务**:
```cron
# 每小时同步一次
0 * * * * cd /path/to/scripts && python sync_github.py --api-key $ADMIN_API_KEY --llm-api-key $BAILIAN_API_KEY
```

### 5.3 从 JSON 导入

对于复杂数据，可使用 JSON 格式：

```bash
python bulk_import.py \
  --type mcp \
  --json-file custom_data.json \
  --api-key $ADMIN_API_KEY
```

**custom_data.json 示例**:
```json
[
  {
    "name": "ros-claw/custom-mcp",
    "description": "自定义 MCP 服务器",
    "github_repo_url": "https://github.com/ros-claw/custom-mcp",
    "author_name": "ros-claw",
    "category": "vision",
    "robot_type": "manipulator",
    "tags": ["ros2", "vision", "mcp"],
    "version": "1.0.0",
    "tools": [
      {"name": "detect_objects", "description": "物体检测"}
    ]
  }
]
```

---

## 六、注意事项

### 6.1 去重机制

- 基于 `name` 字段（`owner/repo` 格式）进行去重
- 如果已存在，默认跳过（可使用 `--force` 强制更新）
- API 返回 409 表示已存在

### 6.2 速率限制

| 服务 | 限制 | 说明 |
|------|------|------|
| GitHub API | 60次/小时（无Token）<br>5000次/小时（有Token） | 建议提供 GitHub Token |
| ROSClaw API | 无严格限制 | 请合理控制频率 |

### 6.3 数据质量建议

1. **优先使用 LLM 分析**: 准确率远高于本地规则
2. **验证关键字段**: 导入后抽查 category 和 robot_type
3. **保持同步**: 定期运行 `sync_github.py` 更新 Stars 和 README

### 6.4 错误处理

- 失败的导入会记录到 `import_errors_{timestamp}.json`
- 单个失败不影响其他项目继续导入
- 网络错误会自动重试

---

## 七、常见问题

### Q1: 为什么使用 LLM 分析？

**A**: 本地规则只能做关键词匹配，LLM 可以理解 README 的语义内容，更准确提取：
- MCP 工具列表及其功能描述
- 支持的机器人类型
- 项目依赖关系
- 精确的子分类

### Q2: 导入后多久能在网站看到？

**A**: 使用 Admin API Key 导入会立即发布（status=approved），无需审核，立即可见。

### Q3: 如何更新已导入的项目？

**A**: 使用 `sync_github.py` 脚本或调用 PUT API 更新特定字段。

### Q4: 可以导入私有仓库吗？

**A**: 不能直接导入。需要手动填写 JSON 数据，使用 `--json-file` 参数导入。

---

## 八、联系方式

如有问题或建议，请联系：
- **GitHub Issues**: https://github.com/ros-claw/rosclaw-website/issues
- **文档更新**: 本文档随代码同步更新

---

**附录: 完整命令参考**

```bash
# 标准导入（LLM 自动分析）
python bulk_import.py --type mcp --file urls.txt --api-key KEY

# 跳过 LLM 分析
python bulk_import.py --type mcp --file urls.txt --api-key KEY --skip-llm

# GitHub 爬虫
python github_crawler.py --type mcp --query "ros mcp" --limit 50 --api-key KEY

# 数据同步
python sync_github.py --api-key KEY --github-token TOKEN

# 强制重新导入
python bulk_import.py --type mcp --file urls.txt --api-key KEY --force

# 删除不存在的项目
curl -X DELETE "https://www.rosclaw.io/api/mcp-packages/owner/repo" \
  -H "x-api-key: YOUR_KEY"
```
