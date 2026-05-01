# Claude Cowork — Workflow Memory: User Flow Diagram

## 1. Primary User Journey Map

```mermaid
flowchart TD
    START([User opens Claude Cowork]) --> HOME[Home Screen]
    HOME --> |Types prompt| DETECT{Workflow Detected?}
    
    DETECT --> |Yes| WF_SESSION[New Chat Session<br/>+ Workflow Tracked]
    DETECT --> |No| NORMAL_SESSION[New Chat Session<br/>No Workflow]
    
    WF_SESSION --> SIDEBAR_UPDATE[Sidebar Updates:<br/>• Recents: new session<br/>• Most Used: count +1]
    NORMAL_SESSION --> SIDEBAR_UPDATE2[Sidebar Updates:<br/>• Recents: new session]
    
    SIDEBAR_UPDATE --> CHECK_3{Workflow count = 3?}
    SIDEBAR_UPDATE2 --> CONTINUE_CHAT
    
    CHECK_3 --> |Yes| TOAST[⚡ Toast Popup<br/>'Used 3× today —<br/>automate from Most Used']
    CHECK_3 --> |No| CONTINUE_CHAT[Continue Chatting]
    
    TOAST --> |5s auto-dismiss| CONTINUE_CHAT
    
    CONTINUE_CHAT --> |Send more messages| MSG_COUNT{Global user<br/>messages ≥ 10?}
    
    MSG_COUNT --> |No| CONTINUE_CHAT
    MSG_COUNT --> |Yes| ALERT_CHECK{Last message<br/>is a workflow?}
    
    ALERT_CHECK --> |No| STATE_B[Alert State B<br/>'90% of session limit']
    ALERT_CHECK --> |Yes| USED_BEFORE{Same workflow<br/>used ≥2× before?}
    
    USED_BEFORE --> |No| STATE_B
    USED_BEFORE --> |Yes| STATE_A[Alert State A<br/>'You've used this workflow<br/>before — Automate →']
    
    STATE_A --> |Click Automate| MODAL[Create Task Modal<br/>Pre-filled with workflow]
    STATE_B --> |Dismiss| CONTINUE_CHAT
    
    MODAL --> |Save| SCHEDULED[Scheduled Tasks Page<br/>New task card created]
    MODAL --> |Cancel| CONTINUE_CHAT
```

---

## 2. Sidebar Interaction Flows

### 2a. Recents Section Flow

```mermaid
flowchart LR
    RECENTS[Recents Section] --> SESSION[Session Item]
    SESSION --> |Click| OPEN[Open Chat Session]
    SESSION --> |Hover| EXPAND{Has Workflows?}
    EXPAND --> |Yes| BADGES[Show Workflow<br/>Name Badges<br/>Deduplicated]
    EXPAND --> |No| NOTHING[No Expansion]
    BADGES --> |Mouse Leave| COLLAPSE[Collapse]
```

### 2b. Most Used Section Flow

```mermaid
flowchart LR
    MOST[Most Used Today] --> WF_ITEM[Workflow Item<br/>Name + ×count]
    WF_ITEM --> |Hover| STEPS[Show All 4 Steps<br/>+ Run Workflow Button]
    WF_ITEM --> |Count ≥ 3| AUTOMATE_BADGE[Automate Badge Shown]
    AUTOMATE_BADGE --> |Click| MODAL[Create Task Modal]
```

---

## 3. Workflow Detection Flow

```mermaid
flowchart TD
    INPUT[User Prompt] --> LEN{Length ≥ 15 chars?}
    LEN --> |No| REJECT[Not a Workflow → null]
    LEN --> |Yes| SEQ{Has Sequential<br/>Structure?}
    
    SEQ --> |Check| KW[Keywords: first, then,<br/>next, after that, finally]
    SEQ --> |Check| VERBS[2+ Action Verbs:<br/>research, analyze,<br/>compare, draft, etc.]
    
    KW --> |Found| SEQ_PASS[Sequential ✓]
    VERBS --> |Found 2+| SEQ_PASS
    KW --> |Not Found| VERBS
    VERBS --> |Found <2| REJECT
    
    SEQ_PASS --> DEL{Has Final<br/>Deliverable?}
    
    DEL --> |Check| DEL_KW[Keywords: as a PDF,<br/>format output,<br/>produce a report, etc.]
    
    DEL_KW --> |Found| BOTH_PASS[Both Conditions Met ✓]
    DEL_KW --> |Not Found| REJECT
    
    BOTH_PASS --> CLASSIFY{Classify Rule}
    
    CLASSIFY --> |Competitor keywords| R1[Rule 1: Competitor Brief]
    CLASSIFY --> |Sprint/retro keywords| R2[Rule 2: Sprint Retro]
    CLASSIFY --> |Neither| R3[Rule 3: Dynamic<br/>Topic-based naming]
    
    R1 --> INSTANCE[Create WorkflowInstance<br/>with steps + metadata]
    R2 --> INSTANCE
    R3 --> INSTANCE
```

---

## 4. 90% Alert Decision Flow

```mermaid
flowchart TD
    COUNT[Global user messages = 10] --> FIRED{Alert already<br/>fired before?}
    FIRED --> |Yes| SKIP[Skip — one-time only]
    FIRED --> |No| CHECK_LAST{Is last user message<br/>a workflow?}
    
    CHECK_LAST --> |No| B[Show State B<br/>'90% of session limit'<br/>+ Get more usage button]
    CHECK_LAST --> |Yes| CHECK_HISTORY{Same workflow type<br/>used ≥2× globally?}
    
    CHECK_HISTORY --> |No| B
    CHECK_HISTORY --> |Yes| A[Show State A<br/>'You've used this workflow<br/>before — Automate →'<br/>+ Automate button]
    
    A --> |Click Automate| MODAL[Open Create Task Modal<br/>Pre-filled with workflow]
    B --> |Click ×| DISMISS[Alert Dismissed]
    B --> |Click Get more usage| UPGRADE[Upgrade Flow]
```

---

## 5. Scheduled Task Creation Flow

```mermaid
flowchart TD
    TRIGGER{Entry Point} --> |Alert State A button| MODAL
    TRIGGER --> |Most Used automate badge| MODAL
    TRIGGER --> |Scheduled page 'New task'| MODAL_BLANK
    
    MODAL[Create Task Modal<br/>Pre-filled] --> FILL[Fields:<br/>• Name ← workflow name<br/>• Description<br/>• Prompt ← original prompt<br/>• Frequency dropdown<br/>• Time picker]
    
    MODAL_BLANK[Create Task Modal<br/>Blank] --> FILL
    
    FILL --> FREQ{Frequency selected}
    FREQ --> |Manual| NO_TIME[No time picker shown]
    FREQ --> |Hourly/Daily/Weekly| TIME[Time picker shown]
    
    NO_TIME --> SAVE[Click Save]
    TIME --> SAVE
    
    SAVE --> TASK[Task Card Created<br/>on Scheduled Page]
    TASK --> NAVIGATE[Auto-navigate to<br/>Scheduled Page]
```

---

## 6. Session Lifecycle

```mermaid
sequenceDiagram
    participant U as User
    participant H as HomeView
    participant A as App State
    participant D as Detector
    participant C as ChatView
    participant S as Sidebar
    
    U->>H: Types prompt + Enter
    H->>A: createNewSession(prompt)
    A->>D: detectWorkflow(prompt)
    D-->>A: WorkflowInstance | null
    A->>A: Create session + increment counts
    A->>A: Check toast (count=3?)
    A->>A: Check alert (count≥10?)
    A->>C: Render ChatView with messages
    A->>S: Update Recents + Most Used
    
    Note over A,C: After 1 second
    A->>C: Add Claude response
    
    U->>C: Types follow-up message
    C->>A: sendMessage(prompt)
    A->>D: detectWorkflow(prompt)
    D-->>A: WorkflowInstance | null
    A->>A: Update session + counts
    A->>C: Re-render with new message
    A->>S: Update Recents + Most Used
```

---

## 7. Complete Page Navigation Map

```mermaid
stateDiagram-v2
    [*] --> Home
    
    Home --> Chat: Send first prompt
    Chat --> Home: Click 'New task' (sidebar)
    Chat --> Chat: Send message / Select session
    Chat --> Scheduled: Click 'Scheduled' (sidebar)
    Chat --> Modal: Alert State A 'Automate →'
    
    Home --> Scheduled: Click 'Scheduled' (sidebar)
    Home --> Chat: Select session from Recents
    
    Scheduled --> Home: Click 'New task' (sidebar)
    Scheduled --> Chat: Select session from Recents
    Scheduled --> Modal: Click 'New task' button
    
    Modal --> Scheduled: Save task
    Modal --> Chat: Cancel (return to previous)
    
    state Chat {
        [*] --> Messaging
        Messaging --> AlertShown: 10 user messages globally
        AlertShown --> Messaging: Dismiss alert
    }
```
