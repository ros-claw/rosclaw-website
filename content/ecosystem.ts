// Physical-AI ecosystem content used on the homepage and footer.

import type { StatusLabel } from "./shared";

export interface EcosystemItem {
  name: string;
  status: StatusLabel;
}

export interface EcosystemGroup {
  title: string;
  items: EcosystemItem[];
}

export const ecosystemGroups: EcosystemGroup[] = [
  {
    title: "Agent & Developer Interfaces",
    items: [
      { name: "Claude Code", status: "Ecosystem" },
      { name: "OpenAI", status: "Ecosystem" },
      { name: "MCP", status: "Supported" },
      { name: "OpenClaw", status: "Ecosystem" },
      { name: "GitHub", status: "Ecosystem" },
    ],
  },
  {
    title: "Robotics Middleware & Control",
    items: [
      { name: "ROS 2", status: "Supported" },
      { name: "DDS", status: "Supported" },
      { name: "Unitree", status: "Experimental" },
      { name: "Realman", status: "Experimental" },
      { name: "Leju Robotics", status: "Experimental" },
    ],
  },
  {
    title: "Simulation / Digital Twin",
    items: [
      { name: "MuJoCo", status: "Supported" },
      { name: "Isaac Lab", status: "Planned" },
      { name: "Isaac Sim", status: "Planned" },
      { name: "ManiSkill", status: "Planned" },
      { name: "RoboCasa", status: "Planned" },
    ],
  },
  {
    title: "Memory & Data",
    items: [
      { name: "SeekDB", status: "Supported" },
      { name: "OceanBase", status: "Ecosystem" },
      { name: "MCAP", status: "Supported" },
      { name: "Parquet", status: "Supported" },
      { name: "RLDS", status: "Experimental" },
    ],
  },
  {
    title: "Model & Provider Runtime",
    items: [
      { name: "Hugging Face", status: "Ecosystem" },
      { name: "vLLM", status: "Planned" },
      { name: "SGLang", status: "Planned" },
      { name: "Qwen", status: "Planned" },
      { name: "NVIDIA NIM", status: "Planned" },
    ],
  },
];

export const footerEcosystem = {
  researchContext: [
    "Tongji University",
    "Shanghai Research Institute of Autonomous Intelligent Unmanned Systems",
  ],
  robotics: ["ROS 2", "Unitree", "Realman", "Leju Robotics"],
  dataInfrastructure: ["SeekDB", "OceanBase", "MCAP", "Parquet"],
  modelSimulation: ["Hugging Face", "MuJoCo", "Isaac Lab", "LeRobot"],
};
