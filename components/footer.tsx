"use client";

import { motion } from "framer-motion";
import { Github, Twitter, MessageCircle, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Features", href: "#" },
    { name: "MCP Hub", href: "#mcp-hub" },
    { name: "Skill Market", href: "#skill-market" },
  ],
  Resources: [
    { name: "Documentation", href: "#docs" },
    { name: "API Reference", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Examples", href: "#" },
  ],
  Community: [
    { name: "Discord", href: "https://discord.com/invite/E6nPCDu6KJ" },
    { name: "GitHub", href: "https://github.com/ros-claw" },
    { name: "Twitter", href: "#" },
    { name: "Forum", href: "#" },
  ],
  Company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Contact", href: "mailto:ai@rosclaw.io" },
  ],
};

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/ros-claw" },
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "Discord", icon: MessageCircle, href: "https://discord.com/invite/E6nPCDu6KJ" },
];

export function Footer() {
  return (
    <footer className="bg-background border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Newsletter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-cognitive-cyan/5 to-physical-orange/5 border border-white/10"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-white/60">
                Get the latest updates on ROSClaw features, new robot integrations, and community highlights.
              </p>
            </div>
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-cognitive-cyan/50"
              />
              <button className="px-6 py-3 rounded-lg bg-cognitive-cyan/10 border border-cognitive-cyan/30 text-cognitive-cyan font-medium hover:bg-cognitive-cyan/20 transition-all flex items-center gap-2">
                <span className="hidden sm:inline">Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cognitive-cyan to-physical-orange flex items-center justify-center">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <span className="text-white font-semibold text-xl tracking-tight">ROSClaw</span>
            </a>
            <p className="text-white/50 text-sm mb-6 max-w-xs">
              The Universal OS Bridging Multimodal AI Agents with the Physical World.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            <a href="#" className="text-white/40 text-sm hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
