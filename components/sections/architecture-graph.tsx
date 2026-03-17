'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeProps,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { motion } from 'framer-motion';

// Custom Node Components with Handles - defined outside component
const BrainNode = ({ data }: NodeProps) => (
  <div className="relative">
    <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#00F0FF] !w-3 !h-3" />
    <motion.div 
      className="px-6 py-4 rounded-xl border-2 border-[#00F0FF] bg-[#00F0FF]/10"
      animate={{ boxShadow: ['0 0 20px rgba(0,240,255,0.2)', '0 0 40px rgba(0,240,255,0.4)', '0 0 20px rgba(0,240,255,0.2)'] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="text-[#00F0FF] font-bold text-lg">{data.label}</div>
      <div className="text-[#00F0FF]/70 text-sm">{data.frequency}</div>
    </motion.div>
  </div>
);

const MiddlewareNode = ({ data }: NodeProps) => (
  <div className="relative">
    <Handle type="target" position={Position.Top} id="top" className="!bg-white !w-3 !h-3" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-white !w-3 !h-3" />
    <div className="px-6 py-4 rounded-xl border-2 border-white/30 bg-white/5">
      <div className="text-white font-bold text-lg">{data.label}</div>
      <div className="text-white/50 text-sm">{data.functions?.join(' • ')}</div>
    </div>
  </div>
);

const VlaNode = ({ data }: NodeProps) => (
  <div className="relative">
    <Handle type="target" position={Position.Top} id="top" className="!bg-[#FF3E00] !w-3 !h-3" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-[#FF3E00] !w-3 !h-3" />
    <motion.div 
      className="px-6 py-4 rounded-xl border-2 border-[#FF3E00] bg-[#FF3E00]/10"
      animate={{ boxShadow: ['0 0 20px rgba(255,62,0,0.2)', '0 0 40px rgba(255,62,0,0.4)', '0 0 20px rgba(255,62,0,0.2)'] }}
      transition={{ duration: 0.5, repeat: Infinity }}
    >
      <div className="text-[#FF3E00] font-bold text-lg">{data.label}</div>
      <div className="text-[#FF3E00]/70 text-sm">{data.frequency}</div>
    </motion.div>
  </div>
);

const RosNode = ({ data }: NodeProps) => (
  <div className="relative">
    <Handle type="target" position={Position.Top} id="top" className="!bg-[#4ADE80] !w-3 !h-3" />
    <div className="px-4 py-3 rounded-lg border border-[#4ADE80]/30 bg-[#4ADE80]/5">
      <div className="text-[#4ADE80] font-medium text-sm">{data.label}</div>
      <div className="text-[#4ADE80]/50 text-xs">{data.topic}</div>
    </div>
  </div>
);

// Memoized nodeTypes - defined once at module level
const nodeTypes = Object.freeze({
  brain: BrainNode,
  middleware: MiddlewareNode,
  vla: VlaNode,
  ros: RosNode,
});

// Desktop layout
const desktopNodes: Node[] = [
  { id: 'llm', type: 'brain', position: { x: 250, y: 0 }, data: { label: 'LLM Brain', frequency: '1Hz Reasoning' } },
  { id: 'middleware', type: 'middleware', position: { x: 250, y: 150 }, data: { label: 'ROSClaw Middleware', functions: ['Semantic Routing', 'MCP Bridge', 'e-URDF'] } },
  { id: 'vla', type: 'vla', position: { x: 250, y: 300 }, data: { label: 'VLA Policy (π0.5)', frequency: '100Hz+ Control' } },
  { id: 'ros1', type: 'ros', position: { x: 50, y: 450 }, data: { label: 'Camera Node', topic: 'sensor_msgs/Image' } },
  { id: 'ros2', type: 'ros', position: { x: 200, y: 450 }, data: { label: 'Arm Controller', topic: 'trajectory_msgs/JointTrajectory' } },
  { id: 'ros3', type: 'ros', position: { x: 350, y: 450 }, data: { label: 'Navigation', topic: 'geometry_msgs/Twist' } },
  { id: 'ros4', type: 'ros', position: { x: 500, y: 450 }, data: { label: 'Gripper', topic: 'control_msgs/GripperCommand' } },
];

// Mobile layout (vertical)
const mobileNodes: Node[] = [
  { id: 'llm', type: 'brain', position: { x: 150, y: 0 }, data: { label: 'LLM Brain', frequency: '1Hz' } },
  { id: 'middleware', type: 'middleware', position: { x: 150, y: 120 }, data: { label: 'ROSClaw Middleware', functions: ['Routing', 'MCP', 'e-URDF'] } },
  { id: 'vla', type: 'vla', position: { x: 150, y: 240 }, data: { label: 'VLA Policy', frequency: '100Hz+' } },
  { id: 'ros1', type: 'ros', position: { x: 50, y: 360 }, data: { label: 'Camera', topic: 'Image' } },
  { id: 'ros2', type: 'ros', position: { x: 150, y: 360 }, data: { label: 'Arm', topic: 'JointTrajectory' } },
  { id: 'ros3', type: 'ros', position: { x: 250, y: 360 }, data: { label: 'Nav', topic: 'Twist' } },
];

// Define edges with proper handle references - memoized at module level
const desktopEdges: Edge[] = Object.freeze([
  { id: 'e1', source: 'llm', target: 'middleware', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#00F0FF', strokeWidth: 2 } },
  { id: 'e2', source: 'middleware', target: 'vla', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#fff', strokeWidth: 2 } },
  { id: 'e3', source: 'vla', target: 'ros1', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
  { id: 'e4', source: 'vla', target: 'ros2', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
  { id: 'e5', source: 'vla', target: 'ros3', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
  { id: 'e6', source: 'vla', target: 'ros4', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
]);

const mobileEdges: Edge[] = Object.freeze([
  { id: 'e1', source: 'llm', target: 'middleware', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#00F0FF', strokeWidth: 2 } },
  { id: 'e2', source: 'middleware', target: 'vla', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#fff', strokeWidth: 2 } },
  { id: 'e3', source: 'vla', target: 'ros1', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
  { id: 'e4', source: 'vla', target: 'ros2', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
  { id: 'e5', source: 'vla', target: 'ros3', sourceHandle: 'bottom', targetHandle: 'top', animated: true, style: { stroke: '#FF3E00', strokeWidth: 2 } },
]);

export function ArchitectureGraph() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Use useMemo to prevent recreating arrays on each render
  const initialNodes = useMemo(() => desktopNodes, []);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  
  const initialEdges = useMemo(() => desktopEdges, []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setNodes(isMobile ? mobileNodes : desktopNodes);
    setEdges(isMobile ? mobileEdges : desktopEdges);
  }, [isMobile, setNodes, setEdges]);

  // Memoize the nodes and edges to prevent the warning
  const flowNodes = useMemo(() => nodes, [nodes]);
  const flowEdges = useMemo(() => edges, [edges]);

  return (
    <div className="w-full h-[500px] md:h-[600px] bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden" suppressHydrationWarning>
      <div className="w-full h-full">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          panOnDrag={true}
          zoomOnScroll={false}
          zoomOnPinch={true}
          zoomOnDoubleClick={false}
          minZoom={0.3}
          maxZoom={1.5}
          connectOnClick={false}
          elementsSelectable={false}
          nodesDraggable={false}
          nodesConnectable={false}
          deleteKeyCode={null}
          snapToGrid={true}
          snapGrid={[15, 15]}
        >
          <Background color="#333" gap={16} size={1} />
          <Controls className="!bg-[#1a1a1a] !border-white/10" showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
