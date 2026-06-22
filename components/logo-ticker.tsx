"use client";

import { motion } from "framer-motion";
import { ecosystemGroups } from "@/content/ecosystem";
import { ecosystemStripContent } from "@/content/home";
import { statusBadgeClasses } from "@/content/shared";

function StatusBadge({ status }: { status: keyof typeof statusBadgeClasses }) {
  return (
    <span
      className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${statusBadgeClasses[status]}`}
    >
      {status}
    </span>
  );
}

export function LogoTicker() {
  return (
    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-background border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <p className="text-cognitive-cyan text-xs uppercase tracking-widest mb-2 font-mono">
            {ecosystemStripContent.eyebrow}
          </p>
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {ecosystemStripContent.title}
          </h2>
          <p className="text-white/50 text-sm mt-2 max-w-2xl mx-auto">
            {ecosystemStripContent.description}
          </p>
        </motion.div>

        <div className="space-y-4">
          {ecosystemGroups.map((group, groupIndex) => (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.1, duration: 0.5 }}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
            >
              <span className="text-white/40 text-xs uppercase tracking-wider font-mono sm:w-40 sm:text-right flex-shrink-0">
                {group.title}
              </span>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <div
                    key={item.name}
                    className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] hover:border-white/[0.15] hover:bg-white/[0.05] transition-all"
                  >
                    <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                      {item.name}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
