"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ExpandableSummary({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  const expandable = text.length > 360;

  useEffect(() => setExpanded(false), [text]);

  return (
    <div className="mt-5 max-w-3xl">
      <p className={`text-pretty text-base leading-relaxed text-white/52 md:text-lg ${expandable && !expanded ? "line-clamp-6" : ""}`}>
        {text}
      </p>
      {expandable && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="focus-ring mt-3 inline-flex items-center gap-1.5 text-xs text-cognitive-cyan transition-colors hover:text-white"
        >
          {expanded ? <>Collapse summary <ChevronUp className="h-3.5 w-3.5" /></> : <>Read full summary <ChevronDown className="h-3.5 w-3.5" /></>}
        </button>
      )}
    </div>
  );
}
