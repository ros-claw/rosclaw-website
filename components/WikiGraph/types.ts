export interface GraphNode {
  id: string;
  title: string;
  type: 'entity' | 'algorithm' | 'concept' | 'skill' | 'unknown';
  confidence: number;
  link_count: number;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const TYPE_COLORS: Record<string, string> = {
  entity: '#3b82f6',
  algorithm: '#22c55e',
  concept: '#f59e0b',
  skill: '#ec4899',
  unknown: '#94a3b8',
};

export const TYPE_LABELS: Record<string, string> = {
  entity: 'Entity',
  algorithm: 'Algorithm',
  concept: 'Concept',
  skill: 'Skill',
  unknown: 'Unknown',
};
