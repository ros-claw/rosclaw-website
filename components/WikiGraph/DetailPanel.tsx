'use client';

import { X, ExternalLink } from 'lucide-react';
import { TYPE_COLORS, TYPE_LABELS } from './types';

interface DetailPanelProps {
  nodeId: string | null;
  nodeData: {
    title: string;
    type: string;
    linkCount: number;
    confidence: number;
  } | null;
  outgoing: { id: string; title: string }[];
  incoming: { id: string; title: string }[];
  onClose: () => void;
  onNodeClick: (nodeId: string) => void;
}

export function DetailPanel({
  nodeId,
  nodeData,
  outgoing,
  incoming,
  onClose,
  onNodeClick,
}: DetailPanelProps) {
  if (!nodeId || !nodeData) return null;

  const color = TYPE_COLORS[nodeData.type] || TYPE_COLORS.unknown;

  return (
    <div className="w-[340px] bg-[#111827] border-l border-[#1e293b] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#1e293b] flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">{nodeData.title}</h3>
          <span
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
            style={{ backgroundColor: `${color}20`, color }}
          >
            {TYPE_LABELS[nodeData.type] || 'Unknown'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Meta */}
      <div className="p-4 border-b border-[#1e293b]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-text-muted mb-1">Total Links</p>
            <p className="text-xl font-semibold text-white">{nodeData.linkCount}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted mb-1">Confidence</p>
            <p className="text-xl font-semibold text-white">
              {(nodeData.confidence * 100).toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Outgoing Links */}
      <div className="flex-1 overflow-y-auto">
        {outgoing.length > 0 && (
          <div className="p-4 border-b border-[#1e293b]">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cognitive-cyan" />
              Outgoing Links ({outgoing.length})
            </h4>
            <div className="space-y-2">
              {outgoing.slice(0, 10).map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNodeClick(link.id)}
                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary group-hover:text-white truncate">
                      {link.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
              {outgoing.length > 10 && (
                <p className="text-xs text-text-muted text-center py-2">
                  +{outgoing.length - 10} more
                </p>
              )}
            </div>
          </div>
        )}

        {/* Incoming Links */}
        {incoming.length > 0 && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-physical-orange" />
              Incoming Links ({incoming.length})
            </h4>
            <div className="space-y-2">
              {incoming.slice(0, 10).map((link) => (
                <button
                  key={link.id}
                  onClick={() => onNodeClick(link.id)}
                  className="w-full text-left p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary group-hover:text-white truncate">
                      {link.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
              {incoming.length > 10 && (
                <p className="text-xs text-text-muted text-center py-2">
                  +{incoming.length - 10} more
                </p>
              )}
            </div>
          </div>
        )}

        {outgoing.length === 0 && incoming.length === 0 && (
          <div className="p-4 text-center text-text-muted">
            <p>No links connected</p>
          </div>
        )}
      </div>

      {/* Wiki Link */}
      <div className="p-4 border-t border-[#1e293b]">
        <a
          href={`https://wiki.rosclaw.io/${nodeId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 transition-colors text-sm"
        >
          <ExternalLink className="w-4 h-4" />
          View in Wiki
        </a>
      </div>
    </div>
  );
}
