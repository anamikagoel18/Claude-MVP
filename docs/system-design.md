# Claude Cowork — Workflow Memory: High-Level System Design

## 1. Overview

**Workflow Memory** is a feature within Claude Cowork that intelligently detects, tracks, and automates recurring multi-step workflows from natural language prompts. It transforms passive conversations into structured, reusable automation pipelines.

### Core Capabilities
- **Real-time workflow detection** from natural language prompts
- **Cross-session pattern aggregation** via keyword-based rule engine
- **Intelligent automation nudges** triggered by usage frequency
- **Smart 90% usage alerts** with context-aware workflow suggestions
- **Scheduled task orchestration** with configurable frequency

---

## 2. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                        │
│                                                                  │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ HomeView │  │ ChatView  │  │Scheduled │  │ CreateTask   │   │
│  │          │  │ + AlertBar│  │  Page    │  │   Modal      │   │
│  └────┬─────┘  └─────┬─────┘  └────┬─────┘  └──────┬───────┘   │
│       │              │              │               │           │
│  ┌────┴──────────────┴──────────────┴───────────────┴────────┐  │
│  │                     SIDEBAR                               │  │
│  │  ┌──────────┐  ┌───────────────┐  ┌────────────────────┐  │  │
│  │  │ Recents  │  │  Most Used    │  │    Navigation      │  │  │
│  │  │ (hover   │  │  (hover steps │  │  (New task, Sched) │  │  │
│  │  │  badges) │  │   + automate) │  │                    │  │  │
│  │  └──────────┘  └───────────────┘  └────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
├──────────────────────────────────────────────────────────────────┤
│                        STATE LAYER (App.jsx)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  Centralized State                        │   │
│  │                                                          │   │
│  │  sessions[]        ─ All chat sessions + messages        │   │
│  │  workflowCounts{}  ─ Global workflow frequency tracker   │   │
│  │  scheduledTasks[]  ─ Persisted automation tasks          │   │
│  │  globalMessageCount─ Cross-session user message counter  │   │
│  │  globalAlertState  ─ 90% usage alert (A/B)               │   │
│  │  toastMessage      ─ ×3 workflow notification            │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │                                     │
├───────────────────────────┼──────────────────────────────────────┤
│                    INTELLIGENCE LAYER                            │
│                                                                  │
│  ┌────────────────────────┴─────────────────────────────────┐   │
│  │              Workflow Detector Engine                      │   │
│  │              (workflowDetector.js)                         │   │
│  │                                                          │   │
│  │  ┌─────────────────┐  ┌────────────────┐                │   │
│  │  │ Sequential      │  │ Deliverable    │                │   │
│  │  │ Structure Check │  │ Keyword Check  │                │   │
│  │  │ (first/then/    │  │ (report/brief/ │                │   │
│  │  │  next/finally)  │  │  PDF/doc/etc)  │                │   │
│  │  └────────┬────────┘  └───────┬────────┘                │   │
│  │           │    BOTH required  │                          │   │
│  │           └────────┬──────────┘                          │   │
│  │                    ▼                                     │   │
│  │  ┌─────────────────────────────────────┐                │   │
│  │  │       Rule Classification           │                │   │
│  │  │                                     │                │   │
│  │  │  Rule 1: Competitor/Benchmark       │                │   │
│  │  │  Rule 2: Sprint Retro/Team Review   │                │   │
│  │  │  Rule 3: Dynamic (topic-derived)    │                │   │
│  │  └─────────────────────────────────────┘                │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

```
App.jsx (State Hub)
├── Sidebar
│   ├── Navigation (New task, Projects, Scheduled, etc.)
│   ├── RecentsSection (session list + hover workflow badges)
│   └── MostUsedSection (workflow aggregation + hover steps + automate)
│
├── HomeView (initial prompt input)
├── ChatView (messages + AlertBar)
│   ├── ChatInput (message composer)
│   └── AlertBar (90% usage — State A or B)
│
├── ScheduledPage (task cards + empty state)
│   └── TaskCard (individual scheduled task)
│
├── CreateTaskModal (task creation form)
└── Toast Popup (×3 automation nudge)
```

---

## 4. Data Models

### Session
```js
{
  id: UUID,
  title: string,                    // First 9 words of first prompt
  messages: Message[],              // All user + Claude messages
  detectedWorkflows: WorkflowInstance[]  // Workflows found in this session
}
```

### Message
```js
{
  id: UUID,
  role: 'user' | 'claude',
  text: string,
  workflowInstance: WorkflowInstance | null  // Attached if detected
}
```

### WorkflowInstance
```js
{
  id: UUID,
  promptText: string,               // Original user prompt
  steps: string[4],                 // 4 extracted action steps
  ruleKey: 'rule1' | 'rule2' | 'rule3',
  workflowName: string              // e.g., "Competitor Brief workflow"
}
```

### ScheduledTask
```js
{
  id: UUID,
  name: string,
  description: string,
  prompt: string,
  frequency: 'Manual' | 'Hourly' | 'Daily' | 'Weekdays' | 'Weekly',
  time: string | null,
  workflowName: string
}
```

---

## 5. Workflow Detection Engine

### Detection Pipeline

```
User Prompt
    │
    ▼
┌──────────────────────┐     ┌──────────────────────┐
│ Sequential Structure │ AND │  Final Deliverable    │
│ Check                │     │  Check                │
│                      │     │                       │
│ Keywords:            │     │ Keywords:             │
│ first, then, next,   │     │ as a PDF, as a report,│
│ after that, finally  │     │ format the output,    │
│                      │     │ produce a report, etc.│
│ OR 2+ action verbs:  │     │                       │
│ research, analyze,   │     │                       │
│ compare, draft, etc. │     │                       │
└──────────┬───────────┘     └──────────┬────────────┘
           │        BOTH PASS           │
           └────────────┬───────────────┘
                        ▼
              ┌─────────────────┐
              │ Rule Classifier │
              │                 │
              │ Rule 1 keywords?│──▶ Competitor Brief
              │ Rule 2 keywords?│──▶ Sprint Retro
              │ Neither?        │──▶ Rule 3 (Dynamic)
              └────────┬────────┘
                       ▼
              ┌─────────────────┐
              │  Step Generator │
              │                 │
              │ Rule 1/2: Fixed │
              │ Rule 3: Parsed  │
              │ from prompt     │
              └─────────────────┘
```

### Rule 3 — Dynamic Workflow Naming
When no specific rule matches, the workflow name is derived from topic keywords:
- `email/inbox` → Email Summary workflow
- `feedback/survey` → Feedback Analysis workflow
- `social/campaign` → Campaign Brief workflow
- `data/metric` → Data Report workflow
- `user/customer` → User Research workflow
- `code/technical` → Tech Review workflow

---

## 6. Alert & Notification System

### 90% Usage Alert (Global Counter)

| Condition | Alert State | Display |
|-----------|-------------|---------|
| 10th user message + last msg IS a workflow + used ≥2× before | **State A** | "You've used a similar workflow before — Automate →" |
| 10th user message + last msg IS a workflow + first use | **State B** | "You've used 90% of your session limit" |
| 10th user message + last msg NOT a workflow | **State B** | "You've used 90% of your session limit" |

### Toast Notification (×3 Trigger)
- Fires when any workflow type reaches exactly **3 uses**
- Auto-dismisses after **5 seconds**
- Message: `You've used "X workflow" 3 times today — you can automate it from Most Used section`

### Automate Badge (Sidebar)
- Appears in Most Used section when workflow count ≥ 3
- Click opens CreateTaskModal pre-filled with workflow data

---

## 7. State Management Flow

```
User types prompt
       │
       ├──▶ detectWorkflow(promptText)
       │         │
       │         ├── null (not a workflow)
       │         └── WorkflowInstance (is a workflow)
       │
       ├──▶ Update session.messages
       ├──▶ Update session.detectedWorkflows
       ├──▶ Increment workflowCounts[key]
       ├──▶ Increment globalMessageCount
       │
       ├──▶ Check: count === 3? → Fire toast
       ├──▶ Check: globalMessageCount ≥ 10? → Fire 90% alert
       │         └── Determine State A vs B
       │
       └──▶ Claude auto-responds (1s delay)
                  │
                  └── Does NOT increment globalMessageCount
```

---

## 8. Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Functional Components) |
| Build Tool | Vite 8 |
| State Management | React useState + useCallback + useEffect |
| Styling | Vanilla CSS with Atlassian Design Tokens |
| Routing | Simulated (currentPage state) |
| IDs | crypto.randomUUID() |
| Persistence | In-memory (no localStorage yet) |

---

## 9. Future Architecture Considerations

### Backend Integration
- Replace `detectWorkflow()` with LLM-based semantic analysis
- Replace simulated Claude responses with actual API calls
- Store sessions/tasks in a database

### Persistence Layer
- `localStorage` for session/task persistence across refreshes
- IndexedDB for larger datasets

### Enhanced Detection
- ML-based workflow similarity scoring (instead of keyword matching)
- User-defined custom workflow templates
- Cross-user workflow pattern sharing
