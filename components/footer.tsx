import { Github, MessageCircle, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 py-12 px-4 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-[#00F0FF] to-[#FF3E00] flex items-center justify-center">
              <span className="text-black font-bold text-xs">R</span>
            </div>
            <span className="text-white/40 text-sm">
              © 2026 ROSClaw. Defined by the Open Source Community.
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://github.com/rosclaw/rosclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://discord.gg/rosclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com/rosclaw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
