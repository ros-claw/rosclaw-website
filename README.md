# ROSClaw Website

**Give AI a Body. Let Experience Drive Evolution.**

The website for [ROSClaw](https://github.com/ros-claw/rosclaw), the Physical AI Runtime for Embodied Agents. [English](README.md) · [中文](README.zh.md) · [Live site](https://www.rosclaw.io/)

The site explains how ROSClaw connects agent intent to governed physical action and how verified practice can inform memory and reusable skills. Its Hub focuses on hardware MCPs and Skills: **Teach Once. Embody Anywhere.**

<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/institutions/rd-lockup-dark.png">
  <img src="public/brand/institutions/rd-lockup-light.png" width="900" alt="Research and Development: Tongji University and Shanghai Research Institute for Intelligent Autonomous Systems (SRIAS)">
</picture>
<br>
<a href="https://www.tongji.edu.cn/">Tongji University</a> · <a href="https://srias.tongji.edu.cn/">SRIAS</a>
</div>

The [English](https://www.rosclaw.io/) and [Chinese](https://www.rosclaw.io/zh) homepages share the same brand narrative.

## Development

```bash
npm ci
npm run dev
```

## Checks and deployment

```bash
npm test
npm run build
```

This is a Next.js App Router site with server-rendered registry pages and API routes. Vercel deploys the GitHub `main` branch. Product status and release claims are checked against the pinned core release data; see [brand language](docs/BRAND_LANGUAGE.md) and the [registry refresh schedule](docs/GITHUB_SYNC_CRON.md).
