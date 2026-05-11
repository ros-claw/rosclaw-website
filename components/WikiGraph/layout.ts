import Graph from 'graphology';

export function runForceLayout(g: Graph, iterations: number = 200) {
  const nodes = g.nodes().map(id => ({
    id,
    x: g.getNodeAttribute(id, 'x') || Math.random() * 100 - 50,
    y: g.getNodeAttribute(id, 'y') || Math.random() * 100 - 50,
    vx: 0,
    vy: 0,
  }));

  const nodeMap: Record<string, typeof nodes[0]> = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  for (let iter = 0; iter < iterations; iter++) {
    // 斥力（节点间相互排斥）
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const f = 60 / (dist * dist);
        const fx = (dx / dist) * f, fy = (dy / dist) * f;
        a.vx += fx; a.vy += fy;
        b.vx -= fx; b.vy -= fy;
      }
    }

    // 引力（边连接的节点相互吸引）
    g.forEachEdge((_edge, _attrs, source, target) => {
      const s = nodeMap[source], t = nodeMap[target];
      if (!s || !t) return;
      let dx = t.x - s.x, dy = t.y - s.y;
      let dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = dist * 0.006;
      const fx = (dx / dist) * f, fy = (dy / dist) * f;
      s.vx += fx; s.vy += fy;
      t.vx -= fx; t.vy -= fy;
    });

    // 应用速度 + 中心引力（防止飘走）
    for (const n of nodes) {
      n.vx *= 0.6;
      n.vy *= 0.6;
      n.vx -= n.x * 0.002;
      n.vy -= n.y * 0.002;
      n.x += n.vx;
      n.y += n.vy;
    }
  }

  for (const n of nodes) {
    g.setNodeAttribute(n.id, 'x', n.x);
    g.setNodeAttribute(n.id, 'y', n.y);
  }
}
