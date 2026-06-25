"use client";

import { motion } from "framer-motion";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.08] p-6"
    >
      <h3 className="text-white font-semibold mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
