"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Code, FileText, Tags, GitBranch, Info, Check, AlertCircle, Github, FileArchive, Loader2 } from "lucide-react";
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

interface ImportedData {
  name: string;
  description: string;
  skillMd: string;
  category: string;
  tags: string[];
  robotTypes?: string[];
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
    skillMd: `## Overview\n\nDescribe what your skill does...\n\n## Usage\n\n\`\`\`\nrosclaw skill load <skill-name>\n\`\`\`\n\n## Parameters\n\n- \`param1\`: Description\n\n## Examples\n\nExample usage scenarios...`,
    icon: null as File | null,
  });
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [githubUrl, setGithubUrl] = useState("");
  const [importedData, setImportedData] = useState<ImportedData | null>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [importApplied, setImportApplied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".zip")) {
      alert("Only .zip files are supported");
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    formDataUpload.append("type", "skill");

    try {
      const res = await fetch("/api/upload/analyze", {
        method: "POST",
        body: formDataUpload,
      });

      if (res.ok) {
        const result = await res.json();
        const data = result.data;

        setImportedData({
          name: data.name || file.name.replace(".zip", ""),
          description: data.description || "",
          skillMd: data.skillMd || "",
          category: data.category || "",
          tags: data.tags || [],
          robotTypes: data.robotTypes || [],
        });
      } else {
        const error = await res.json();
        alert(error.error || "Failed to analyze file");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload and analyze file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setFormData({ ...formData, category: "custom" });
    } else {
      setShowCustomCategory(false);
      setFormData({ ...formData, category: value, customCategory: "" });
    }
  };

  const handleImportFromGithub = async () => {
    if (!githubUrl) return;

    setIsImporting(true);
    try {
      // Parse GitHub URL to get owner and repo
      const urlMatch = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (!urlMatch) {
        console.error("Invalid GitHub URL");
        setIsImporting(false);
        return;
      }

      const [, owner, repo] = urlMatch;
      const apiUrlBase = `https://api.github.com/repos/${owner}/${repo}`;

      // Fetch repo metadata and README directly from GitHub API (client-side)
      const [repoRes, readmeRes] = await Promise.all([
        fetch(apiUrlBase, {
          headers: { Accept: "application/vnd.github+json" },
        }),
        fetch(`${apiUrlBase}/readme`, {
          headers: { Accept: "application/vnd.github+json" },
        }),
      ]);

      if (!repoRes.ok) {
        console.error("Failed to fetch repo:", repoRes.statusText);
        setIsImporting(false);
        return;
      }

      const repoData = await repoRes.json();
      let readmeContent = "";

      if (readmeRes.ok) {
        const readmeData = await readmeRes.json();
        if (readmeData.content) {
          try {
            // Properly decode base64 with UTF-8 support to fix encoding issues
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

      // Infer category from repo name and description
      const inferCategory = (name: string, desc: string): string => {
        const check = (s: string) => name.toLowerCase().includes(s) || desc.toLowerCase().includes(s);
        if (check("grasp") || check("grip")) return "Grasping";
        if (check("vision") || check("camera") || check("realsense") || check("detect")) return "Computer Vision";
        if (check("nav") || check("path") || check("slam")) return "Navigation";
        if (check("manipul") || check("arm") || check("pick") || check("place")) return "Manipulation";
        if (check("assembly") || check("assemble")) return "Assembly";
        if (check("social") || check("interact") || check("speech") || check("chat")) return "Social";
        if (check("plan") || check("schedul")) return "Planning";
        if (check("control") || check("move") || check("servo")) return "Control";
        return "";
      };

      // Extract tags from README keywords
      const keywordsMatch = readmeContent.match(/keywords["\s:]+\[([^\]]+)\]/i);
      const extractedTags: string[] = keywordsMatch
        ? keywordsMatch[1].split(",").map((t: string) => t.trim().replace(/["']/g, "")).filter(Boolean)
        : [];

      // Also extract meaningful tags from name and description
      const lowerName = repo.toLowerCase();
      const lowerDesc = (repoData.description || "").toLowerCase();

      // Hardware keywords
      if (lowerName.includes("ur") || lowerDesc.includes("ur ")) extractedTags.push("ur");
      if (lowerName.includes("franka") || lowerDesc.includes("franka")) { extractedTags.push("franka"); extractedTags.push("panda"); }
      if (lowerName.includes("g1")) { extractedTags.push("g1"); extractedTags.push("unitree"); }
      if (lowerName.includes("go2")) { extractedTags.push("go2"); extractedTags.push("unitree"); }

      // Tech/protocol keywords
      if (lowerName.includes("rtde") || lowerDesc.includes("rtde")) extractedTags.push("rtde");
      if (lowerDesc.includes("no ros") || lowerDesc.includes("without ros")) extractedTags.push("no-ros");

      // Skill type keywords
      if (lowerName.includes("mcp") || lowerDesc.includes("mcp")) extractedTags.push("mcp");

      // Remove duplicates
      const uniqueTags = Array.from(new Set(extractedTags));

      // Call LLM for advanced analysis
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

      // Extract robot types from LLM or fallback
      const robotTypes = llmAnalysis?.robotTypes || [];
      if (robotTypes.length === 0) {
        // Fallback extraction
        const text = (repo + " " + (repoData.description || "") + " " + readmeContent).toLowerCase();
        if (text.includes("ur5")) robotTypes.push("ur5");
        if (text.includes("ur10")) robotTypes.push("ur10");
        if (text.includes("franka") || text.includes("panda")) robotTypes.push("franka");
        if (text.includes("g1")) robotTypes.push("g1");
        if (text.includes("go2")) robotTypes.push("go2");
        if (text.includes("turtlebot")) robotTypes.push("turtlebot");
      }

      setImportedData({
        name: repo,
        description: repoData.description || "",
        skillMd: readmeContent,
        category: llmAnalysis?.category || inferCategory(repo, repoData.description || ""),
        tags: llmAnalysis?.tags?.length > 0 ? llmAnalysis.tags : (uniqueTags.length > 0 ? uniqueTags : []),
        robotTypes: robotTypes,
      });
    } catch (error) {
      console.error("Failed to import from GitHub:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleApplyImport = () => {
    if (importedData) {
      const isCustom = !!(importedData.category && !categories.includes(importedData.category));
      setShowCustomCategory(isCustom);
      setFormData({
        ...formData,
        name: importedData.name || formData.name,
        description: importedData.description || formData.description,
        skillMd: importedData.skillMd || formData.skillMd,
        category: isCustom ? "custom" : (importedData.category || formData.category),
        customCategory: isCustom ? importedData.category : formData.customCategory,
        tags: importedData.tags.length > 0 ? importedData.tags : formData.tags,
        robotTypes: importedData.robotTypes && importedData.robotTypes.length > 0 ? importedData.robotTypes : formData.robotTypes,
      });
      setImportApplied(true);
      // Close preview after 1.5 seconds and scroll to form
      setTimeout(() => {
        setImportedData(null);
        setImportApplied(false);
        // Scroll to the Skill Name field so user sees the filled data
        document.getElementById("skill-name")?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 1500);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(4); // Success step
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: Info },
    { id: 2, title: "Documentation", icon: FileText },
    { id: 3, title: "Review", icon: Check },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
            <Link href="/skills" className="hover:text-foreground">Skills</Link>
            <span>/</span>
            <span className="text-foreground">Publish</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Publish New Skill</h1>
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

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* GitHub Import */}
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <label className="block text-sm font-medium text-foreground mb-4">
                <Github className="w-4 h-4 inline mr-2" />
                Import from GitHub
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
                <button
                  onClick={handleImportFromGithub}
                  disabled={isImporting || !githubUrl}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {isImporting ? "Importing..." : "Import"}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Preview before applying: name, description, README, and tags will be shown for confirmation
              </p>
            </div>

            {/* File Upload */}
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border border-dashed">
              <label className="block text-sm font-medium text-foreground mb-4">
                <FileArchive className="w-4 h-4 inline mr-2" />
                Upload Package (.zip)
              </label>
              <div className="flex flex-col gap-3">
                <label className="flex flex-col items-center justify-center p-6 rounded-lg bg-glass-bg border border-glass-border hover:border-cognitive-cyan/30 cursor-pointer transition-all">
                  <input
                    type="file"
                    accept=".zip"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-cognitive-cyan animate-spin mb-2" />
                  ) : (
                    <Upload className="w-8 h-8 text-text-muted mb-2" />
                  )}
                  <span className="text-sm text-text-secondary">
                    {isUploading ? "Analyzing with AI..." : "Drop .zip file or click to upload"}
                  </span>
                  <span className="text-xs text-text-muted mt-1">
                    Must include SKILL.md or README.md. Max 10MB.
                  </span>
                </label>
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-sm text-cognitive-cyan">
                    <Check className="w-4 h-4" />
                    <span>{uploadedFile.name}</span>
                  </div>
                )}
              </div>

              {/* Import Preview Panel */}
              {importedData && (
                <div className={`mt-4 p-4 rounded-lg border transition-all ${
                  importApplied
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-cognitive-cyan/5 border-cognitive-cyan/20"
                }`}>
                  <h4 className={`text-sm font-medium mb-3 ${
                    importApplied ? "text-green-500" : "text-cognitive-cyan"
                  }`}>
                    {importApplied ? "✓ Applied Successfully!" : "Preview Imported Data"}
                  </h4>
                  <div className="space-y-2 text-sm">
                    {importedData.name && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Name:</span>
                        <span className="text-foreground">{importedData.name}</span>
                      </div>
                    )}
                    {importedData.description && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Description:</span>
                        <span className="text-foreground truncate max-w-[200px]">{importedData.description}</span>
                      </div>
                    )}
                    {importedData.category && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Category:</span>
                        <span className="text-foreground">{importedData.category}</span>
                      </div>
                    )}
                    {importedData.tags.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Tags:</span>
                        <span className="text-foreground">{importedData.tags.join(", ")}</span>
                      </div>
                    )}
                    {importedData.robotTypes && importedData.robotTypes.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Robots:</span>
                        <span className="text-foreground">{importedData.robotTypes.join(", ")}</span>
                      </div>
                    )}
                    {importedData.skillMd && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">README:</span>
                        <span className="text-foreground">✓ Available</span>
                      </div>
                    )}
                  </div>
                  {!importApplied && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={handleApplyImport}
                        className="px-4 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan text-sm hover:bg-cognitive-cyan/20 transition-all"
                      >
                        Apply & Modify
                      </button>
                      <button
                        onClick={() => setImportedData(null)}
                        className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary text-sm hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Icon Upload */}
              <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Skill Icon
                </label>
                <div className="border-2 border-dashed border-glass-border rounded-lg p-8 text-center hover:border-cognitive-cyan/30 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">Drop SVG or PNG here</p>
                  <p className="text-xs text-text-muted mt-1">512x512px recommended</p>
                </div>
              </div>

              {/* Basic Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Skill Name *
                  </label>
                  <input
                    id="skill-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., precision-pour"
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Use kebab-case, unique identifier
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="1.0.0"
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Custom Category</option>
                  </select>
                  {showCustomCategory && (
                    <input
                      type="text"
                      value={formData.customCategory}
                      onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                      placeholder="Enter custom category"
                      className="w-full mt-2 px-4 py-2 rounded-lg bg-glass-bg border border-cognitive-cyan/30 text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Short Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what your skill does in one sentence..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
              />
            </div>

            {/* Robot Types */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Compatible Robots
              </label>
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
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag and press Enter"
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
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setStep(2)}
                disabled={!formData.name || !formData.category || !formData.description || (formData.category === "custom" && !formData.customCategory)}
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Documentation */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">SKILL.md Format</p>
                <p className="text-yellow-500/80">
                  Use Markdown format. Include sections: Overview, Usage, Parameters, and Examples.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  SKILL.md
                </label>
                <textarea
                  value={formData.skillMd}
                  onChange={(e) => setFormData({ ...formData, skillMd: e.target.value })}
                  rows={20}
                  className="w-full px-4 py-3 rounded-lg bg-black/40 border border-glass-border text-foreground font-mono text-sm focus:outline-none focus:border-cognitive-cyan/50"
                />
              </div>

              {/* Preview */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Preview
                </label>
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
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
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
                  <span className="text-text-secondary">Version</span>
                  <span className="text-foreground">{formData.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Category</span>
                  <span className="text-foreground">
                    {formData.category === "custom" ? formData.customCategory : formData.category}
                  </span>
                </div>
                <div className="py-2 border-b border-glass-border">
                  <span className="text-text-secondary block mb-1">Description</span>
                  <span className="text-foreground">{formData.description}</span>
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

            <div className="p-4 rounded-lg bg-glass-bg border border-glass-border">
              <div className="flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Publishing Options</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Your skill will be submitted to the ROSClaw Skill Market for AI-powered review before becoming publicly available.
                  </p>
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
            <p className="text-text-secondary mb-6">
              Your skill <strong>{formData.name}</strong> has been submitted for AI-powered automated vetting.
              You will be notified when it&apos;s approved.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/skills"
                className="px-6 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
              >
                Browse Skills
              </Link>
              <Link
                href={`/skills/${formData.name}`}
                className="px-6 py-2 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all"
              >
                View Skill
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
