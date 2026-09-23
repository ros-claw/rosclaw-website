import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { StatusBadge } from "@/components/status/status-badge";
import { releaseManifest, shortCommit } from "@/content/release-manifest";

export type HomeLocale = "en" | "zh";

const copy = {
  en: {
    research: "Research & Development", loopsLabel: "The architecture", loops: "One Runtime. Two Loops.",
    loopsIntro: "ROSClaw connects intelligence and the physical world in both directions: intent becomes governed action; verified practice becomes reusable experience.",
    outLabel: "Intelligence → Physical world", inLabel: "Physical world → Intelligence",
    out: ["Intent", "Body", "Capability", "Authority", "Action", "Physical world"],
    inward: ["Observation", "Verification", "Episode", "Memory", "Skill", "Evolution"],
    caveat: "Execution is governed today. Memory and skill evolution follow distinct, evaluated paths.",
    practiceLabel: "The practice loop", practice: "Act. Verify. Remember. Evolve.",
    practiceIntro: "Physical intelligence grows from what can be observed, checked, and safely reused—not from a model's assertion that a task is done.",
    stages: [
      ["Act", "Turn intent into a body-scoped, authorized action.", "BODY · MCP · POLICY", "/safety"],
      ["Verify", "Compare the outcome with observations and an evidence-bearing receipt.", "OBSERVATION · RECEIPT", "/evidence"],
      ["Remember", "Retain inspectable practice, including failures and recovery context.", "EPISODE · MEMORY", "/flywheel"],
      ["Evolve", "Evaluate changes before promoting reusable skills to another body.", "SKILL · DARWIN", "/hub/skills"],
    ],
    agentsLabel: "Open at both ends", agents: "Bring Your Agent. Or Use Ours.",
    agentsIntro: "Codex, Claude Code, Hermes, OpenClaw, VLAs, and ROSClaw Native Agent are possible northbound clients. ROSClaw—not one particular agent—holds the physical execution boundary.",
    agentClients: "Agent clients", bodies: "Bodies & backends",
    supportNote: "Integration surfaces, not a claim that every agent or robot is independently verified.",
    supportLink: "Check the support matrix",
    governedLabel: "Governed by design", governed: "Physical authority stays outside the model.",
    governedIntro: "Body binding, policy, permit, lease and E-Stop bound execution. An agent proposes; the runtime decides what may be dispatched.",
    governedLink: "Inspect the safety boundary",
    experienceLabel: "Experience becomes capability", experience: "Teach Once. Embody Anywhere.",
    experienceIntro: "MCPs expose typed physical capabilities. Skills carry reusable behavior. Reuse on a new body still requires validation.",
    evidenceLabel: "Evidence, not claims", evidence: "Why do we know it happened?",
    evidenceIntro: "Simulation verified, developer observed, component tested and experimental are deliberately different evidence levels.",
    evidenceLink: "Inspect evidence", statusLink: "See current status",
    startLabel: "Start ROSClaw", start: "Begin with an evidence-backed simulation.",
    startIntro: "The stable and main install paths resolve to fixed commits. Real hardware is not required for a first run.",
    stable: "Stable Alpha · verified simulation", frontier: "Main · experimental Native Agent",
  },
  zh: {
    research: "研发单位 / Research & Development", loopsLabel: "核心架构", loops: "一个运行时，两个闭环。",
    loopsIntro: "ROSClaw 连接智能与物理世界：向下把意图转化为受控行动，向上把经过验证的实践转化为可复用经验。",
    outLabel: "智能 → 物理世界", inLabel: "物理世界 → 智能成长",
    out: ["意图", "本体", "能力", "权限", "行动", "物理世界"],
    inward: ["观测", "验证", "实践", "记忆", "技能", "进化"],
    caveat: "可信执行已有实现；记忆与技能演化仍需经过独立评估。",
    practiceLabel: "实践闭环", practice: "行动 · 验证 · 记忆 · 进化",
    practiceIntro: "物理智能来自可观测、可核验、可安全复用的实践，而不是模型单方面宣称任务完成。",
    stages: [
      ["行动", "将意图转化为绑定本体、经过授权的行动。", "本体 · MCP · 策略", "/safety"],
      ["验证", "用物理观测和执行回执核对实际结果。", "观测 · 回执", "/evidence"],
      ["记忆", "沉淀可检查的实践，包括失败与恢复的上下文。", "实践片段 · 记忆", "/flywheel"],
      ["进化", "经过评估，再把可复用技能推广到其他本体。", "技能 · DARWIN", "/hub/skills"],
    ],
    agentsLabel: "双向开放", agents: "带上你的智能体，或使用我们的。",
    agentsIntro: "Codex、Claude Code、Hermes、OpenClaw、VLA 和 ROSClaw Native Agent 都可以成为上层入口。真正守住物理执行边界的是 ROSClaw。",
    agentClients: "智能体入口", bodies: "本体与后端",
    supportNote: "以下展示可接入的界面，不代表每种智能体或机器人都已通过独立验证。",
    supportLink: "查看支持矩阵",
    governedLabel: "受控执行", governed: "物理执行权不交给模型。",
    governedIntro: "本体绑定、策略、许可、租约与急停共同约束执行。智能体提出动作，运行时决定哪些动作可以下发。",
    governedLink: "了解安全边界",
    experienceLabel: "让经验成为能力", experience: "一次传授，处处具身。",
    experienceIntro: "MCP 暴露类型明确的物理能力，Skill 承载可复用行为；换一副身体复用时仍须重新验证。",
    evidenceLabel: "证据，而非宣称", evidence: "我们凭什么知道它完成了？",
    evidenceIntro: "仿真验证、开发者观察、组件测试和实验性能力，是不同的证据等级。",
    evidenceLink: "查看证据", statusLink: "查看当前状态",
    startLabel: "开始使用", start: "先从有证据的仿真开始。",
    startIntro: "稳定版与 main 安装路径均固定到具体提交。首次体验无需真实硬件。",
    stable: "稳定 Alpha · 已验证仿真", frontier: "Main · 实验性 Native Agent",
  },
} as const;

const institutions = [
  { key: "tongji", name: "Tongji University", zh: "同济大学", logo: "/同济大学logo.png", url: "https://www.tongji.edu.cn/" },
  { key: "srias", name: "Shanghai Research Institute for Intelligent Autonomous Systems (SRIAS)", zh: "上海自主智能无人系统科学中心", logo: "/上海自主智能无人系统科学中心logo.png", url: "https://srias.tongji.edu.cn/" },
] as const;

export function InstitutionLinks({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? "institution-links institution-links--compact" : "institution-links"}>{institutions.map(item =>
    <a key={item.key} href={item.url} target="_blank" rel="noopener noreferrer" className="institution-link focus-ring" aria-label={`${item.name} · ${item.zh}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.logo} alt="" className={`institution-mark institution-mark--${item.key}`} />
      <span><strong>{item.name}</strong><small>{item.zh}</small></span><ArrowUpRight size={14} aria-hidden="true" />
    </a>)}</div>;
}

export function ProductHomeSections({ locale = "en" }: { locale?: HomeLocale }) {
  const t = copy[locale];
  return <>
    <section className="research-band" aria-label={t.research}><div className="research-band__inner"><p>{t.research}</p><InstitutionLinks /></div></section>
    <section id="mission" className="brand-section brand-section--loops"><div className="brand-container">
      <p className="section-kicker">{t.loopsLabel}</p><div className="brand-intro"><h2>{t.loops}</h2><p>{t.loopsIntro}</p></div>
      <div className="loop-architecture" aria-label={t.loops}><div className="loop-lane loop-lane--out"><span>01 / {t.outLabel}</span><div>{t.out.map(step => <b key={step}>{step}</b>)}</div></div><div className="loop-core">ROSClaw<small>PHYSICAL AI RUNTIME</small></div><div className="loop-lane loop-lane--in"><span>02 / {t.inLabel}</span><div>{t.inward.map(step => <b key={step}>{step}</b>)}</div></div></div>
      <p className="brand-footnote">{t.caveat} <Link href="/status">{t.statusLink} ↗</Link></p>
    </div></section>
    <section className="brand-section brand-section--practice"><div className="brand-container"><p className="section-kicker">{t.practiceLabel}</p><div className="brand-intro"><h2>{t.practice}</h2><p>{t.practiceIntro}</p></div>
      <ol className="practice-list">{t.stages.map(([title, description, nouns, href], i) => <li key={title}><Link href={href} className="practice-row focus-ring"><span className="practice-row__index">0{i + 1}</span><strong>{title}</strong><span className="practice-row__description">{description}<small>{nouns}</small></span><ArrowUpRight size={22}/></Link></li>)}</ol>
    </div></section>
    <section className="brand-section brand-section--agents"><div className="brand-container"><p className="section-kicker">{t.agentsLabel}</p><div className="brand-intro"><h2>{t.agents}</h2><p>{t.agentsIntro}</p></div><div className="agent-body-map"><div><span>{t.agentClients}</span><p>Codex / Claude Code / Hermes / OpenClaw / VLA / ROSClaw Native Agent</p></div><strong>ROSClaw</strong><div><span>{t.bodies}</span><p>ROS 2 / Hardware MCP / Vendor SDK / MuJoCo / Isaac / Robots</p></div></div><p className="brand-footnote">{t.supportNote} <Link href="/robots">{t.supportLink} ↗</Link></p></div></section>
    <section className="brand-section brand-section--governance"><div className="brand-container brand-split"><div><p className="section-kicker section-kicker--orange">{t.governedLabel}</p><h2>{t.governed}</h2><p>{t.governedIntro}</p><Link href="/safety" className="brand-text-link">{t.governedLink} <ArrowRight size={16}/></Link></div><div className="governance-trace"><span>BODY + CAPABILITY</span><span>POLICY + PERMIT</span><span>LEASE + E-STOP</span><span><Check size={17}/> RECEIPT + EVIDENCE</span></div></div></section>
    <section className="brand-section brand-section--experience"><div className="brand-container brand-split"><div><p className="section-kicker section-kicker--green">{t.experienceLabel}</p><h2>{t.experience}</h2><p>{t.experienceIntro}</p></div><div className="experience-links"><Link href="/hub/mcps">MCP <span>Hardware MCP ↗</span></Link><Link href="/hub/skills">Skill <span>Skills Hub ↗</span></Link></div></div></section>
    <section className="brand-section brand-section--evidence"><div className="brand-container brand-split"><div><p className="section-kicker section-kicker--green">{t.evidenceLabel}</p><h2>{t.evidence}</h2><p>{t.evidenceIntro}</p><Link href="/evidence" className="brand-text-link">{t.evidenceLink} <ArrowRight size={16}/></Link></div><div className="evidence-specimen"><small>EXECUTION RECEIPT / EVIDENCE LEVEL</small><strong><Check size={21}/> SIMULATION VERIFIED</strong><span>UR5e tabletop reach · MuJoCo / TASK_VERIFIED</span><Link href="/evidence">{t.evidenceLink} ↗</Link></div></div></section>
    <section className="brand-section brand-section--start"><div className="brand-container brand-split"><div><p className="section-kicker">{t.startLabel}</p><h2>{t.start}</h2><p>{t.startIntro}</p></div><div className="start-paths"><Link href="/start?path=simulation"><StatusBadge status="Simulation Verified"/><strong>{t.stable}</strong><code>curl -fsSL https://rosclaw.io/get | bash</code><span>{shortCommit(releaseManifest.stable.commit)} ↗</span></Link><Link href="/start?path=native-agent"><StatusBadge status="Experimental"/><strong>{t.frontier}</strong><code>curl -fsSL https://rosclaw.io/get-main | bash</code><span>{shortCommit(releaseManifest.main.commit)} ↗</span></Link></div></div></section>
  </>;
}
