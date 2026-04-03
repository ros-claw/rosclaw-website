# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ROSClaw website — a marketing/documentation site for "The Universal OS for Embodied AI". The app is a **pure static export** with hardcoded data (no database, no API routes).

- **Framework**: Next.js 14.2 (App Router)
- **Language**: TypeScript (strict mode)
- **UI**: Tailwind CSS 3.4, Framer Motion 11, Lucide React
- **Fonts**: Geist Sans (headings/body) + JetBrains Mono (code)

## Common Commands

```bash
npm run dev        # Start dev server
npm run build      # Build for production (static export → dist/)
npm start          # Serve built output
npm run lint       # ESLint via next lint
```

No test framework is currently installed.

## Architecture

### Static Export

`next.config.ts` / `next.config.mjs` configures:
- `output: "export"` — fully static, no SSR
- `distDir: "dist"` — build output in `dist/`
- `trailingSlash: true` — for static hosting compatibility
- `images.unoptimized: true` — no Next.js image optimization

### App Structure

Pages and routes live in `app/`:

| Route | Description |
|-------|-------------|
| `/` | Home page — HeroSection, LogoTicker, BentoGrid, McpHubSection, SkillMarketSection, DocsSection, Footer |
| `/skills` | Skill Market listing |
| `/skills/[id]` | Individual skill detail |
| `/skills/publish` | Skill publishing form |
| `/mcp-hub` | MCP Hub package listing |
| `/mcp-hub/[id]` | Individual MCP package detail |

### Component Organization

All components live in a flat `/components/` directory. Re-exports via `components/index.ts`.

Key components:
- `ThemeProvider` / `useTheme` — React Context for light/dark theming, persisted to `localStorage`, dark default
- `Navbar.tsx` — Site navigation
- `Footer.tsx` — Site footer
- Section components: `HeroSection`, `BentoGrid`, `McpHubSection`, `SkillMarketSection`, `DocsSection`, `LogoTicker`, `TechStack`, `VideoBackground`
- Page-level: `SkillCard`, `PackageCard`, `PublishForm`, `SkillDetail`, `PackageDetail`

### Data

All content is **hardcoded** as static TypeScript arrays within component files:
- Skills and MCP packages are defined inline — no API client or data layer
- No external service integrations (no Supabase, no Prisma)

### Styling Conventions

- Tailwind CSS + CSS custom properties in `globals.css`
- Glassmorphism design system (`.glass` utility class with `backdrop-filter: blur(12px)`)
- Custom palette variables: `--cognitive-cyan`, `--physical-orange`, `--glass-bg`, `--glass-border`
- Framer Motion `variants` for staggered reveal animations (`fadeInUp`, `staggerContainer`)

### Project Structure

```
app/
├── layout.tsx                    # Root layout: ThemeProvider, SmoothScroll, Navbar
├── page.tsx                      # Home page
├── globals.css                   # Base styles, CSS variables
├── mcp-hub/                      # MCP Hub pages
└── skills/                       # Skills pages
components/
├── index.ts                      # Re-exports all components
├── ThemeProvider.tsx
├── Navbar.tsx                    # Nav bar
├── Footer.tsx
├── McpHubSection.tsx
├── SkillMarketSection.tsx
├── HeroSection.tsx
├── BentoGrid.tsx
├── DocsSection.tsx
├── LogoTicker.tsx
├── TechStack.tsx
├── VideoBackground.tsx
├── SkillCard.tsx
├── PackageCard.tsx
├── PublishForm.tsx
├── SkillDetail.tsx
└── PackageDetail.tsx
```
