# 数据库迁移指南

## 方式一：Dashboard 手动执行（推荐）

1. 访问 https://supabase.com/dashboard/project/jstddjloiayfpvkvyofh/sql/new
2. 打开 `../supabase/migrations/001_initial_schema.sql`
3. 复制全部内容（419行）
4. 粘贴到 SQL Editor 并点击 Run
5. ✅ 完成！

## 方式二：使用 Supabase CLI（本地）

```bash
# 安装 CLI
npm install -g supabase

# 登录
supabase login

# 链接项目
supabase link --project-ref jstddjloiayfpvkvyofh

# 执行迁移
supabase db push
```

## 创建的表

- `profiles` - 用户资料
- `skills` - Skill Market 条目
- `mcp_packages` - MCP Hub 包
- `changelog_entries` - 版本变更日志
- `downloads` - 下载统计

## 验证迁移

在 SQL Editor 中执行:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

应返回 5 个表名。
