# vibe.md

## 概览：原文的整体逻辑解构（精炼版）

- **核心命题**：自制力问题可工程化，用数学模型与协议化手段解决。
- **数学模型**：行为倾向 I = ∫ V(τ)·W(τ)dτ；人类短视使近端价值权重极高。
- **CTDP（第一代）**：神圣座位原理（非线性价值压缩）+ 下必为例（判例边界）+ 线性时延（预约 → 降低启动成本）。
- **CTDP 局限**：只作用于“小时级微观节点”，难以跨尺度改变稳态，易回落与耗散。
- **RSIP（第二代）**：从“尺度与稳态”出发，递归回溯到可干预节点，抽象为可复用“定式”，以定式树与回溯堆栈迭代推动稳态跃迁。

---

## 安卓 App 开发文档（vibe）

### 1. 产品定位

- **目标用户**：有拖延/自控困扰（含 ADHD 倾向）的用户。
- **核心价值**：
  - 将 CTDP 工程化，解决“启动难/中途弃/破窗效应”。
  - 将 RSIP 工程化，支持跨日/跨周“稳态跃迁”。
- **产品形态**：离线优先、可选云同步、隐私友好、无社交压力。

### 2. 关键功能

- **CTDP 主链（专注链）**：
  - 神圣触发器（按钮/NFC/蓝牙/地理围栏）。
  - 专注单元（默认 60 分钟，可配）。
  - 违规判定与“下必为例”裁决 UI。
  - 链长与沉没成本可视化，放弃“尖峰损失”提示。
- **CTDP 辅助链（预约链）**：
  - 预约信号（Quick Tile/通知动作/按钮/手势）。
  - 倒计时（默认 15 分钟，可配）。
  - 预约失败裁决与链重置。
- **RSIP 定式树**：
  - 定式模板库（如“回家 15 分钟内洗澡”“不带手机上沙发/卧室”）。
  - 每日最多新增 1 个定式；失败自动连带删除子树。
  - 定式强化（+1/+2…）保护基础稳态；依赖/互斥校验。
- **建模与视图**：
  - 链增长图、裁决历史、破窗风险雷达。
  - 稳态雷达（作息/精力/手机/任务/情绪）。
  - “不可逃逸区”画像与回溯建议。
- **自动化/联动**：
  - 地理围栏、NFC、蓝牙触发。
  - 系统就寝/闹钟例程联动。
- **提醒与干预**：
  - 低阈值启动（先预约）。
  - 临界放弃的“尖峰损失”弹出。
  - 失败复盘引导与新定式推荐。

### 3. 用户故事（精选）

- 作为用户，我要一键“预约 15 分钟后开始”，以降低立即开始阻力。
- 作为用户，当我触发神圣座位（如 NFC）时，系统自动开始 60 分钟专注。
- 作为用户，遇到模糊情境时，需“下必为例”二选一：清空主链或永久允许该行为。
- 作为用户，我每天最多加入一个新定式；若定式失败，系统应连同子节点一并撤回。
- 作为用户，我要看到放弃当刻会损失的“沉没成本+未来损失”估算。

### 4. 领域模型与数据结构（Room 实体草案）

- **Chain（链）**：id, type(MAIN/AUX), currentLength, bestLength, createdAt, updatedAt
- **Session（专注会话）**：id, chainId, startAt, endAt, status(SUCCESS/FAILED), violationCases:[caseId]
- **PrecedentCase（判例）**：id, chainType, behaviorKey, allowed(boolean), decidedAt
- **Appointment（预约）**：id, signalType, scheduledAt, deadlineAt, status(PENDING/SUCCESS/FAILED)
- **Pattern（定式）**：id, title, description, triggerRule, actionRule, level, parentId, dependencies:[id], conflicts:[id]
- **PatternTreeHistory**：id, operation(ADD/REMOVE), nodeId, timestamp, reason
- **Metrics（日指标）**：id, date, sleepScore, energyScore, phoneUsage, taskProgress, moodScore

说明：统一 UTC 存储，前端按本地时区渲染。

### 5. 算法与状态机

- **CTDP 主链状态机**：
  - Idle → Triggered → Focusing → (Success | Violation Decision → Reset | Precedent Allow → Continue) → Idle
- **预约链状态机**：
  - Idle → Scheduled → Countdown → (Triggered → 主链) | (Missed → Decision → Reset/Allow)
- **“下必为例”裁决**：
  - 识别疑似行为 → 查询判例 → 若无判例：用户二选一；结果写入判例，影响后续自动判定。
- **风险尖峰估算**：
  - 沉没成本 S = f(链长、累计成功时长、强化等级)；放弃时提示“立即损失 ≈ S + 未来约束损失”。
- **RSIP 回溯推荐**：
  - 失败定式抽取上下文（时间/位置/设备/前序），回溯到上层可干预节点，生成新定式模板建议。

### 6. 系统架构

- **客户端**：Kotlin + Jetpack
  - UI：Jetpack Compose
  - 状态：ViewModel + Flow
  - DI：Hilt
  - 数据：Room（离线优先），DataStore（偏好）
  - 后台：WorkManager（统计/同步），AlarmManager/Exact Alarms（预约）
  - 位置/设备：FusedLocation/NFC/Bluetooth（可选）
- **可选云同步**：Firebase/自建（REST/GraphQL）；字段级选择，同步可显式开关。
- **包结构建议**：
  - ui/…（compose）
  - feature/ctdp, feature/rsip, feature/metrics
  - data/local, data/remote, data/repo
  - domain/model, domain/usecase
  - core/common, core/designsystem

### 7. 权限与合规

- **按需动态申请**：POST_NOTIFICATIONS, SCHEDULE_EXACT_ALARM, ACCESS_FINE_LOCATION, NFC, BLUETOOTH_CONNECT, ACTIVITY_RECOGNITION。
- **隐私**：
  - 本地加密（可选 SQLCipher）。
  - 判例与定式默认本地；云同步需显式授权与字段选择。
  - 数据导出/删除能力（GDPR 等效实践）。

### 8. UI/交互（关键界面）

- **首页仪表盘**：链长度、今日定式进度、风险提示、快捷预约。
- **专注界面**：倒计时、违规裁决、尖峰提示、白/黑名单提示。
- **预约界面**：预约 15 分钟、剩余时间、提醒。
- **定式树**：树形视图、节点详情（触发/动作/等级/依赖）、子树回退。
- **复盘**：日/周总结，失败原因、回溯建议、新定式推荐。
- **设置**：神圣触发器、手势/Tile、地理围栏、NFC、云同步、隐私。

### 9. 通知与系统集成

- **通知通道**：
  - 预约倒计时（高优先，带“立即触发主链” Action）。
  - 专注进行中（静默常驻）。
  - 风险尖峰提醒（放弃瞬间 Heads-up）。
- **快捷入口**：Quick Settings Tile、桌面 Widget（链长/下一预约/立即预约）。
- **自动化**：回家地理围栏 → 洗澡定式；NFC 贴 → 主链；蓝牙到达 → 预约建议。

### 10. 数据与度量

- **指标**：主/辅链增长、7/30 留存、定式成功率、沉没成本利用率、破窗事件、判例漂移、稳态分布与跃迁趋势。
- **A/B**：预约时长（10/15/20）、尖峰提示呈现、定式新增频率（每日 1 vs 隔日 1）。

### 11. 测试计划

- **单元**：状态机、裁决、定式树回退、回溯推荐。
- **仿真**：多次快速预约、通知打断、时区切换、闹钟权限缺失。
- **E2E**：预约 → 主链 → 裁决 → 成功/失败 → 复盘 → 定式新增。
- **可用性**：放弃提示不阻断核心流程；清链需二次确认。

### 12. 上线与灰度

- **渠道**：国内商店/Google Play（Exact Alarm 合规说明）。
- **灰度**：MVP 仅启用预约链+主链；后续开启定式树与自动化。
- **日志**：崩溃、关键状态迁移、匿名指标；用户可关闭。

### 13. 路线图（建议）

- **M1**：CTDP MVP（主链/预约链/裁决/可视化/Room）。
- **M2**：定式树（新增/回退/强化/模板库）。
- **M3**：自动化（地理围栏/NFC/Tile/Widget）与稳态视图。
- **M4**：回溯向导与推荐、云同步（可选）。
- **M5**：策略商店（定式模板共享，导入/导出）。

### 14. 设计原则映射（原理 → 功能）

- **非线性价值压缩** → 链沉没成本可视化 + 放弃风险尖峰提示。
- **下必为例** → 判例引擎（一次放行永久放行/或清链）。
- **线性时延** → 预约链（低阈值启动）。
- **不可逃逸区** → 情境画像 + 回溯推荐。
- **定式树与回溯堆栈** → 每日 1 新、失败即子树回退、强化保护根。

### 15. 安全与故障策略

- **存活**：前台服务最小常驻；关键预约冗余调度。
- **降级**：无位置 → 禁用地理围栏；无 Exact Alarm→ 近似调度并提示。
- **备份**：本地加密导出；云同步可选。

---

本文件依据原文思想进行工程化设计，落地为安卓端可实现的产品与技术方案，服务于后续架构与迭代开发。
