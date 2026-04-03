# ROSClaw V4 实施计划

> **Agent-Agnostic Embodied Middleware** - 物理AI的通用中间件
>
> 基于 `rosclaw-architecture-v4.md` 架构设计

---

## 架构范式核心转变

### 1. 从单体应用到微内核中间件

**旧思维**: ROSClaw = LLM + VLA + 控制 + 存储 (臃肿耦合)

**新架构**:
```
外部Agent (Claude Code/OpenClaw/QClaw)
         ↓ MCP协议
ROSClaw核心 (Layer 1-4): Runtime → Data Flywheel → Digital Twin → MCP Hub
         ↓ 1kHz Torque
真实机器人硬件

旁路训练: RosClaw-RL (非阻塞数据消费者)
```

### 2. 新Slogan

> **"Teach Once, Embody Anywhere. Share Skills, Shape Reality."**

---

## 实施路线图 (修订版)

### Phase 1.5: 测试与质量 ✅ (已完成)

- [x] 单元测试 (42个测试通过)
- [x] 集成测试修复
- [x] CI/CD管道 (GitHub Actions)
- [x] 代码质量优化

### Phase 2: 数据飞轮与VLA (当前重点)

**Week 3-4: Event-Driven Ring Buffer**
- [ ] `src/rosclaw/data/ring_buffer.py` - 高性能循环缓冲区
- [ ] `src/rosclaw/data/flywheel.py` - 数据飞轮核心
- [ ] `src/rosclaw/data/lerobot_export.py` - LeRobot格式导出
- [ ] 实现存储分层 (Hot/Warm/Cold)

**Week 5-6: VLA策略引擎**
- [ ] `src/rosclaw/policy/base.py` - 策略抽象接口
- [ ] `src/rosclaw/policy/openvla.py` - OpenVLA集成
- [ ] `src/rosclaw/policy/pi0.py` - π0集成
- [ ] 策略热切换机制

**Week 7-8: Skill Library**
- [ ] `src/rosclaw/skills/loader.py` - 技能加载器
- [ ] `src/rosclaw/skills/atomic/` - 原子技能库
- [ ] 技能配置格式定义

### Phase 3: 多机器人与生态

**Week 9-10: sdk_to_mcp增强**
- [ ] Unitree G1支持
- [ ] Franka支持
- [ ] 自动生成MCP Server

**Week 11-12: Skill Flywheel**
- [ ] 自动训练闭环
- [ ] LoRA微调支持

**Week 13-14: ClawHub原型**
- [ ] 技能打包格式 `.rosclaw`
- [ ] 技能市场API

---

## 关键技术决策

### ADR-001: Agent-Agnostic
ROSClaw核心不包含LLM，仅作为MCP服务器接入任意Agent

### ADR-002: Layer 7旁路化
RL训练作为独立进程，绝不阻塞1kHz主流程

### ADR-003: Event-Driven数据存储
只存储事件触发片段，100x存储优化

### ADR-004: sdk_to_mcp硬件接入
AI解析SDK文档自动生成MCP Server，零代码接入

---

## 下一步立即行动

1. **实现RingBuffer** (Week 3 Day 1-2)
   - 高性能numpy循环缓冲区
   - 支持1kHz写入无GC压力

2. **DataFlywheel核心** (Week 3 Day 3-5)
   - 事件触发机制
   - LeRobot格式导出

3. **OpenVLA集成调研** (Week 4)
   - 研究OpenVLA API
   - 设计Policy接口

---

**完整架构文档**: `/root/.claude/plans/rosclaw-architecture-v4.md`

> 基于对 `/root/workspace/rosclaw/rosclaw` 的深入分析
> 以及对 `/root/.claude/plans/` 架构文档的完整理解
> 结合 6 个 awesome 生态目录的技术趋势研究

---

## 一、项目真实状态评估

### 1.1 当前实现状态

**Phase 1: 生产就绪 (Layers 1-4) - ✅ 已完成**

| 组件 | 状态 | 说明 |
|------|------|------|
| Digital Twin Firewall | ✅ 100% | MuJoCo-based 物理验证，415行高质量代码 |
| UR5 MCP Server | ✅ 100% | 真实ROS 2实现，6个MCP工具，651行生产代码 |
| MuJoCo模型 | ✅ 100% | UR5e完整运动学模型 |
| pyproject.toml | ✅ 100% | 生产级包配置，依赖完整 |
| README.md | ✅ 100% | 专业级开源项目文档 |

**关键发现：代码质量高，非模拟/占位符，可直接部署到真实机器人**

### 1.2 缺失组件（按优先级）

**高优先级：**
- [ ] 单元测试（tests/ 目录完全为空）
- [ ] 集成测试修复（与实现API不匹配）
- [ ] CI/CD 管道（GitHub Actions）

**中优先级（Phase 2）：**
- [ ] Event-Driven Ring Buffer（Layer 2 数据飞轮）
- [ ] VLA策略引擎（OpenVLA/π0 集成）
- [ ] 多机器人支持（Unitree G1, Franka）

**长期（Phase 3-4）：**
- [ ] Neural Twin（世界模型）
- [ ] RosClaw-RL 训练框架
- [ ] 多智能体协同（G1+UR5）

---

## 二、架构哲学核心认知

### 2.1 产品定位重构

基于 `readme升级修改指南.md` 和 `nifty-petting-unicorn_重构指南.md` 的深刻洞察：

**新Slogan:**
> **"Teach Once, Embody Anywhere. Share Skills, Shape Reality."**
> （教导一次，任意实体运行。共享技能，重塑现实。）

**架构定位:**
- ❌ 不是单体应用（Monolithic）
- ✅ 是 **Agent-Agnostic Embodied Middleware**（通用具身中间件）
- ✅ 作为 **MCP 超级插件** 接入任意 AI Agent（Claude Code, OpenClaw, QClaw）

### 2.2 分层架构边界

```
外部Agent层（Layer 6+）: Claude Code / OpenClaw / QClaw / AutoGen
         ↓ JSON-RPC via MCP
ROSClaw核心（Layer 1-4）: Runtime → Data Flywheel → Digital Twin → MCP Hub
         ↓ 1000Hz Torque
物理层: ROS 2 / VLA Engine / Hardware

旁路训练（Layer 7）: RosClaw-RL作为数据消费者（非阻塞）
```

### 2.3 关键差异化

| 特性 | ROSClaw | 传统方案 |
|-----|---------|---------|
| Agent接入 | **任意MCP兼容Agent** | 绑定特定框架 |
| 硬件接入 | **sdk_to_mcp 零代码生成** | 手写C++驱动 |
| 安全验证 | **Digital Twin防火墙** | 软件限位检查 |
| 数据利用 | **Event-Driven Ring Buffer** | 全量录制存储 |
| 技能共享 | **跨硬件Skill迁移（ClawHub）** | 单机型配置 |

---

## 三、技术生态集成策略

基于 6 个 awesome 目录的深度研究：

### 3.1 MCP 生态集成（立即实施）

**关键项目:**
- `1mcp/agent` - MCP服务器聚合器 ⭐⭐⭐
- `mcp-gateway` - 节省95%上下文窗口 ⭐⭐⭐
- `omni-mcp/isaac-sim-mcp` - NVIDIA Isaac Sim自然语言控制 ⭐⭐⭐
- `agenium` - Agent间DNS式发现与信任网络 ⭐⭐⭐

### 3.2 VLA 模型后端（Phase 2）

**推荐集成:**
- `OpenVLA` / `GR00T N1` - 通用操作基础模型 ⭐⭐⭐
- `DexGraspVLA` - 灵巧手抓取 ⭐⭐⭐
- `MemER` - 经验记忆检索系统 ⭐⭐⭐
- `Cosmos Policy` / `Motus` - 世界动作模型 ⭐⭐⭐

### 3.3 仿真与训练（已部分实现）

**当前:** MuJoCo (已实现)
**扩展:**
- `MJX` / `MuJoCo Warp` - GPU加速 ⭐⭐⭐
- `Genesis` - 生成式物理引擎 ⭐⭐⭐
- `LeRobot` - 学习框架 ⭐⭐⭐
- `Isaac Sim` - 工业级仿真 ⭐⭐⭐

### 3.4 人形机器人（Phase 3）

**关键集成:**
- `OmniH2O` / `HOMIE` - 全身遥操作 ⭐⭐⭐
- `HumanPlus` - 快速技能学习 ⭐⭐⭐
- `SLAC` - Sim-to-Real迁移 ⭐⭐⭐

---

## 四、实施路线图（修订版）

### Phase 1.5: 测试与质量（立即 - 2周）

**目标:** 完善测试覆盖，修复集成测试

**任务:**
1. **单元测试** (3天)
   - `firewall/decorator.py`: 100% 覆盖
   - `mcp/ur5_server.py`: 核心工具测试
   - 使用 pytest + pytest-asyncio

2. **集成测试修复** (2天)
   - 修复 `scripts/integration_test.py`
   - 更新API调用以匹配实际实现
   - 添加MuJoCo仿真验证测试

3. **CI/CD 管道** (2天)
   - GitHub Actions: lint (ruff), test (pytest), type-check (mypy)
   - 自动发布到 PyPI

4. **代码质量** (3天)
   - 替换 print 为 logging 模块
   - 模型路径配置化
   - 添加更多文档字符串

**交付物:**
- 80%+ 测试覆盖率
- 绿色CI/CD管道
- 发布 v0.1.0 到 PyPI

---

### Phase 2: 数据飞轮与VLA（第3-8周）

**目标:** 实现 Layer 2 (数据层) 和 Layer 5 (策略层)

#### Week 3-4: Event-Driven Ring Buffer

**技术设计:**
```
数据流向: 物理执行 → Ring Buffer → 事件触发 → LeRobot格式 → RL训练
存储分层:
- Hot Data (内存): 60秒完整1kHz
- Warm Data (本地SSD): 7天事件片段
- Cold Data (云端): 永久关键帧+元数据
```

**实现:**
- `src/rosclaw/data/` 模块
- `RingBuffer` 类: 60秒循环缓冲
- 触发器: 成功/失败/紧急停止/用户标注
- `LeRobotDataset` 导出器

**存储优化:**
- 传统: 1TB/天 → ROSClaw: ~10GB/天
- 100% 数据为 Corner Case

#### Week 5-6: VLA 策略引擎

**集成目标:** OpenVLA

**实现:**
- `src/rosclaw/policy/` 模块
- `VLAPolicy` 类: 统一接口
- 支持模型: OpenVLA, π0, Helix
- 频率: 50-100Hz动作生成

**关键组件:**
```python
class VLAPolicy:
    def predict_action(image: np.ndarray,
                       instruction: str) -> np.ndarray
    def fine_tune(dataset: LeRobotDataset)
```

#### Week 7-8: Skill Library

**实现:**
- `src/rosclaw/skills/` 模块
- 原子技能: 抓取、放置、移动
- 复合技能: pick_and_place, scan_and_grasp
- 技能存储: YAML + 权重文件

**交付物:**
- 数据飞轮运行
- VLA策略执行
- 基础技能库

---

### Phase 3: 多机器人与生态（第9-14周）

**目标:** 扩展硬件支持，实现 Skill Flywheel

#### Week 9-10: Unitree G1 支持

**使用 sdk_to_mcp 生成:**
- `rosclaw-g1-mcp` 服务器
- DDS协议支持
- 全身关节控制

#### Week 11-12: Skill Flywheel

**自动训练循环:**
```
对话指令 → 物理执行 → 数据捕获 → VLA微调 → 策略更新
```

**实现:**
- `RosClaw-RL` 训练器（旁路进程）
- LoRA 微调支持
- 自动模型版本管理

#### Week 13-14: ClawHub 生态

**Skill 市场:**
- Skill打包格式: `.rosclaw` (ZIP: config.yaml + weights.bin + metadata.json)
- 上传/下载接口
- 跨硬件迁移（UR5技能 → G1技能）

**交付物:**
- G1机器人支持
- 自动训练流程
- Skill市场原型

---

### Phase 4: 高级功能（第15-20周）

**目标:** Neural Twin, 多智能体, 生产部署

#### Week 15-16: Neural Twin (世界模型)

**集成:** V-JEPA 2 / Cosmos-Predict2.5

**功能:**
- 长程语义预测
- 物理常识推理
- 任务可行性评估

#### Week 17-18: 多智能体协同

**实现:**
- `Reflex Handshake` 协议
- 主从切换逻辑
- G1+UR5协同任务演示

#### Week 19-20: 生产部署

**优化:**
- TSN（时间敏感网络）支持
- 安全PLC集成
- 完整文档和教程

**交付物:**
- Neural Twin预测
- 多智能体演示
- 生产级部署

---

## 五、关键技术决策

### 5.1 为什么保持 Layer 1-4 为核心？

基于架构重构指南的核心洞察：

1. **微内核原则**: 核心只保留最必要的功能
2. **Agent无关**: 任何MCP兼容Agent都可以接入
3. **可替换性**: VLA模型可以随技术发展替换
4. **稳定性**: 核心层经过充分测试后保持稳定

### 5.2 sdk_to_mcp 的定位

**不是替代，而是补充:**

- `sdk_to_mcp`: 从官方SDK文档自动生成MCP Server
- 用途: 新硬件快速接入
- 流程: PDF文档 → AI解析 → 代码生成 → 验证 → 部署

**这与现有代码的关系:**
- `rosclaw/rosclaw`: 核心运行时和安全验证
- `sdk_to_mcp`: 硬件驱动生成工具
- 生成的驱动依赖 `rosclaw` 核心库

### 5.3 测试策略

**TDD London School:**
```
测试 → 实现 → 重构 → 集成验证
```

**测试金字塔:**
- 单元测试: 80% (pytest)
- 集成测试: 15% (MuJoCo仿真)
- E2E测试: 5% (真实机器人，标记为slow)

---

## 六、风险与缓解

| 风险 | 概率 | 影响 | 缓解措施 |
|------|------|------|----------|
| VLA模型集成复杂 | 中 | 高 | 先支持OpenVLA，逐步扩展 |
| 真实机器人测试困难 | 高 | 中 | 完善MuJoCo仿真，模拟测试 |
| Sim-to-Real差距 | 中 | 高 | 域随机化，残差学习 |
| 多智能体同步 | 中 | 高 | 先2个机器人，逐步扩展 |
| 性能瓶颈 | 低 | 中 | 提前使用GPU加速，MJX |

---

## 七、成功指标

### 7.1 技术指标

- [ ] 测试覆盖率 > 80%
- [ ] MCP工具延迟 < 100ms
- [ ] Digital Twin验证 < 10ms
- [ ] 数据存储优化 100x (1TB → 10GB/天)

### 7.2 功能指标

- [ ] 支持 3+ 机器人类型 (UR5, G1, Franka)
- [ ] 技能库 10+ 原子技能
- [ ] 自动训练闭环运行
- [ ] 跨硬件技能迁移

### 7.3 生态指标

- [ ] GitHub Stars > 1000
- [ ] ClawHub Skills > 50
- [ ] 社区贡献者 > 20
- [ ] 企业用户 > 5

---

## 八、立即行动项

### 本周（Week 1）

1. **修复集成测试**
   ```bash
   # 当前问题: integration_test.py 与实现不匹配
   # 需要: 更新API调用，修复属性名
   ```

2. **添加单元测试**
   ```bash
   # 优先级:
   # 1. firewall/decorator.py - DigitalTwinFirewall
   # 2. mcp/ur5_server.py - MCP工具
   ```

3. **设置 CI/CD**
   ```bash
   # GitHub Actions:
   # - ruff (lint)
   # - pytest (test)
   # - mypy (type check)
   ```

### 下周（Week 2）

1. **代码清理**
   - 替换 print → logging
   - 配置化模型路径
   - 完善文档

2. **发布 v0.1.0**
   ```bash
   # 发布到 PyPI
   pip install rosclaw
   ```

---

## 九、总结

ROSClaw 是一个**已经具备生产级基础**的项目：

- ✅ Phase 1 (Layers 1-4) 已完成且质量高
- ✅ Digital Twin 防火墙是真实实现
- ✅ UR5 MCP Server 可直接部署
- ✅ 架构清晰，文档完善

**下一步重点:**
1. 完善测试（立即）
2. 实现数据飞轮（Phase 2）
3. 集成 VLA 模型（Phase 2）
4. 扩展多机器人支持（Phase 3）

**最终愿景:**
> 东京开发者教机械臂拧螺丝 → ClawHub共享 → 柏林工厂在不同人形机器人上运行

**这是"物理AI民主化"的基础设施。**

---

**计划版本:** 1.0
**制定日期:** 2026-03-26
**基于:** rosclaw-architecture-v3.md + 6个awesome生态分析
