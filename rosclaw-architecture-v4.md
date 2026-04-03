# ROSClaw Architecture V4: Agent-Agnostic Embodied Middleware

> **The Universal OS for Physical AI** | Teach Once, Embody Anywhere. Share Skills, Shape Reality.
>
> **定位**: 面向物理世界的通用具身中间件，以MCP超级插件形式接入任意AI Agent

---

## 第一部分：架构范式转变 (Architectural Paradigm Shift)

### 1.1 从单体应用到微内核中间件

**旧思维 (Monolithic)**:
```
ROSClaw = LLM推理 + VLA策略 + 数据存储 + 物理控制 + ...
→ 臃肿、耦合、难以扩展
```

**新架构 (Agent-Agnostic Middleware)**:
```
外部Agent层: Claude Code / OpenClaw / QClaw / AutoGen / 任意MCP客户端
         ↓ JSON-RPC 2.0 via MCP
ROSClaw核心 (Layer 1-4): Runtime → Data Flywheel → Digital Twin → MCP Hub
         ↓ 1000Hz Torque Commands
物理层: ROS 2 / DDS / Real Hardware

旁路训练 (Non-blocking): RosClaw-RL ← LeRobot格式数据 ← 数据飞轮
```

**核心洞察**: ROSClaw不是"大脑"，而是连接大脑与身体的"神经系统"。

### 1.2 分层架构边界 (Layer Boundaries)

| 层级 | 组件 | 职责 | 时延要求 | 归属 |
|-----|------|------|---------|------|
| **Layer 6+** | Cognitive Agent | 意图理解、任务规划、高层决策 | 100-500ms | **外部** |
| **Layer 5** | VLA Policy | 视觉-语言-动作策略 (OpenVLA/π0) | 50-100Hz | **外部** |
| **Layer 4** | MCP Hub | 协议转换、工具注册、安全边界 | <10ms | **核心** |
| **Layer 3** | Digital Twin | MuJoCo仿真验证、碰撞检测 | 1-10ms | **核心** |
| **Layer 2** | Data Flywheel | Ring Buffer、事件触发、数据导出 | 异步 | **核心** |
| **Layer 1** | ROS 2 Runtime | 实时控制、硬件抽象、DDS通信 | 1kHz | **核心** |
| **Layer 7** | RosClaw-RL | 离线训练、LoRA微调、策略优化 | 旁路 | **旁路** |

**关键原则**:
- **Layer 6+ (认知)**: 完全外部化，通过MCP标准协议接入
- **Layer 5 (策略)**: 可插拔，VLA模型随技术发展替换
- **Layer 1-4 (核心)**: 稳定、经过充分测试、保持极简
- **Layer 7 (训练)**: 旁路数据消费者，绝不阻塞主流程

### 1.3 新Slogan与愿景

> **"Teach Once, Embody Anywhere. Share Skills, Shape Reality."**
>
> (教导一次，任意实体运行。共享技能，重塑现实。)

**物理AI民主化宣言**:
- 东京开发者教机械臂拧螺丝 → ClawHub共享 → 柏林工厂在人形机器人上运行
- 技能与硬件解耦，一次学习，随处部署

---

## 第二部分：核心组件设计

### 2.1 Layer 4: MCP Hub (协议网关)

**职责**: 作为MCP服务器，将ROSClaw能力暴露给任意AI Agent

```python
# src/rosclaw/mcp/hub.py
class ROSClawMCPHub:
    """
    ROSClaw MCP Hub - 统一的MCP协议网关

    将Layer 1-3的能力通过MCP工具暴露给外部Agent
    """

    def __init__(self):
        self.mcp = FastMCP("rosclaw")
        self.firewall = DigitalTwinFirewall()
        self.data_flywheel = DataFlywheel()

    def register_core_tools(self):
        """注册核心MCP工具"""

        @self.mcp.tool()
        def robot_get_state(robot_id: str) -> dict:
            """获取机器人当前状态（关节位置、速度、力矩）"""
            pass

        @self.mcp.tool()
        def robot_move_joints(
            robot_id: str,
            joint_positions: list[float],
            duration: float,
            validate: bool = True
        ) -> dict:
            """
            移动机器人到目标关节位置

            如果validate=True，先通过Digital Twin验证安全性
            """
            if validate:
                result = self.firewall.validate_trajectory([joint_positions])
                if not result.is_safe:
                    return {"success": False, "error": result.violation_details}

            # 执行物理控制...

        @self.mcp.tool()
        def skill_execute(skill_name: str, parameters: dict) -> dict:
            """执行预定义技能"""
            pass

        @self.mcp.tool()
        def trajectory_validate(waypoints: list[list[float]]) -> dict:
            """验证轨迹安全性（不执行）"""
            pass
```

**MCP工具分类**:
1. **State Tools**: 获取机器人状态、传感器数据
2. **Control Tools**: 关节控制、笛卡尔空间控制、轨迹执行
3. **Safety Tools**: 轨迹验证、碰撞检测、紧急停止
4. **Skill Tools**: 技能加载、执行、参数配置
5. **Data Tools**: 数据记录、导出、回放

### 2.2 Layer 3: Digital Twin Firewall (数字孪生防火墙)

**现有实现**: `src/rosclaw/firewall/decorator.py` (已生产就绪)

**增强设计**:

```python
# src/rosclaw/firewall/twin.py
class DigitalTwinFirewall:
    """
    数字孪生防火墙 - 物理执行前的最后一道安全防线

    基于MuJoCo的高精度物理仿真，提供:
    1. 轨迹预验证（碰撞检测、关节限位、扭矩预测）
    2. 运行时监控（与真实机器人状态对比）
    3. 域随机化（Sim-to-Real迁移验证）
    """

    def __init__(
        self,
        model_path: str,           # MuJoCo模型路径
        joint_limits: dict,        # 关节限位
        torque_limits: dict,       # 扭矩限位
        safety_level: SafetyLevel = SafetyLevel.STRICT,
        sim_steps_per_check: int = 10,
    ):
        self.model = mujoco.MjModel.from_xml_path(model_path)
        self.data = mujoco.MjData(self.model)

    def validate_trajectory(
        self,
        trajectory: list[list[float]],  # 轨迹点序列
        time_step: float = 0.001,        # 仿真步长
    ) -> ValidationResult:
        """
        验证轨迹安全性

        在MuJoCo中逐步仿真，检查:
        - 关节限位违规
        - 自碰撞
        - 环境碰撞
        - 扭矩超载
        """
        pass

    def predict_dynamics(
        self,
        current_state: RobotState,
        target_action: np.ndarray,
    ) -> DynamicsPrediction:
        """
        预测执行动作后的动力学状态

        用于：
        - 力控模式下的接触力预测
        - 高速运动中的惯性力计算
        """
        pass
```

**安全等级**:
| 等级 | 描述 | 适用场景 |
|-----|------|---------|
| **STRICT** | 零容忍，任何碰撞风险都拒绝 | 工业部署、有人环境 |
| **MODERATE** | 允许轻微接触（力控任务） | 柔顺装配、表面擦拭 |
| **LENIENT** | 仅阻止严重碰撞 | 研究实验、快速迭代 |

### 2.3 Layer 2: Data Flywheel (数据飞轮)

**全新设计** - 这是Phase 2的核心组件

```python
# src/rosclaw/data/flywheel.py
class DataFlywheel:
    """
    数据飞轮 - 高性能数据捕获与流转系统

    解决核心问题：如何以1kHz捕获数据，但只存储有价值的数据？

    解决方案：Event-Driven Ring Buffer
    - 内存中始终保持60秒完整数据（循环覆盖）
    - 事件触发时（成功/失败/标注），将前后片段保存
    - 自动导出为LeRobot格式供训练使用
    """

    def __init__(
        self,
        buffer_duration_sec: float = 60.0,
        sampling_rate_hz: int = 1000,
        robot_dof: int = 6,
        camera_topics: list[str] = None,
    ):
        # Ring Buffer配置
        buffer_size = int(buffer_duration_sec * sampling_rate_hz)

        self.joint_pos_buffer = RingBuffer(buffer_size, shape=(robot_dof,))
        self.joint_vel_buffer = RingBuffer(buffer_size, shape=(robot_dof,))
        self.torque_buffer = RingBuffer(buffer_size, shape=(robot_dof,))
        self.image_buffers = {
            topic: RingBuffer(buffer_size, shape=(H, W, 3), dtype=np.uint8)
            for topic in camera_topics or []
        }

        # 事件存储
        self.events: list[DataEvent] = []

    def on_control_cycle(self, state: RobotState):
        """
        每个控制周期调用（1kHz）

        极高性能要求：此函数必须在<1ms内完成
        """
        self.joint_pos_buffer.append(state.q)
        self.joint_vel_buffer.append(state.dq)
        self.torque_buffer.append(state.tau)

    def trigger_event(
        self,
        event_type: EventType,      # SUCCESS / FAILURE / EMERGENCY / USER_MARK
        metadata: dict,             # 任务描述、语言指令等
    ) -> str:
        """
        触发数据保存事件

        保存事件前后各5秒的完整数据片段
        返回片段ID用于后续检索
        """
        # 从Ring Buffer提取片段
        pre_event = self.joint_pos_buffer.get_last_n(5000)  # 5秒
        post_event = self.joint_pos_buffer.get_current_n(5000)

        # 导出为LeRobot格式
        dataset_entry = LeRobotDatasetEntry(
            images=self.get_synced_images(),
            states=np.concatenate([pre_event, post_event]),
            actions=...,  # 实际执行的动作
            language_instruction=metadata.get("instruction"),
            task=metadata.get("task"),
        )

        return dataset_entry.id

    def export_to_lerobot(
        self,
        output_path: str,
        filter_fn: callable = None,
    ) -> LeRobotDataset:
        """
        导出所有事件数据为LeRobot格式

        用于：
        - RosClaw-RL训练
        - 技能微调
        - 数据集共享
        """
        pass
```

**数据存储分层**:
```
┌─────────────────────────────────────────────────────────┐
│  Hot Data (内存)                                         │
│  - 60秒完整1kHz数据                                       │
│  - Ring Buffer循环覆盖                                    │
│  - 延迟：<1μs访问                                         │
├─────────────────────────────────────────────────────────┤
│  Warm Data (本地SSD)                                     │
│  - 7天事件片段                                            │
│  - LeRobot格式                                           │
│  - 自动压缩                                               │
├─────────────────────────────────────────────────────────┤
│  Cold Data (云端)                                        │
│  - 永久关键帧+元数据                                       │
│  - 用于技能共享                                           │
│  - ClawHub同步                                            │
└─────────────────────────────────────────────────────────┘
```

**存储优化对比**:
| 方案 | 日存储量 | 关键数据占比 |
|-----|---------|-------------|
| 传统全量录制 | 1TB/天 | 0.1% |
| ROSClaw事件驱动 | ~10GB/天 | 100% |
| **优化比** | **100x** | **1000x** |

### 2.4 Layer 1: ROS 2 Runtime (实时运行时)

**现有实现**: `src/rosclaw/mcp/ur5_server.py`中的UR5ROSNode

**抽象设计**:

```python
# src/rosclaw/runtime/base.py
class RobotRuntime(ABC):
    """
    机器人运行时抽象基类

    所有机器人类型的通用接口
    """

    @abstractmethod
    def get_joint_states(self) -> JointState:
        """获取关节状态"""
        pass

    @abstractmethod
    def move_joints(
        self,
        positions: np.ndarray,
        duration: float,
        blocking: bool = False,
    ) -> bool:
        """移动关节到目标位置"""
        pass

    @abstractmethod
    def emergency_stop(self) -> bool:
        """紧急停止"""
        pass

# src/rosclaw/runtime/ros2_node.py
class ROS2RobotRuntime(RobotRuntime):
    """
    ROS 2实现的机器人运行时
    """

    def __init__(self, robot_type: str, namespace: str = ""):
        self.node = rclpy.create_node(f"{robot_type}_runtime")
        self.joint_sub = self.node.create_subscription(
            JointState, f"{namespace}/joint_states", self._on_joint_state, 10
        )
        self.command_pub = self.node.create_publisher(
            JointTrajectory, f"{namespace}/joint_trajectory_controller/command", 10
        )
```

### 2.5 Layer 7: RosClaw-RL (旁路训练器)

**设计原则**: 绝不阻塞主流程，作为独立进程运行

```python
# src/rosclaw/training/rl_trainer.py (独立进程)
class RosClawRLTrainer:
    """
    RosClaw-RL训练器 - 基于对话的个性化策略学习

    工作流程:
    1. 从Data Flywheel消费LeRobot格式数据
    2. 使用OpenClaw-RL框架进行离线训练
    3. 生成LoRA权重
    4. 通过MCP推送新策略到运行时
    """

    def __init__(self, data_source: str):
        self.dataset = LeRobotDataset(data_source)

    def train_from_feedback(
        self,
        conversation_history: list[dict],  # 用户对话历史
        reward_model: str = "human-feedback",
    ) -> PolicyCheckpoint:
        """
        基于对话反馈训练策略

        用户说:
        "刚才那个动作太快了，慢一点" → 训练信号
        "抓取失败了，应该更低一点" → 训练信号
        """
        # 使用OpenClaw-RL进行训练
        # 返回LoRA权重路径
        pass
```

---

## 第三部分：技能系统 (Skill System)

### 3.1 技能定义

**技能 = 可复用的物理能力单元**

```yaml
# skill_config.yaml
skill:
  name: "zero_shot_pour"
  version: "2.1.0"
  author: "MIT Robotics Lab"

  # 元数据
  description: "Pour from any container to any cup"
  tags: ["manipulation", "dual-arm", "vision"]

  # 兼容性
  compatible_robots:
    - "ur5"
    - "franka"
    - "unitree-g1"

  # 依赖
  dependencies:
    - "rosclaw-vision>=1.5.0"
    - "rosclaw-force>=0.8.0"

  # 执行逻辑
  execution:
    type: "vla_policy"  # 或 "behavior_tree", "trajectory"
    model: "weights.bin"  # VLA模型权重

  # 参数
  parameters:
    spill_threshold: 0.5
    pouring_speed: "adaptive"
```

### 3.2 技能层级

```
┌─────────────────────────────────────────────────────────┐
│  复合技能 (Composite Skills)                             │
│  例如: make_coffee = [fetch_cup, pour_water, place_pot] │
├─────────────────────────────────────────────────────────┤
│  原子技能 (Atomic Skills)                                │
│  例如: grasp, place, pour, push                         │
├─────────────────────────────────────────────────────────┤
│  基元动作 (Primitive Actions)                            │
│  例如: move_joint, move_cartesian, activate_gripper     │
└─────────────────────────────────────────────────────────┘
```

### 3.3 ClawHub技能市场

**愿景**: 技能的GitHub + DockerHub

```
开发者A (东京)
  ↓ 训练机械臂拧螺丝技能
  ↓ 导出 .rosclaw 包 (config + weights + metadata)
  ↓ 上传到 ClawHub

开发者B (柏林)
  ↓ 搜索 "screwing"
  ↓ 下载技能包
  ↓ 部署到Unitree G1人形机器人
  ↓ 通过VLA迁移学习适配新硬件
```

**技能包格式 (.rosclaw)**:
```
pour-coffee.rosclaw/
├── skill.yaml          # 配置
├── policy.bin          # VLA权重
├── metadata.json       # 作者、统计等
└── README.md           # 文档
```

---

## 第四部分：硬件接入 - sdk_to_mcp

### 4.1 零代码硬件接入方案

**核心理念**: 不是"写驱动"，而是"生成驱动"

```
官方SDK文档 (PDF/Markdown)
        ↓
  sdk_to_mcp 工具
  - AI解析协议
  - 自动生成MCP Server
  - 安全边界注入
        ↓
  rosclaw-{robot}-mcp 包
  - 立即可用
  - 无需手写C++
```

**已验证支持**:
| 机器人 | 状态 | MCP包名 |
|-------|------|---------|
| Universal Robots UR5 | ✅ 已验证 | rosclaw-ur5-mcp |
| Unitree G1 Humanoid | 🔄 开发中 | rosclaw-g1-mcp |
| Unitree Go2 Quadruped | 🔄 开发中 | rosclaw-go2-mcp |
| Franka Emika Panda | 🔄 开发中 | rosclaw-franka-mcp |

### 4.2 sdk_to_mcp工作流程

```python
# sdk_to_mcp_core.py 概念
class SDKToMCPConverter:
    """
    SDK到MCP的自动转换器
    """

    def parse_sdk_docs(self, pdf_path: str) -> SDKSpec:
        """
        解析官方SDK文档
        提取：话题、服务、动作、参数
        """
        pass

    def generate_mcp_server(self, spec: SDKSpec) -> str:
        """
        生成MCP Server代码

        包括：
        - ROS 2节点包装
        - MCP工具注册
        - 安全边界注入
        - 文档字符串
        """
        pass
```

---

## 第五部分：实施路线图

### Phase 1: 核心生产就绪 (已完成 ✅)

**状态**: ✅ Digital Twin Firewall + UR5 MCP Server

### Phase 2: 数据飞轮与VLA (第3-8周)

**Week 3-4: Event-Driven Ring Buffer**
- [ ] 实现RingBuffer类
- [ ] 实现DataFlywheel核心
- [ ] LeRobot格式导出
- [ ] 存储分层测试

**Week 5-6: VLA策略引擎**
- [ ] OpenVLA集成
- [ ] VLAPolicy抽象接口
- [ ] 策略热切换

**Week 7-8: Skill Library**
- [ ] 技能定义格式
- [ ] 技能加载器
- [ ] 基础原子技能

### Phase 3: 多机器人与生态 (第9-14周)

**Week 9-10: sdk_to_mcp增强**
- [ ] 支持Unitree G1
- [ ] 支持Franka

**Week 11-12: Skill Flywheel**
- [ ] 自动训练闭环
- [ ] LoRA微调支持

**Week 13-14: ClawHub原型**
- [ ] 技能上传/下载
- [ ] 跨硬件迁移

### Phase 4: 高级功能 (第15-20周)

**Week 15-16: Neural Twin**
- [ ] V-JEPA 2集成
- [ ] 长程预测

**Week 17-18: 多智能体协同**
- [ ] Reflex Handshake协议
- [ ] G1+UR5协同

---

## 第六部分：关键决策记录 (ADR)

### ADR-001: Agent-Agnostic架构
**决策**: ROSClaw核心不包含LLM推理，仅作为MCP服务器
**原因**:
- 避免绑定特定Agent框架
- 保持核心稳定
- 让Agent层自由竞争

### ADR-002: Layer 7旁路化
**决策**: RL训练作为独立进程，不阻塞主流程
**原因**:
- 训练耗时不可预测
- 主流程必须保持1kHz实时性
- 数据消费模式更灵活

### ADR-003: Event-Driven数据存储
**决策**: 只存储事件触发的片段，而非全量录制
**原因**:
- 100x存储优化
- 100%数据为有价值场景
- 符合人类学习模式（只记住关键经验）

### ADR-004: sdk_to_mcp硬件接入
**决策**: 通过AI解析SDK文档自动生成MCP Server
**原因**:
- 零代码接入新硬件
- 比传统ROS驱动开发快10x
- 统一安全边界注入

---

## 第七部分：成功指标

### 技术指标
- [ ] 测试覆盖率 > 80%
- [ ] MCP工具延迟 < 100ms
- [ ] Digital Twin验证 < 10ms
- [ ] 数据存储优化 100x

### 功能指标
- [ ] 支持 3+ 机器人类型
- [ ] 技能库 10+ 原子技能
- [ ] 自动训练闭环运行
- [ ] 跨硬件技能迁移

### 生态指标
- [ ] GitHub Stars > 1000
- [ ] ClawHub Skills > 50
- [ ] 社区贡献者 > 20

---

## 第八部分：总结

**ROSClaw V4定位**:
> **Agent-Agnostic Embodied Middleware** - 物理AI的通用中间件

**核心价值主张**:
1. **Teach Once, Embody Anywhere** - 技能与硬件解耦
2. **Share Skills, Shape Reality** - 技能共享生态
3. **Zero-Code Hardware Integration** - sdk_to_mcp
4. **Safety by Design** - Digital Twin防火墙

**技术债务状态**:
- ✅ Phase 1 生产就绪
- 🔄 Phase 2 进行中
- ⏳ Phase 3-4 规划中

**下一步行动**:
1. 实现Event-Driven Ring Buffer (Week 3)
2. 集成OpenVLA (Week 5)
3. 发布v0.2.0到PyPI

---

**文档版本**: V4.0
**最后更新**: 2026-03-31
**基于**: rosclaw-architecture-v3.md + nifty-petting-unicorn_重构指南.md
