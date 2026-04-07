"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Code, FileText, Tags, GitBranch, Info, Check, AlertCircle, Github, Plus, X } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const predefinedCategories = [
  "Manipulators",
  "Humanoids",
  "Mobile Bases",
  "Sensors",
  "Grippers",
  "Cameras",
  "End Effectors",
];

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
    readmeMd: `## Overview

Describe your MCP package...

## Installation

\`\`\`
rosclaw install <package-name>
\`\`\`

## Configuration

Configuration options...

## Tools

List of MCP tools provided by this package...`,
    tools: [] as { name: string; description: string }[],
    icon: null as File | null,
  });
  const [tagInput, setTagInput] = useState("");
  const [toolInput, setToolInput] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importedData, setImportedData] = useState<any>(null);
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleAddTool = () => {
    if (toolInput.name.trim() && toolInput.description.trim()) {
      setFormData({
        ...formData,
        tools: [...formData.tools, { ...toolInput }],
      });
      setToolInput({ name: "", description: "" });
    }
  };

  const handleRemoveTool = (index: number) => {
    setFormData({
      ...formData,
      tools: formData.tools.filter((_, i) => i !== index),
    });
  };

  const handleImportFromGithub = async () => {
    if (!formData.githubUrl) return;

    setIsImporting(true);
    try {
      const response = await fetch("/api/github/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: formData.githubUrl }),
      });

      if (response.ok) {
        const data = await response.json();
        setImportedData(data);
        // Don't auto-fill, just show preview for user to confirm
      }
    } catch (error) {
      console.error("Failed to import from GitHub:", error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleApplyImport = () => {
    if (importedData) {
      const isCustomCat = importedData.category && !predefinedCategories.includes(importedData.category);
      setFormData({
        ...formData,
        name: importedData.name || formData.name,
        displayName: importedData.displayName || importedData.name || formData.displayName,
        description: importedData.description || formData.description,
        readmeMd: importedData.longDescription || formData.readmeMd,
        category: isCustomCat ? "custom" : (importedData.category || formData.category),
        customCategory: isCustomCat ? importedData.category : formData.customCategory,
        robotType: importedData.robotType || formData.robotType,
        tags: importedData.tags || formData.tags,
      });
      if (isCustomCat) setShowCustomCategory(true);
      setImportedData(null);
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

  const getFinalCategory = () => {
    if (formData.category === "custom") return formData.customCategory;
    return formData.category;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setStep(4);
  };

  const steps = [
    { id: 1, title: "Basic Info", icon: Info },
    { id: 2, title: "Documentation", icon: FileText },
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
            <span className="text-foreground">Publish</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Publish MCP Package</h1>
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
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username/repo"
                  className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
                <button
                  onClick={handleImportFromGithub}
                  disabled={isImporting || !formData.githubUrl}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {isImporting ? "Importing..." : "Import"}
                </button>
              </div>
              <p className="text-xs text-text-muted mt-2">
                Auto-import: Preview data from GitHub, then confirm and modify before publishing
              </p>

              {/* Import Preview */}
              {importedData && (
                <div className="mt-4 p-4 rounded-lg bg-cognitive-cyan/5 border border-cognitive-cyan/20">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-cognitive-cyan">Preview Imported Data</h4>
                    <button
                      onClick={() => setImportedData(null)}
                      className="text-text-muted hover:text-foreground"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    {importedData.name && (
                      <div className="flex">
                        <span className="text-text-muted w-24">Name:</span>
                        <span className="text-foreground">{importedData.name}</span>
                      </div>
                    )}
                    {importedData.description && (
                      <div className="flex">
                        <span className="text-text-muted w-24">Description:</span>
                        <span className="text-foreground line-clamp-2">{importedData.description}</span>
                      </div>
                    )}
                    {importedData.category && (
                      <div className="flex">
                        <span className="text-text-muted w-24">Category:</span>
                        <span className="text-foreground">{importedData.category}</span>
                      </div>
                    )}
                    {importedData.tags && importedData.tags.length > 0 && (
                      <div className="flex">
                        <span className="text-text-muted w-24">Tags:</span>
                        <span className="text-foreground">{importedData.tags.join(", ")}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleApplyImport}
                    className="mt-3 px-4 py-1.5 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan text-sm hover:bg-cognitive-cyan/20 transition-all"
                  >
                    Apply & Modify
                  </button>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Icon Upload */}
              <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
                <label className="block text-sm font-medium text-foreground mb-4">
                  Package Icon
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
                    Package Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., rosclaw-ur5-mcp"
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
                  <p className="text-xs text-text-muted mt-1">
                    Use kebab-case, unique identifier
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="e.g., UR5e MCP Driver"
                    className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
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
                placeholder="Describe what your MCP package does..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
              />
            </div>

            {/* Category with Custom Option */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <div className="flex gap-2">
                <select
                  value={formData.category}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground focus:outline-none focus:border-cognitive-cyan/50"
                >
                  <option value="">Select category</option>
                  {predefinedCategories.map((cat) => (
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
                    className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                  />
                )}
              </div>
            </div>

            {/* Robot Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Robot Type / Hardware
              </label>
              <input
                type="text"
                value={formData.robotType}
                onChange={(e) => setFormData({ ...formData, robotType: e.target.value })}
                placeholder="e.g., UR5, Unitree G1, Webcam, Microphone, etc."
                className="w-full px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
              />
              <p className="text-xs text-text-muted mt-1">
                Can be any hardware or software interface
              </p>
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
                disabled={!formData.name || !getFinalCategory() || !formData.description}
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
                <p className="font-medium">README.md Format</p>
                <p className="text-yellow-500/80">
                  Use Markdown format. Include sections: Overview, Installation, Configuration, and Tools.
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Editor */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  README.md
                </label>
                <textarea
                  value={formData.readmeMd}
                  onChange={(e) => setFormData({ ...formData, readmeMd: e.target.value })}
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
                      {formData.readmeMd}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* MCP Tools */}
            <div className="p-6 rounded-xl bg-card-bg border border-glass-border">
              <label className="block text-sm font-medium text-foreground mb-4">
                MCP Tools
              </label>
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={toolInput.name}
                  onChange={(e) => setToolInput({ ...toolInput, name: e.target.value })}
                  placeholder="Tool name"
                  className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
                <input
                  type="text"
                  value={toolInput.description}
                  onChange={(e) => setToolInput({ ...toolInput, description: e.target.value })}
                  placeholder="Description"
                  className="flex-1 px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-cognitive-cyan/50"
                />
                <button
                  onClick={handleAddTool}
                  className="px-4 py-2 rounded-lg bg-glass-bg border border-glass-border text-text-secondary hover:text-foreground transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2">
                {formData.tools.map((tool, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-glass-bg"
                  >
                    <div>
                      <span className="text-foreground font-medium">{tool.name}</span>
                      <span className="text-text-muted text-sm ml-2">{tool.description}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveTool(index)}
                      className="text-text-muted hover:text-red-400"
                    >
                      ×
                    </button>
                  </div>
                ))}
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
              <h3 className="text-lg font-semibold text-foreground mb-4">Review Your Package</h3>

              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Name</span>
                  <span className="text-foreground font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Display Name</span>
                  <span className="text-foreground">{formData.displayName || formData.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Version</span>
                  <span className="text-foreground">{formData.version}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-glass-border">
                  <span className="text-text-secondary">Category</span>
                  <span className="text-foreground">{getFinalCategory()}</span>
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
                {formData.tools.length > 0 && (
                  <div className="py-2">
                    <span className="text-text-secondary block mb-1">MCP Tools</span>
                    <div className="space-y-1">
                      {formData.tools.map((tool, index) => (
                        <div key={index} className="text-sm">
                          <span className="text-foreground font-medium">{tool.name}</span>
                          <span className="text-text-muted ml-2">{tool.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-glass-bg border border-glass-border">
              <div className="flex items-start gap-3">
                <GitBranch className="w-5 h-5 text-text-muted mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">Publishing Options</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Your MCP package will be published to the ROSClaw MCP Hub.
                    It will undergo automated vetting (5-15 minutes) before becoming publicly available.
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
                {isSubmitting ? "Publishing..." : "Publish Package"}
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
              Package Published Successfully!
            </h2>
            <p className="text-text-secondary mb-6">
              Your package <strong>{formData.name}</strong> has been submitted for automated vetting.
              You will be notified when it&apos;s approved.
            </p>
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
    </div>
  );
}
