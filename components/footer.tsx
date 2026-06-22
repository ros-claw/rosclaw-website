"use client";

import { motion } from "framer-motion";
import { Github, Mail, ArrowRight } from "lucide-react";
import { EmailLink } from "./email-link";
import { footerEcosystem } from "@/content/ecosystem";
import { githubDocLinks } from "@/content/cli";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/shared";

const footerLinks = {
  Product: [
    { name: "Runtime", href: "/runtime" },
    { name: "First Embodiment", href: "/#first-embodiment" },
    { name: "Hub", href: "/hub" },
    { name: "Flywheel", href: "/flywheel" },
  ],
  Developers: [
    { name: "Docs", href: "/docs" },
    { name: "GitHub", href: GITHUB_URL },
    { name: "CLI", href: githubDocLinks.cli },
    { name: "Architecture", href: githubDocLinks.architecture },
    { name: "Safety", href: githubDocLinks.safety },
  ],
  Assets: [
    { name: "e-URDF", href: "/hub" },
    { name: "Hardware MCPs", href: "/hub" },
    { name: "Providers", href: "/hub" },
    { name: "Digital Twins", href: "/hub" },
    { name: "Skills", href: "/hub" },
  ],
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: GITHUB_URL },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/rosclaw_logo.png"
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">ROSClaw</span>
            </a>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              Self-evolving runtime infrastructure for Physical AI and embodied agents.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-sm">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith("mailto:") ? (
                      <EmailLink
                        email={link.href.replace("mailto:", "")}
                        className="text-white/50 text-sm hover:text-white transition-colors"
                      >
                        {link.name}
                      </EmailLink>
                    ) : (
                      <a
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-white/50 text-sm hover:text-white transition-colors"
                      >
                        {link.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Contact</h4>
            <ul className="space-y-2.5">
              <li>
                <EmailLink
                  email={CONTACT_EMAIL}
                  className="text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {CONTACT_EMAIL}
                </EmailLink>
              </li>
              <li>
                <a
                  href={GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/50 text-sm hover:text-white transition-colors flex items-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Ecosystem Context */}
        <div className="py-8 border-t border-white/10">
          <p className="text-white/40 text-sm text-center mb-6">Ecosystem & Research Context</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h5 className="text-white/60 text-xs uppercase tracking-wider mb-3 font-mono">Research Context</h5>
              <ul className="space-y-2">
                {footerEcosystem.researchContext.map((name) => (
                  <li key={name} className="text-white/50 text-sm">{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white/60 text-xs uppercase tracking-wider mb-3 font-mono">Robotics Ecosystem</h5>
              <ul className="space-y-2">
                {footerEcosystem.robotics.map((name) => (
                  <li key={name} className="text-white/50 text-sm">{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white/60 text-xs uppercase tracking-wider mb-3 font-mono">Data & Infrastructure</h5>
              <ul className="space-y-2">
                {footerEcosystem.dataInfrastructure.map((name) => (
                  <li key={name} className="text-white/50 text-sm">{name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="text-white/60 text-xs uppercase tracking-wider mb-3 font-mono">Model & Simulation</h5>
              <ul className="space-y-2">
                {footerEcosystem.modelSimulation.map((name) => (
                  <li key={name} className="text-white/50 text-sm">{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} ROSClaw. Open source under MIT License.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-white/40 text-sm hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 text-sm hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
