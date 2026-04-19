# ROSClaw 批量导入工具

自动批量导入 MCP 包和 Skills 到 rosclaw.io 网站。

## 功能特性

- 🔗 **自动获取 GitHub 信息**: 从 GitHub API 自动抓取仓库描述、Topics、Stars、Forks
- 🏷️ **智能分类**: 根据仓库名称、Topics、README 自动推断分类和机器人类型
- 🚫 **自动去重**: 基于 `name` 字段检查是否已存在，避免重复导入
- 🔑 **API Key 支持**: 使用 API Key 直接发布，跳过审核流程
- 📊 **导入统计**: 显示成功、跳过、失败的数量和详细错误日志
- 📝 **多种输入格式**: 支持 URL 列表文件或自定义 JSON 数据

## 安装依赖

```bash
cd scripts
pip install -r requirements.txt
```

## 使用方法

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

- 失败的导入会记录到 `import_errors_{timestamp}.json`
- GitHub API 速率限制会自动检测并提示
- 网络错误会重试，单个失败不影响其他项目

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
