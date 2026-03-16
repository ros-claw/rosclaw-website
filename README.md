# 🚀 ROSClaw Website

**[rosclaw.io](https://rosclaw.io) — The Operating System for Embodied AI.**

ROSClaw is the "AUTOSAR + Android" for the robotics industry. We are building a universal, software-defined Embodied AI framework that seamlessly integrates low-frequency LLM reasoning with high-frequency ROS/VLA control. 

Stop building custom state machines. Start building intelligent agents that **"Write Once, Embody Anywhere."**

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animation**: Framer Motion
- **Diagrams**: React Flow
- **Icons**: Lucide React

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run start
```

## 📁 Project Structure

```
rosclaw-website/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── sections/           # Page sections
│   │   ├── authentic-terminal.tsx
│   │   ├── embodiment-demo.tsx
│   │   ├── features.tsx
│   │   ├── architecture-graph.tsx
│   │   ├── data-flywheel.tsx
│   │   ├── installation.tsx
│   │   └── cta.tsx
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── ambient-background.tsx
├── messages/               # i18n translations
│   ├── en.json
│   └── zh.json
└── public/                 # Static assets
```

## 🌍 Features

- ✅ Responsive design (mobile-first)
- ✅ Bilingual support (English/Chinese)
- ✅ Dynamic terminal simulator with typing animation
- ✅ Interactive robot embodiment showcase
- ✅ React Flow architecture diagram
- ✅ Data flywheel visualization
- ✅ Mouse-tracking ambient background effects

## 📦 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Manual Static Hosting

The `dist/` folder contains the static build output ready for any static hosting service.

## 📄 License

MIT © 2026 ROSClaw Team
