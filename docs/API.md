# ROSClaw 后台 API 文档

本文档面向爬虫/数据团队，用于批量发布和同步 MCP 包和 Skills。

## 基础信息

- **Base URL**: `https://www.rosclaw.io`
- **认证方式**: Header `x-api-key: YOUR_ADMIN_API_KEY`
- **Content-Type**: `application/json`

---

## MCP 包 API

### 1. 创建 MCP 包

**Endpoint**: `POST /api/mcp-packages`

**Headers**:
```
x-api-key: YOUR_ADMIN_API_KEY
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "owner/repo",
  "description": "简短的描述",
  "long_description": "完整的 README 内容",
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
```

**字段说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 格式: owner/repo，唯一标识 |
| `description` | string | ✅ | 简短描述，显示在列表页 |
| `long_description` | string | 可选 | 详细描述/README，显示在详情页 |
| `github_repo_url` | string | ✅ | GitHub 仓库地址 |
| `author_name` | string | ✅ | 作者名 |
| `category` | string | 可选 | 分类: manipulation/vision/navigation/simulation/control/planning/communication/mcp_package/general |
| `robot_type` | string | 可选 | 机器人类型: humanoid/manipulator/mobile/drone/legged/universal |
| `tags` | string[] | 可选 | 标签数组 |
| `version` | string | 可选 | 版本号，格式 YYYY.MM.DD（基于 GitHub 更新时间） |
| `tools` | object[] | 可选 | MCP 工具列表，每个包含 name 和 description |

**响应**:
```json
{
  "id": "uuid",
  "name": "owner/repo",
  "description": "...",
  "status": "approved",
  "message": "Package created successfully"
}
```

**状态码**:
- `201` - 创建成功
- `400` - 参数错误
- `401` - API Key 无效
- `409` - 包已存在
- `500` - 服务器错误

---

### 2. 更新 MCP 包

**Endpoint**: `PUT /api/mcp-packages/{name}`

**说明**: 更新现有包的信息（同步最新数据）

**请求体**: 同创建，只传需要更新的字段

**响应**: 更新后的包数据

---

### 3. 获取 MCP 包

**Endpoint**: `GET /api/mcp-packages/{name}`

**响应**:
```json
{
  "id": "uuid",
  "name": "owner/repo",
  "description": "...",
  "githubRepoUrl": "...",
  "githubStars": 42,
  "viewsCount": 100,
  "status": "approved",
  ...
}
```

---

### 4. 删除 MCP 包

**Endpoint**: `DELETE /api/mcp-packages/{name}`

**Headers**: `x-api-key: YOUR_ADMIN_API_KEY`

**示例**:
```bash
curl -X DELETE "https://www.rosclaw.io/api/mcp-packages/owner/repo" \
  -H "x-api-key: YOUR_ADMIN_API_KEY"
```

**响应**:
```json
{
  "message": "Package deleted successfully"
}
```

---

### 5. 列表 MCP 包

**Endpoint**: `GET /api/mcp-packages?category={category}&search={keyword}`

**查询参数**:
- `category` - 按分类过滤
- `search` - 关键词搜索（匹配 name/description）

---

## Skills API

### 1. 创建 Skill

**Endpoint**: `POST /api/skills`

**Headers**:
```
x-api-key: YOUR_ADMIN_API_KEY
Content-Type: application/json
```

**请求体**:
```json
{
  "name": "owner/repo",
  "display_name": "Display Name",
  "description": "简短的描述",
  "long_description": "完整的 README 内容",
  "github_repo_url": "https://github.com/owner/repo",
  "author_name": "Author Name",
  "author_url": "https://github.com/author",
  "category": "manipulation",
  "robot_types": ["manipulator"],
  "compatible_robots": ["UR5", "FRANKA"],
  "tags": ["ros2", "grasping"],
  "version": "1.0.0",
  "dependencies": ["moveit2", "ros2_control"]
}
```

**字段说明**:

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 格式: owner/repo，唯一标识 |
| `display_name` | string | 可选 | 显示名称，默认使用 name |
| `description` | string | ✅ | 简短描述 |
| `long_description` | string | 可选 | 详细描述/README |
| `github_repo_url` | string | ✅ | GitHub 仓库地址 |
| `author_name` | string | ✅ | 作者名 |
| `author_url` | string | 可选 | 作者主页 |
| `category` | string | 可选 | 同 MCP 分类 |
| `robot_types` | string[] | 可选 | 支持的机器人类型列表 |
| `compatible_robots` | string[] | 可选 | 具体兼容的机器人型号 |
| `tags` | string[] | 可选 | 标签数组 |
| `version` | string | 可选 | 版本号 |
| `dependencies` | string[] | 可选 | 依赖包列表 |

---

### 2. 其他 Skill API

同 MCP 包:
- `GET /api/skills/{name}` - 获取
- `PUT /api/skills/{name}` - 更新
- `DELETE /api/skills/{name}` - 删除
- `GET /api/skills` - 列表

### 删除 Skill 示例

```bash
curl -X DELETE "https://www.rosclaw.io/api/skills/owner/repo" \
  -H "x-api-key: YOUR_ADMIN_API_KEY"
```

---

## GitHub 导入辅助 API

### 自动分析 GitHub 仓库

**Endpoint**: `POST /api/github/import`

**说明**: 分析 GitHub 仓库，自动提取信息

**请求体**:
```json
{
  "repoUrl": "https://github.com/owner/repo",
  "token": "optional-github-token"
}
```

**响应**:
```json
{
  "name": "repo",
  "displayName": "owner/repo",
  "description": "...",
  "category": "vision",
  "robotType": "manipulator",
  "tags": ["ros2", "vision"]
}
```

---

## 批量导入示例代码

### Python

```python
import requests

BASE_URL = "https://www.rosclaw.io"
API_KEY = "your_admin_api_key"

headers = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json"
}

# 创建 MCP 包
def create_mcp_package(data):
    res = requests.post(
        f"{BASE_URL}/api/mcp-packages",
        headers=headers,
        json=data
    )
    return res.json()

# 创建 Skill
def create_skill(data):
    res = requests.post(
        f"{BASE_URL}/api/skills",
        headers=headers,
        json=data
    )
    return res.json()

# 检查是否存在
def check_exists(name, item_type="mcp"):
    endpoint = "mcp-packages" if item_type == "mcp" else "skills"
    res = requests.get(f"{BASE_URL}/api/{endpoint}/{name}")
    return res.status_code == 200

# 示例：批量导入
packages = [
    {
        "name": "ros-claw/camera-mcp",
        "description": "Camera integration MCP server",
        "github_repo_url": "https://github.com/ros-claw/camera-mcp",
        "author_name": "ros-claw",
        "category": "vision",
        "robot_type": "universal",
        "tags": ["camera", "vision", "mcp"]
    }
]

for pkg in packages:
    if check_exists(pkg["name"], "mcp"):
        print(f"跳过已存在: {pkg['name']}")
        continue
    
    result = create_mcp_package(pkg)
    print(f"创建成功: {result['id']}")
```

### cURL

```bash
# 创建 MCP 包
curl -X POST https://www.rosclaw.io/api/mcp-packages \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "owner/repo",
    "description": "Description",
    "github_repo_url": "https://github.com/owner/repo",
    "author_name": "Author",
    "category": "vision"
  }'

# 创建 Skill
curl -X POST https://www.rosclaw.io/api/skills \
  -H "x-api-key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "owner/repo",
    "display_name": "Display Name",
    "description": "Description",
    "github_repo_url": "https://github.com/owner/repo",
    "author_name": "Author"
  }'
```

---

## 错误处理

**错误响应格式**:
```json
{
  "error": "错误描述"
}
```

**常见错误**:

| 状态码 | 错误 | 说明 |
|--------|------|------|
| 400 | Missing required field: name | 缺少必需字段 |
| 401 | Invalid API key | API Key 无效 |
| 409 | Package with this name already exists | 包已存在 |
| 500 | Failed to create package | 服务器内部错误 |

---

## 注意事项

1. **API Key 安全**: 不要泄露 ADMIN_API_KEY，建议使用环境变量
2. **去重机制**: API 会自动检查 name 是否已存在，返回 409
3. **速率限制**: 请合理控制请求频率，避免对服务器造成压力
4. **数据质量**: 建议先检查数据完整性再调用 API
