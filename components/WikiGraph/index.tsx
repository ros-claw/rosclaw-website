'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Graph from 'graphology';
import Sigma from 'sigma';
import { DetailPanel } from './DetailPanel';
import { runForceLayout } from './layout';
import { GraphData, TYPE_COLORS } from './types';

interface WikiGraphProps {
  data: GraphData;
  activeFilter: string;
  onNodeCountChange?: (count: number) => void;
  onEdgeCountChange?: (count: number) => void;
}

export default function WikiGraph({
  data,
  activeFilter,
  onNodeCountChange,
  onEdgeCountChange,
}: WikiGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sigmaRef = useRef<Sigma | null>(null);
  const graphRef = useRef<Graph | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<{
    nodeData: { title: string; type: string; linkCount: number; confidence: number } | null;
    outgoing: { id: string; title: string }[];
    incoming: { id: string; title: string }[];
  }>({
    nodeData: null,
    outgoing: [],
    incoming: [],
  });

  // Initialize Sigma
  useEffect(() => {
    if (!containerRef.current || data.nodes.length === 0) return;

    // Create graph
    const graph = new Graph();

    // Add nodes
    data.nodes.forEach((node) => {
      const size = Math.max(3, Math.min(16, 3 + (node.link_count || 0) * 0.7));
      const color = TYPE_COLORS[node.type] || TYPE_COLORS.unknown;

      graph.addNode(node.id, {
        label: node.title || node.id,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        size,
        color,
        _type: node.type,
        _title: node.title,
        _confidence: node.confidence,
        _linkCount: node.link_count || 0,
      });
    });

    // Add edges
    let edgeCount = 0;
    data.edges.forEach((edge) => {
      if (graph.hasNode(edge.source) && graph.hasNode(edge.target)) {
        try {
          graph.addEdge(edge.source, edge.target, {
            size: 0.5,
            color: 'rgba(148,163,184,0.12)',
          });
          edgeCount++;
        } catch {
          // Ignore duplicate edges
        }
      }
    });

    // Run layout
    runForceLayout(graph, 200);

    // Create Sigma renderer
    const renderer = new Sigma(graph, containerRef.current, {
      renderEdgeLabels: false,
      labelSize: 11,
      labelColor: { color: '#cbd5e1' },
      hideEdgesOnMove: true,
      defaultNodeType: 'circle',
      nodeReducer: (node, attrs) => {
        // Hover highlight
        if (hoveredNode && hoveredNode !== node) {
          const isNeighbor = graph.neighbors(hoveredNode).includes(node);
          if (!isNeighbor) {
            return { ...attrs, color: '#1e293b', label: '', zIndex: 0 };
          }
        }
        // Type filter
        if (activeFilter !== 'all' && attrs._type !== activeFilter) {
          return { ...attrs, hidden: true };
        }
        return attrs;
      },
      edgeReducer: (edge, attrs) => {
        if (hoveredNode) {
          const [src, tgt] = graph.extremities(edge);
          const isConnected = src === hoveredNode || tgt === hoveredNode;
          if (!isConnected) {
            return { ...attrs, color: 'rgba(30,41,59,0.3)' };
          }
          return { ...attrs, color: 'rgba(148,163,184,0.5)', size: 1.2 };
        }
        return attrs;
      },
    });

    // Event handlers
    renderer.on('enterNode', ({ node }) => {
      setHoveredNode(node);
      renderer.refresh();
    });

    renderer.on('leaveNode', () => {
      setHoveredNode(null);
      renderer.refresh();
    });

    renderer.on('clickNode', ({ node }) => {
      showDetailPanel(node);
    });

    // Click on background to deselect
    renderer.on('clickStage', () => {
      setSelectedNode(null);
    });

    sigmaRef.current = renderer;
    graphRef.current = graph;

    onNodeCountChange?.(graph.order);
    onEdgeCountChange?.(graph.size);

    return () => {
      renderer.kill();
    };
  }, [data, activeFilter]);

  // Update reducers when filter/hover changes
  useEffect(() => {
    sigmaRef.current?.refresh();
  }, [activeFilter, hoveredNode]);

  const showDetailPanel = useCallback(
    (nodeId: string) => {
      if (!graphRef.current) return;

      const attrs = graphRef.current.getNodeAttributes(nodeId);

      // Get outgoing links
      const outgoing = data.edges
        .filter((e) => e.source === nodeId)
        .map((e) => {
          const target = data.nodes.find((n) => n.id === e.target);
          return { id: e.target, title: target?.title || e.target };
        });

      // Get incoming links
      const incoming = data.edges
        .filter((e) => e.target === nodeId)
        .map((e) => {
          const source = data.nodes.find((n) => n.id === e.source);
          return { id: e.source, title: source?.title || e.source };
        });

      setDetailData({
        nodeData: {
          title: attrs._title || nodeId,
          type: attrs._type,
          linkCount: attrs._linkCount,
          confidence: attrs._confidence || 0,
        },
        outgoing,
        incoming,
      });
      setSelectedNode(nodeId);
    },
    [data]
  );

  const focusNode = useCallback(
    (nodeId: string) => {
      if (!sigmaRef.current || !graphRef.current) return;
      if (!graphRef.current.hasNode(nodeId)) return;

      const attrs = graphRef.current.getNodeAttributes(nodeId);
      const camera = sigmaRef.current.getCamera();
      camera.animate(
        { x: attrs.x, y: attrs.y, ratio: 0.3 },
        { duration: 400 }
      );
      showDetailPanel(nodeId);
    },
    [showDetailPanel]
  );

  return (
    <div className="relative w-full h-full flex">
      {/* Sigma Container */}
      <div ref={containerRef} className="flex-1 bg-[#0a0e1a]" />

      {/* Detail Panel */}
      {selectedNode && (
        <DetailPanel
          nodeId={selectedNode}
          nodeData={detailData.nodeData}
          outgoing={detailData.outgoing}
          incoming={detailData.incoming}
          onClose={() => setSelectedNode(null)}
          onNodeClick={focusNode}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-[#111827]/90 backdrop-blur-sm rounded-xl p-4 border border-[#1e293b]">
        <h4 className="text-xs font-medium text-white mb-3">Node Types</h4>
        <div className="space-y-2">
          {Object.entries(TYPE_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-text-secondary capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => sigmaRef.current?.getCamera().animatedReset({ duration: 400 })}
          className="px-3 py-2 rounded-lg bg-[#111827]/90 backdrop-blur-sm border border-[#1e293b] text-xs text-white hover:bg-[#1e293b] transition-colors"
        >
          Reset View
        </button>
      </div>
    </div>
  );
}

export { WikiGraph };
export * from './types';
