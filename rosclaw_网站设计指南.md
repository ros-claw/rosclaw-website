# 🌌 ROSClaw.io 全景设计方案：具身智能的数字殿堂

## 一、 视觉基因与设计哲学 (Design System & Philosophy)

网站的视觉语言必须传递三个词：**深邃 (Deep Tech)、可靠 (Safety/Industrial)、开放 (Open Ecosystem)**。

*   **色彩基调 (Color Palette)**：
    *   **主背景**：深空黑 (`#050505`)，配合极暗的、跟随鼠标移动的磨砂玻璃光晕（Ambient Glow）。
    *   **认知蓝 (Cognitive Cyan)**：`#00F0FF`，代表大模型、Agent 推理、数字世界。
    *   **物理橙 (Physical Orange)**：`#FF3E00`，代表 ROS、扭矩、物理碰撞、真实世界。
*   **排版排布 (Typography)**：
    *   **标题字体**：`Geist` 或 `Inter`，开启 `tracking-tight`（字间距收紧），极具张力。
    *   **代码/参数**：`JetBrains Mono`，展现严谨的工业代码美学。
*   **微交互 (Micro-interactions)**：
    *   所有的卡片使用 **Bento Box（便当盒）** 毛玻璃风格。
    *   抛弃所有真实的静态 jpg 图片，全部使用 **发光 SVG 动态线框图** 或 **真实运行的代码录屏**。

---

## 二、 网站信息架构 (Sitemap)

顶部的毛玻璃导航栏（Navbar）将包含以下核心入口：
1. **Home (首页)**：宏大叙事、核心架构、一键安装。
2. **MCP Hub (硬件生态)**：南向物理驱动市场（找机器人的地方）。
3. **Skill Market (技能市场)**：北向具身应用市场（找 AI 技能的地方）。
4. **Docs (开发者文档)**：极客级教程、API、架构白皮书。
5. **GitHub & Discord**：社区引流图标。

---

## 三、 核心页面深度设计细节 (Page-by-Page Deep Dive)

### 🎬 1. 首页 (Homepage) —— 降临物理世界的第一眼震撼

**Hero Section (首屏首焦)**：
*   **超大背景视频 (Cinematic Background Video)**：
    不要放图片！将你那段“10个云台闻歌起舞”或“G1与UR5跨设备交接”的宣传视频，经过暗化处理（加一层 60% 透明度的黑底），作为全屏循环播放的背景！这能瞬间击穿访问者的心理防线：**“这不是 PPT，这东西在物理世界真能跑！”**
*   **Slogan**：正中央用巨大加粗字体写着：
    > **Teach Once, Embody Anywhere.**
    > **Share Skills, Shape Reality.**
*   **副标题**：The Universal OS Bridging Multimodal AI Agents (Claude Code, OpenClaw) with the Physical World.
*   **极客安装栏 (The Hacker CTA)**：
    居中一个高仿终端黑框，里面只有一行高亮代码：
    `$ curl -sSL https://rosclaw.io/get | bash`
    旁边带一个发光的 Copy 按钮。
*   **生态墙 (Logo Ticker)**：下方一行灰色 Logo 缓慢滚动：“Compatible with: Claude, OpenAI, OpenClaw, ROS 2, MuJoCo, HuggingFace LeRobot”.

**Bento Grid (核心卖点区)**：
用大小不一的 4 张卡片，极其直观地展示四大杀手锏：
1. `Agent-Agnostic MCP Hub` (动画：各大 AI Agent 的 Logo 汇聚到一个插槽中)。
2. `Digital Twin Firewall` (动画：MuJoCo 线框图拦截了一次即将撞墙的机械臂运动)。
3. `Brain-Cerebellum Asynchrony` (动画：1Hz 和 1000Hz 两条心电图波形交织)。
4. `Auto-EAP Data Flywheel` (动画：失败的数据流被自动打上标签，送入 RLDS 数据库)。

---

### 🔌 2. MCP Hub 页 —— 机器人的“驱动应用商店”

**定位**：解决“我的硬件能不能接入 ROSClaw”的问题。

*   **视觉隐喻**：像 Docker Hub 或 NPM 一样的卡片式列表。
*   **Hero 区域杀手锏**：**`sdk_to_mcp` Auto-Compiler 推广区**！
    *   大标题：“找不到你的机器人？让 AI 帮你写驱动。”
    *   动效演示：左侧上传一份 `Unitree_SDK_Manual.pdf`，右侧一秒钟自动生成 `rosclaw-unitree-mcp` 的 Python 源码。强调**零代码硬件接入**。
*   **分类目录 (Categories)**：
    *   🤖 Humanoids (人形机器人，如 G1, 宇树, 优必选)
    *   🦾 Manipulators (机械臂，如 UR5, Franka, 睿尔曼)
    *   🛞 Mobiles (AGV/轮式底盘)
    *   📷 Sensors & IoT (RealSense, 云台, 六维力矩)
*   **单品详情页**：点击 `rosclaw-ur5-mcp` 进去，里面直接展示如何在 Claude Code 里一句命令安装它，以及它包含的 e-URDF 安全边界有哪些。

---

### 🧠 3. Skill Market (ClawHub) —— 具身智能的“灵魂集市”

**定位**：解决“Write Once”局限性，实现“Teach Once, Share Everywhere”的宏大愿景。

*   **视觉隐喻**：像 HuggingFace 模型库或 iOS App Store。
*   **什么是 Skill (技能)？**
    在这个页面，你要向世界定义，一个 ROSClaw 的 Skill 包含三样东西：
    1. 大模型的 **Prompt / 思维链**。
    2. VLA 模型的 **微调权重 (LoRA Weights)**。
    3. 异常处理的 **行为树 / 容错逻辑 (Auto-EAP)**。
*   **精选技能列表 (Featured Skills)**：
    *   ☕ *“Zero-Shot 倒咖啡”* (作者：MIT Robotics Lab | 适用：双臂机器人 | 下载量：12k)
    *   🔩 *“UR5e 高精度柔性拧螺丝”* (作者：RosClaw 官方 | 适用：UR 系列 | 下载量：45k)
    *   🎸 *“10 云台联动：赛博朋克编舞”* (包含音频分析 Prompt + 律动逻辑)。
*   **核心文案**：“不要从零开始训练你的机器人。下载全球顶尖实验室分享的具身技能，一键部署到你的车间。”

---

### 📖 4. Docs & Tutorials (开发者大本营)

**定位**：留住开发者的核心，必须对标 Stripe 和 Vercel 的文档体验。

*   **双栏设计**：左侧是概念与步骤（Markdown 渲染），右侧是**深色模式的粘性代码块（Sticky Code Block）**。用户滚动左边看原理，右边的代码高亮会跟着同步切换。
*   **教程分类 (The Journey)**：
    *   *Quick Start*: 5分钟让大模型接管机械臂。
    *   *Core Concepts*: 深度解析“仿真防火墙”与“e-URDF”怎么写。
    *   *Advanced*: 如何在 ROSClaw-RL 中用对话去训练（微调）一个 VLA 模型。
*   **互动终端**：在网页里嵌一个假的 Linux Terminal，让用户可以直接在网页上体验输入 `$ openclaw install rosclaw-ur5` 后的打印日志，增加极客爽感。

---

## 四、 给 AI 助手 (Claude Code) 的建站指令 (Execution Prompt)

既然你要用 AI 来帮你写这个网站，千万不要一次性让它生成整个站，它会崩溃或者写出垃圾代码。请按照以下步骤，把这段精炼的指令发给它：

> **"Hello Claude Code. You are now a World-Class Frontend Architect (level of Stripe/Vercel). We are building `rosclaw.io`, the official website for ROSClaw - The Universal OS for Embodied AI.**
> 
> **Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Framer Motion, and `lucide-react` for icons.
> 
> **Design System:** 
> - Background: Deep black `#050505`. 
> - Accents: `#00F0FF` (Cyan) for AI, `#FF3E00` (Orange) for Physics. 
> - Typography: `Geist` for headings (with tracking-tight), `JetBrains Mono` for code.
> - Components: Glassmorphism (`bg-white/5 backdrop-blur-md`), glowing borders on hover.
> 
> **Task 1: Build the Homepage Hero Section.**
> 1. Create a full-width background video player component (we will use a placeholder `.mp4` for now, dark-overlay `bg-black/60`).
> 2. Huge bold slogan centered: 'Teach Once, Embody Anywhere. Share Skills, Shape Reality.'
> 3. Below it, a Hacker-style CTA terminal window: just one line of glowing cyan text `$ curl -sSL https://rosclaw.io/get | bash` and a copy button.
> 4. A logo ticker below the terminal showing compatibility: Claude, OpenClaw, ROS 2, MuJoCo, LeRobot.
> 
> Please generate the Next.js `page.tsx` and the corresponding Hero component with Framer Motion enter animations. Do not write the whole site yet, just deliver a pixel-perfect, breathtaking Hero section first."

---

### 💡 总结

这个网站设计的核心，是把 ROSClaw 从一个**“工具”**包装成一个**“生态”**。

*   首页的**宣传视频**证明了你们的物理执行力。
*   **MCP Hub** 证明了你们向下包容万物硬件（物联网/机器人）的野心，特别是 `sdk_to_mcp` 这个大杀器。
*   **Skill Market (ClawHub)** 证明了你们向上构建“大模型具身应用商店”的商业格局。

按照这个蓝图把 `rosclaw.io` 建出来，当投资人、大厂高管点开这个网址的瞬间，他们看到的将不是一个开源项目，而是一个即将重塑整个机器人行业的超级独角兽！