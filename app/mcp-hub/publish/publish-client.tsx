"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Tags, Info, Check, AlertCircle, Github, Sparkles, Copy, CheckCircle, HelpCircle, X, Terminal, Bot, MessageSquare, Code } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAgentAdaptations, packageNameExists, suggestAlternativeNames } from "@/lib/data";

const predefinedCategories = [
  "Manipulators",
  "Humanoids",
  "Mobile Bases",
  "Sensors",
  "Grippers",
  "Cameras",
  "End Effectors",
];

const OFFICIAL_ORGS = ["ros-claw", "rosclaw"];

export default function PublishMcpPackagePage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    version: "1.0.0",
    description: "",
    category: "",
    customCategory: "",
    robotType: "",
    tags: [] as string[],
    githubUrl: "",
    readmeMd: ``,
    tools: [] as { name: string; description: string }[],
    isOfficial: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [nameCheckResult, setNameCheckResult] = useState<{ available?: boolean; message?: string; suggestions?: string[] } | null>(null);
  const [showInstallCommand, setShowInstallCommand] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNameHelp, setShowNameHelp] = useState(false);
  const [showRuntimeModal, setShowRuntimeModal] = useState(false);

  const isOfficialRepo = (url: string) => {
    return OFFICIAL_ORGS.some(org => url.toLowerCase().includes(`github.com/${org.toLowerCase()}`));
  };

  const generateInstallCommand = (name: string) => {
    return `rosclaw mcp install ${name}`;
  };

  // Get agent adaptations for display
  const getAgentCommands = (name: string) => [
    { agent: "OpenClaw", command: `install mcp ${name}` },
    { agent: "Claude Code", command: `@rosclaw install mcp ${name}` },
    { agent: "Generic Agent", command: `Use ROSClaw MCP to install "${name}"` },
  ];

  // Name Help Tooltip Component
  const NameHelpTooltip = () => (
    <div className="absolute z-50 left-0 top-full mt-2 w-80 p-4 rounded-lg bg-card-bg border border-glass-border shadow-xl">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground">Package Naming</h4>
        <button onClick={() => setShowNameHelp(false)} className="text-text-muted hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-3 text-sm">
        <div>
          <p className="font-medium text-cognitive-cyan">Package Name (Locked)</p>
          <p className="text-text-secondary">The unique identifier derived from your GitHub repo name. Used in commands like:</p>
          <code className="block mt-1 p-1.5 rounded bg-black/40 text-xs text-cognitive-cyan font-mono">
            rosclaw mcp install your-package
          </code>
        </div>
        <div>
          <p className="font-medium text-cognitive-cyan">Display Name (Editable)</p>
          <p className="text-text-secondary">Human-friendly name shown in listings. Can include spaces, emoji, and special characters.</p>
          <p className="text-xs text-text-muted mt-1">Example: &quot;Universal Robots UR5 Driver 🤖&quot;</p>
        </div>
        <div className="pt-2 border-t border-glass-border">
          <p className="text-text-muted text-xs">
            <strong className="text-foreground">Name Conflicts:</strong> If a package with the same name exists,
            you&apos;ll see suggestions like <code>your-package-v2</code> or <code>your-package-community</code>.
          </p>
        </div>
      </div>
    </div>
  );

  // Runtime Modal Component
  const RuntimeModal = () => {
    const adaptations = formData.name ? getAgentAdaptations(formData.name, formData.githubUrl) : [];
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 rounded-xl bg-card-bg border border-glass-border"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-cognitive-cyan/10 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-cognitive-cyan" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Install Command Runtime</h3>
                <p className="text-sm text-text-muted">How agents execute the install command</p>
              </div>
            </div>
            <button onClick={() => setShowRuntimeModal(false)} className="text-text-muted hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-glass-bg">
              <p className="text-sm text-text-secondary">
                When you run <code className="text-cognitive-cyan font-mono">rosclaw mcp install {formData.name || "&lt;package&gt;"}</code>,
                here&apos;s what happens behind the scenes:
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Bot className="w-4 h-4 text-cognitive-cyan" />
                Agent Adaptation
              </h4>
              <p className="text-sm text-text-secondary">
                Different agents support this command in different ways:
              </p>
              <div className="space-y-2">
                {adaptations.map((adapt) => (
                  <div key={adapt.agent} className="p-3 rounded-lg bg-black/40 border border-glass-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground text-sm">{adapt.agent}</span>
                    </div>
                    <code className="block text-xs text-cognitive-cyan font-mono">{adapt.command}</code>
                    <p className="text-xs text-text-muted mt-1">{adapt.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <Code className="w-4 h-4 text-cognitive-cyan" />
                Runtime Logic
              </h4>
              <ol className="space-y-2 text-sm text-text-secondary list-decimal list-inside">
                <li>Agent receives the install command</li>
                <li>Fetches package metadata from ROSClaw registry</li>
                <li>Downloads source from GitHub repository</li>
                <li>Validates package structure and dependencies</li>
                <li>Installs into agent&apos;s MCP tools directory</li>
                <li>Registers available tools with the agent</li>
              </ol>
            </div>

            <div className="p-4 rounded-lg bg-cognitive-cyan/5 border border-cognitive-cyan/20">
              <h4 className="font-medium text-foreground flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-cognitive-cyan" />
                Natural Language Alternative
              </h4>
              <p className="text-sm text-text-secondary">
                Users can also say: <em>&quot;Install the {formData.displayName || formData.name || "package"} MCP package&quot;</em>
                and any LLM agent with ROSClaw integration will understand.
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowRuntimeModal(false)}
              className="px-4 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan hover:bg-cognitive-cyan/20 transition-all"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleOneClickImport = async () => {
    if (!formData.githubUrl) {
      setImportError("Please enter a GitHub URL");
      return;
    }

    setIsImporting(true);
    setImportError("");

    try {
      const urlMatch = formData.githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!urlMatch) {
        setImportError("Invalid GitHub URL format");
        setIsImporting(false);
        return;
      }

      const [, owner, repo] = urlMatch;
      const apiUrlBase = `https://api.github.com/repos/${owner}/${repo}`;

      const [repoRes, readmeRes] = await Promise.all([
        fetch(apiUrlBase, { headers: { Accept: "application/vnd.github+json" } }),
        fetch(`${apiUrlBase}/readme`, { headers: { Accept: "application/vnd.github+json" } }),
      ]);

      if (!repoRes.ok) {
        setImportError(`Failed to fetch repo: ${repoRes.statusText}`);
        setIsImporting(false);
        return;
      }

      const repoData = await repoRes.json();
      let readmeContent = "";

      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          try {
            const base64Content = readmeData.content.replace(/\n/g, "");
            const binaryString = atob(base64Content);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            readmeContent = new TextDecoder("utf-8").decode(bytes);
          } catch {
            readmeContent = "";
          }
        }
      }

      // Check if official
      const isOfficial = isOfficialRepo(formData.githubUrl);

      // Check name availability using local data
      const nameExists = packageNameExists(repo);
      if (nameExists) {
        const suggestions = suggestAlternativeNames(repo);
        setNameCheckResult({
          available: false,
          message: `Package "${repo}" already exists`,
          suggestions,
        });
        setImportError(
          `Package "${repo}" already exists. Try: ${suggestions.join(", ")}`
        );
        setIsImporting(false);
        return;
      } else {
        setNameCheckResult({
          available: true,
          message: `Package "${repo}" is available`,
        });
      }

      // Call LLM for analysis
      let llmAnalysis = null;
      try {
        const llmRes = await fetch("/api/llm/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            readmeContent,
            repoName: repo,
            repoDescription: repoData.description || "",
          }),
        });
        if (llmRes.ok) {
          const llmData = await llmRes.json();
          llmAnalysis = llmData.data;
        }
      } catch (llmError) {
        console.error("LLM analysis failed:", llmError);
      }

      // Auto-fill all fields
      setFormData({
        ...formData,
        name: repo,
        displayName: repoData.full_name || repo,
        description: repoData.description || "",
        readmeMd: readmeContent,
        category: llmAnalysis?.category || "",
        robotType: llmAnalysis?.robotType || "",
        tags: llmAnalysis?.tags || [],
        tools: llmAnalysis?.tools || [],
        isOfficial,
      });

      // Auto-advance to step 2 (documentation preview)
      setStep(2);
    } catch (error) {
      console.error("Import failed:", error);
      setImportError("Failed to import. Please check the URL and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Create package object
    const newPackage = {
      id: formData.name,
      name: formData.name,
      displayName: formData.displayName,
      description: formData.description,
      author: formData.githubUrl.split('/')[3] || 'Unknown',
      authorUrl: `https://github.com/${formData.githubUrl.split('/')[3] || ''}`,
      githubUrl: formData.githubUrl,
      verified: false,
      isOfficial: formData.isOfficial,
      category: formData.category,
      robotType: formData.robotType,
      version: formData.version,
      updatedAt: new Date().toISOString().split('T')[0],
      stars: 0,
      downloads: 0,
      tags: formData.tags,
      tools: formData.tools,
    };

    // Save to localStorage (user's submitted packages)
    try {
      const existing = JSON.parse(localStorage.getItem('userMcpPackages') || '[]');
      existing.push(newPackage);
      localStorage.setItem('userMcpPackages', JSON.stringify(existing));

      // Also save to a "pending" list that can be shown in MCP Hub
      const pending = JSON.parse(localStorage.getItem('pendingMcpPackages') || '[]');
      pending.push(newPackage);
      localStorage.setItem('pendingMcpPackages', JSON.stringify(pending));
    } catch (e) {
      console.error('Failed to save package:', e);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setShowInstallCommand(true);
    setStep(4);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    { id: 1, title: "Import", icon: Github },
    { id: 2, title: "Preview", icon: FileText },
    { id: 3, title: "Review", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-background pt-16">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Link href="/mcp-hub" className="hover:text-foreground">MCP Hub</Link>
            <span>/</span>
            <span className="text-foreground">Submit</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Submit MCP Package</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-8">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  step === s.id
                    ? "bg-cognitive-cyan/10 text-cognitive-cyan border border-cognitive-cyan/30"
                    : step > s.id
                    ? "bg-green-500/10 text-green-500"
                    : "bg-glass-bg text-text-muted"
                }`}
              >
                <s.icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">{s.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-px ${step > s.id ? "bg-green-500/50" : "bg-glass-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: GitHub Import */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-cognitive-cyan/10 flex items-center justify-center mx-auto mb-4">
                <Github className="w-8 h-8 text-cognitive-cyan" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Submit from GitHub
              </h2>
              <p className="text-text-secondary">
                Enter your GitHub repository URL and we&apos;ll automatically extract all the information.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <label className="block text-sm font-medium text-foreground mb-4">
                GitHub Repository URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="flex-1 px-4 py-3 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
                <button
                  onClick={handleOneClickImport}
                  disabled={isImporting || !formData.githubUrl}
                  className="px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {isImporting ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Auto Import
                    </>
                  )}
                </button>
              </div>
              {importError && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                  {importError}
                </div>
              )}
              <p className="text-xs text-text-muted mt-3">
                We&apos;ll analyze your README and extract: name, description, category, robot type, tags, and MCP tools using AI.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-glass-bg border border-glass-border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cognitive-cyan mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Repository Requirements</p>
                  <ul className="text-sm text-text-secondary mt-1 space-y-1">
                    <li>• Must have a README.md file</li>
                    <li>• Repositories from ros-claw/rosclaw orgs will be marked as Official</li>
                    <li>• All others will be marked as Community</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Preview */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Auto-filled Info Card */}
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Extracted Information</h3>
                <div className="flex items-center gap-2">
                  {formData.isOfficial ? (
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium">
                      Official
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-xs font-medium">
                      Community
                    </span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="block text-sm text-text-muted">Package Name (locked)</label>
                    <button
                      onClick={() => setShowNameHelp(!showNameHelp)}
                      className="text-text-muted hover:text-cognitive-cyan transition-colors"
                      title="What's the difference?"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                  {showNameHelp && <NameHelpTooltip />}
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg/50 border border-glass-border text-text-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Unique identifier used in commands
                    {nameCheckResult?.available === false && (
                      <span className="text-red-500 ml-2">Name taken - see suggestions above</span>
                    )}
                  </p>
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-1">Display Name</label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                  />
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                  >
                    <option value="">Select category</option>
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-1">Robot / Hardware</label>
                  <input
                    type="text"
                    value={formData.robotType}
                    onChange={(e) => setFormData({ ...formData, robotType: e.target.value })}
                    placeholder="e.g., UR5, Unitree G1"
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm text-text-muted mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm text-text-muted mb-2">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    placeholder="Add tag"
                    className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
                  <button
                    onClick={handleAddTag}
                    className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
                  >
                    <Tags className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-xs"
                    >
                      {tag}
                      <button onClick={() => handleRemoveTag(tag)} className="hover:text-white">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* README Preview */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">README.md (editable)</label>
                <textarea
                  value={formData.readmeMd}
                  onChange={(e) => setFormData({ ...formData, readmeMd: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-glass-border text-foreground font-mono text-sm focus:outline-none focus:border-cognitive-cyan/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preview</label>
                <div className="p-4 rounded-lg bg-card-bg border border-glass-border h-[500px] overflow-auto">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.readmeMd}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Tools */}
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">MCP Tools</h3>
                <span className="text-xs text-text-muted">Extracted by AI</span>
              </div>
              {formData.tools.length > 0 ? (
                <div className="space-y-3">
                  {formData.tools.map((tool, index) => (
                    <div key={index} className="p-3 rounded-lg bg-glass-bg border border-glass-border">
                      <div className="font-medium text-foreground">{tool.name}</div>
                      <div className="text-sm text-text-secondary">{tool.description}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">No tools detected. You can add them manually below.</p>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!formData.name || !formData.category}
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all disabled:opacity-50"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <h3 className="text-lg font-semibold text-foreground mb-4">Review Your Package</h3>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Name</span>
                  <span className="text-foreground font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Type</span>
                  <span className={formData.isOfficial ? "text-green-500" : "text-cognitive-cyan"}>
                    {formData.isOfficial ? "Official" : "Community"}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Category</span>
                  <span className="text-foreground">{formData.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Robot/Hardware</span>
                  <span className="text-foreground">{formData.robotType || "N/A"}</span>
                </div>
                <div className="py-2 border-b border-glass-border">
                  <span className="text-text-secondary block mb-1">Description</span>
                  <span className="text-foreground">{formData.description}</span>
                </div>
                <div className="py-2">
                  <span className="text-text-secondary block mb-1">Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-full bg-cognitive-cyan/10 text-cognitive-cyan text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Publishing..." : "Publish Package"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && showInstallCommand && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Package Published Successfully!
            </h2>
            <p className="text-text-secondary mb-6">
              Your package <strong>{formData.name}</strong> is now available in the MCP Hub.
            </p>

            {/* Install Command */}
            <div className="max-w-xl mx-auto mb-6">
              <div className="p-4 rounded-lg bg-black/40 border border-glass-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-text-muted">Install with one command:</span>
                  <button
                    onClick={() => copyToClipboard(generateInstallCommand(formData.name))}
                    className="flex items-center gap-1 text-xs text-cognitive-cyan hover:text-cognitive-cyan/80"
                  >
                    {copied ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <code className="block p-3 rounded bg-glass-bg text-foreground font-mono text-sm">
                  {generateInstallCommand(formData.name)}
                </code>

                {/* Agent Adaptations */}
                <div className="mt-4 pt-4 border-t border-glass-border">
                  <p className="text-xs text-text-muted mb-2">Also works with other agents:</p>
                  <div className="space-y-1.5">
                    {getAgentCommands(formData.name).map((adapt) => (
                      <div key={adapt.agent} className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary">{adapt.agent}</span>
                        <code className="text-cognitive-cyan font-mono">{adapt.command}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Registry Explanation */}
            <div className="max-w-xl mx-auto mb-8 p-4 rounded-lg bg-glass-bg border border-glass-border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cognitive-cyan flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground mb-1">How agents find this package</p>
                  <p className="text-xs text-text-secondary">
                    When you say <span className="text-cognitive-cyan font-mono">"install mcp {formData.name}"</span>,
                    OpenClaw and other agents query the <strong className="text-foreground">ROSClaw MCP Registry</strong>
                    at <code className="text-cognitive-cyan">rosclaw.io/mcp-hub/{formData.name}</code>
                    to get the GitHub repository URL and installation instructions.
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    Your package is now indexed and searchable in the MCP Hub.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/mcp-hub"
                className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
              >
                Browse Packages
              </Link>
              <Link
                href={`/mcp-hub/${formData.name}`}
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
              >
                View Package
              </Link>
            </div>
          </motion.div>
        )}
      </div>

      {/* Runtime Explanation Modal */}
      {showRuntimeModal && <RuntimeModal />}
    </div>
  );
}
