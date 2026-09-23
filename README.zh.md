# ROSClaw 官网

**赋予 AI 身体，让实践驱动进化。**

[ROSClaw](https://github.com/ros-claw/rosclaw) 官网。ROSClaw 是面向具身智能体的 Physical AI Runtime。[English](README.md) · [中文](README.zh.md) · [访问网站](https://www.rosclaw.io/)

网站展示 ROSClaw 如何把智能体意图转化为受控的物理行动，并让经过验证的实践为记忆与可复用技能提供依据。Hub 重点展示硬件 MCP 与 Skills：**一次传授，处处具身。**

## 本地开发

```bash
npm ci
npm run dev
```

## 检查与部署

```bash
npm test
npm run build
```

网站使用 Next.js App Router，包含服务端渲染的资产目录页面和 API。Vercel 自动部署 GitHub `main` 分支。产品状态和发布声明与锁定的核心版本数据核对；品牌措辞见[品牌语言指南](docs/BRAND_LANGUAGE.md)，资产定时同步见[同步说明](docs/GITHUB_SYNC_CRON.md)。
