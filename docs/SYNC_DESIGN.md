# ROSClaw 自动同步设计方案

## 问题背景

1. 网站显示的 README 应该与 GitHub 仓库保持一致
2. Stars、Forks 等数据需要定期同步
3. 不需要 "README.md (editable)" 步骤，直接显示 GitHub 原始内容

## 解决方案

### 方案一：实时获取（当前已实现）

**原理**: 用户访问详情页时，实时调用 GitHub API 获取 README

**优点**:
- 数据永远最新
- 无需维护同步机制

**缺点**:
- 受 GitHub API 速率限制
- 页面加载慢（需要额外请求）
- 如果 GitHub 宕机，页面显示异常

### 方案二：定时同步（推荐）

**原理**: 后台定时任务定期同步所有项目的 GitHub 数据

**优点**:
- 页面加载快（从数据库读取）
- 不受 GitHub API 限制影响用户体验
- 可离线查看

**缺点**:
- 需要维护同步任务
- 数据有一定延迟（可接受）

### 方案三：Webhook 触发（GitHub App）

**原理**: 安装 GitHub App，仓库更新时推送事件到网站

**优点**:
- 实时同步
- 精准的变更触发

**缺点**:
- 需要用户安装 GitHub App
- 实现复杂度高

---

## 推荐方案：方案二 + 方案一 结合

### 1. 数据库添加同步字段

```sql
-- 添加同步相关字段
ALTER TABLE mcp_packages ADD COLUMN last_synced_at TIMESTAMP;
ALTER TABLE mcp_packages ADD COLUMN readme_content TEXT;
ALTER TABLE mcp_packages ADD COLUMN github_updated_at TIMESTAMP;

ALTER TABLE skills ADD COLUMN last_synced_at TIMESTAMP;
ALTER TABLE skills ADD COLUMN readme_content TEXT;
ALTER TABLE skills ADD COLUMN github_updated_at TIMESTAMP;
```

### 2. 创建同步 API

```
POST /api/admin/sync-all          # 同步所有项目
POST /api/admin/sync/{name}       # 同步单个项目
GET  /api/admin/sync-status       # 查看同步状态
```

### 3. 创建定时同步脚本

```python
# sync_github_data.py
# 每小时运行一次，同步所有项目的 README 和 Stars
```

### 4. 前端显示策略

- **优先从数据库读取** README（快）
- **如果数据库没有或过期**，实时获取 GitHub（备用）
- **Stars 显示**: 数据库缓存值 + 实时 API 刷新

---

## 关于 "README.md (editable)" 的改进

当前手动发布流程的问题：
1. 用户导入时显示 editable README
2. 但实际保存时只用了 description，没用 readmeMd
3. 详情页实时获取 GitHub README

### 改进建议

**短期**: 直接移除 editable README 步骤
- 详情页直接显示 GitHub 实时 README
- 发布时不需要填写 long_description

**长期**: 添加 "自定义 README" 开关
- 默认使用 GitHub README
- 可选覆盖为自定义内容

---

## 实施计划

### Phase 1: API 完善
1. 添加 PUT /api/mcp-packages/{name} 更新接口
2. 添加 PUT /api/skills/{name} 更新接口
3. 添加批量同步接口

### Phase 2: 同步脚本
1. 创建 sync_github_data.py 定时脚本
2. 添加数据库字段存储缓存数据
3. 配置定时任务（GitHub Actions / Cron）

### Phase 3: 前端优化
1. 发布流程移除 editable README
2. 详情页优先使用缓存数据
3. 添加 "刷新 README" 按钮

---

## 立即可以做的改进

### 1. 修复发布流程（5分钟）

修改 `publish-client.tsx`:
- Step 2 移除 README editable textarea
- 直接显示 GitHub README preview
- 提交时不需要传 long_description

### 2. 添加更新 API（30分钟）

创建 `PUT /api/mcp-packages/[...id]/route.ts`:
- 允许更新所有字段
- 用于同步最新数据

### 3. 创建同步脚本（1小时）

创建 `scripts/sync_all.py`:
- 遍历所有项目
- 获取 GitHub 最新数据
- 调用更新 API
