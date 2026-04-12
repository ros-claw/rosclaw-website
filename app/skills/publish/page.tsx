"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Tags, Info, Check, AlertCircle, Github, Sparkles, Copy, CheckCircle } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const categories = [
  "Manipulation",
  "Navigation",
  "Computer Vision",
  "Grasping",
  "Assembly",
  "Social",
  "Planning",
  "Control",
];

const robotTypes = [
  { id: "ur5", name: "Universal Robots UR5/UR10" },
  { id: "franka", name: "Franka Emika Panda" },
  { id: "unitree-g1", name: "Unitree G1 Humanoid" },
  { id: "unitree-go2", name: "Unitree Go2 Quadruped" },
  { id: "turtlebot", name: "TurtleBot" },
  { id: "universal", name: "Universal (Robot Agnostic)" },
];

const OFFICIAL_ORGS = ["ros-claw", "rosclaw"];

interface ImportedData {
  name: string;
  description: string;
  skillMd: string;
  category: string;
  tags: string[];
  robotTypes: string[];
}

export default function PublishSkillPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    version: "1.0.0",
    description: "",
    category: "",
    customCategory: "",
    robotTypes: [] as string[],
    tags: [] as string[],
    githubUrl: "",
    skillMd: ``,
    isOfficial: false,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [copied, setCopied] = useState(false);

  const isOfficialRepo = (url: string) => {
    return OFFICIAL_ORGS.some(org => url.toLowerCase().includes(`github.com/${org.toLowerCase()}`));
  };

  const generateInstallCommand = (name: string) => {
    return `rosclaw skill install ${name}`;
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

      // Extract robot types
      const robotTypesList: string[] = llmAnalysis?.robotTypes || [];
      if (robotTypesList.length === 0) {
        const text = (repo + " " + (repoData.description || "") + " " + readmeContent).toLowerCase();
        if (text.includes("ur5")) robotTypesList.push("ur5");
        if (text.includes("franka")) robotTypesList.push("franka");
        if (text.includes("g1")) robotTypesList.push("unitree-g1");
        if (text.includes("go2")) robotTypesList.push("unitree-go2");
      }

      // Auto-fill all fields
      setFormData({
        ...formData,
        name: repo,
        description: repoData.description || "",
        skillMd: readmeContent,
        category: llmAnalysis?.category || "",
        tags: llmAnalysis?.tags || [],
        robotTypes: robotTypesList,
        isOfficial,
      });

      // Auto-advance to step 2
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

  const handleRobotToggle = (robotId: string) => {
    const newTypes = formData.robotTypes.includes(robotId)
      ? formData.robotTypes.filter((r) => r !== robotId)
      : [...formData.robotTypes, robotId];
    setFormData({ ...formData, robotTypes: newTypes });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Submit to API (with credentials to include session cookie)
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          display_name: formData.name,
          description: formData.description,
          long_description: formData.description,
          category: formData.category,
          version: formData.version,
          author_name: formData.githubUrl.split('/')[3] || 'Unknown',
          github_repo_url: formData.githubUrl,
          robot_types: formData.robotTypes,
          tags: formData.tags,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || 'Failed to publish skill');
        setIsSubmitting(false);
        return;
      }

      const data = await res.json();
      console.log('Skill published:', data);

      setIsSubmitting(false);
      setStep(4);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Failed to publish skill');
      setIsSubmitting(false);
    }
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
            <Link href="/skills" className="hover:text-foreground">Skills</Link>
            <span>/</span>
            <span className="text-foreground">Submit</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Submit Skill</h1>
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
                We&apos;ll analyze your README and extract: name, description, category, robot types, and tags using AI.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-glass-bg border border-glass-border">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-cognitive-cyan mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Repository Requirements</p>
                  <ul className="text-sm text-text-secondary mt-1 space-y-1">
                    <li>• Must have a README.md or SKILL.md file</li>
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
            {/* Extracted Info */}
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
                <div>
                  <label className="block text-sm text-text-muted mb-1">Skill Name (locked)</label>
                  <input
                    type="text"
                    value={formData.name}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg/50 border border-glass-border text-text-muted cursor-not-allowed"
                  />
                  <p className="text-xs text-text-muted mt-1">Derived from GitHub repository name</p>
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
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
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-text-muted mb-1">Short Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                  />
                </div>
              </div>

              {/* Robot Types */}
              <div className="mt-4">
                <label className="block text-sm text-text-muted mb-2">Compatible Robots</label>
                <div className="flex flex-wrap gap-2">
                  {robotTypes.map((robot) => (
                    <button
                      key={robot.id}
                      onClick={() => handleRobotToggle(robot.id)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        formData.robotTypes.includes(robot.id)
                          ? "bg-cognitive-cyan/20 text-cognitive-cyan border border-cognitive-cyan/30"
                          : "bg-glass-bg text-text-secondary border border-glass-border hover:border-text-muted"
                      }`}
                    >
                      {robot.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
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

            {/* Documentation Editor */}
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">SKILL.md (editable)</label>
                <textarea
                  value={formData.skillMd}
                  onChange={(e) => setFormData({ ...formData, skillMd: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-glass-border text-foreground font-mono text-sm focus:outline-none focus:border-cognitive-cyan/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Preview</label>
                <div className="p-4 rounded-lg bg-card-bg border border-glass-border h-[500px] overflow-auto">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {formData.skillMd}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
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
                disabled={!formData.name || !formData.category || !formData.description}
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Review Your Skill</h3>

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
                <div className="py-2 border-b border-glass-border">
                  <span className="text-text-secondary block mb-1">Compatible Robots</span>
                  <div className="flex flex-wrap gap-2">
                    {formData.robotTypes.map((robotId) => (
                      <span
                        key={robotId}
                        className="px-2 py-1 rounded-full bg-glass-bg text-text-secondary text-xs"
                      >
                        {robotTypes.find((r) => r.id === robotId)?.name}
                      </span>
                    ))}
                  </div>
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
                {isSubmitting ? "Publishing..." : "Publish Skill"}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Skill Published Successfully!
            </h2>
            <p className="text-text-secondary mb-2">
              Your skill <strong>{formData.name}</strong> has been submitted.
            </p>

            {/* Pending Review Notice */}
            <div className="max-w-xl mx-auto mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-medium text-yellow-500">Pending Review</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Your skill is currently under review. It will be publicly visible once approved.
                    You can check the status in your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Install Command */}
            <div className="max-w-lg mx-auto mb-8">
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
              </div>
              <p className="text-xs text-text-muted mt-2">
                Users can paste this command into their ROSClaw agent to install your skill.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link
                href="/skills"
                className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
              >
                Browse Skills
              </Link>
              <Link
                href="/profile"
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
              >
                View in Profile
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
