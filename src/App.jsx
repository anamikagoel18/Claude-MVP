import { useState, useCallback, useEffect } from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import HomeView from './components/Home/HomeView'
import ChatView from './components/Chat/ChatView'
import ScheduledPage from './components/Scheduled/ScheduledPage'
import CreateTaskModal from './components/Modal/CreateTaskModal'
import { detectWorkflow, generateSessionTitle } from './utils/workflowDetector'

// ── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  sessions: [],
  activeSessionId: null,
  workflowCounts: {},
  scheduledTasks: [],
  currentPage: 'home',
  showModal: false,
  pendingAutomateWorkflow: null,
  globalMessageCount: 0,       // total messages across ALL sessions
  globalAlertShown: false,     // 90% alert fires once globally
  globalAlertState: null,
  globalAlertWorkflow: null,
  globalAlertDismissed: false,
  toastMessage: null,          // toast popup text
  toastWorkflow: null,         // workflow name for toast
}

export default function App() {
  const [state, setState] = useState(initialState)

  // Auto-dismiss toast after 5 seconds
  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, toastMessage: null, toastWorkflow: null }))
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [state.toastMessage])

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getWorkflowCountKey = (workflowInstance) => {
    // Group by ruleKey; for rule3 group by workflowName
    if (workflowInstance.ruleKey === 'rule1') return 'rule1'
    if (workflowInstance.ruleKey === 'rule2') return 'rule2'
    return `rule3_${workflowInstance.workflowName}`
  }

  const getGlobalWorkflowCount = useCallback((ruleKey, workflowName) => {
    const key = ruleKey === 'rule1' ? 'rule1' : ruleKey === 'rule2' ? 'rule2' : `rule3_${workflowName}`
    return state.workflowCounts[key] || 0
  }, [state.workflowCounts])

  // ── Session Management ────────────────────────────────────────────────────

  const createNewSession = useCallback((firstPrompt) => {
    const sessionId = crypto.randomUUID()
    const title = generateSessionTitle(firstPrompt)

    // Detect workflow for first prompt
    const workflowInstance = detectWorkflow(firstPrompt)

    // Build first user message
    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      text: firstPrompt,
      workflowInstance,
    }

    const newSession = {
      id: sessionId,
      title,
      messages: [userMsg],
      detectedWorkflows: workflowInstance ? [workflowInstance] : [],
    }

    setState(prev => {
      const newCounts = { ...prev.workflowCounts }
      let toastMessage = prev.toastMessage
      let toastWorkflow = prev.toastWorkflow
      if (workflowInstance) {
        const key = getWorkflowCountKey(workflowInstance)
        newCounts[key] = (newCounts[key] || 0) + 1
        // Toast when workflow reaches exactly ×3
        if (newCounts[key] === 3) {
          toastMessage = `You've used "${workflowInstance.workflowName}" 3 times today — you can automate it from Most Used section`
          toastWorkflow = workflowInstance.workflowName
        }
      }
      const newGlobalCount = prev.globalMessageCount + 1

      // Check 90% alert on user message count
      let globalAlertShown = prev.globalAlertShown
      let globalAlertState = prev.globalAlertState
      let globalAlertWorkflow = prev.globalAlertWorkflow
      if (newGlobalCount >= 10 && !prev.globalAlertShown) {
        globalAlertShown = true
        if (workflowInstance) {
          const wfKey = getWorkflowCountKey(workflowInstance)
          const gcCount = newCounts[wfKey] || 0
          if (gcCount >= 2) {
            globalAlertState = 'A'
            globalAlertWorkflow = workflowInstance
          } else {
            globalAlertState = 'B'
          }
        } else {
          globalAlertState = 'B'
        }
      }

      return {
        ...prev,
        sessions: [newSession, ...prev.sessions],
        activeSessionId: sessionId,
        currentPage: 'chat',
        workflowCounts: newCounts,
        globalMessageCount: newGlobalCount,
        toastMessage,
        toastWorkflow,
        globalAlertShown,
        globalAlertState,
        globalAlertWorkflow,
      }
    })

    // Simulate Claude response after 1 second
    setTimeout(() => {
      addClaudeResponse(sessionId)
    }, 1000)

    return sessionId
  }, [])

  const addClaudeResponse = useCallback((sessionId) => {
    const claudeMsg = {
      id: crypto.randomUUID(),
      role: 'claude',
      text: 'Your output will appear here.',
    }

    setState(prev => {
      const sessions = prev.sessions.map(s => {
        if (s.id !== sessionId) return s
        return { ...s, messages: [...s.messages, claudeMsg] }
      })
      // Don't increment globalMessageCount for Claude responses
      return { ...prev, sessions }
    })
  }, [])

  const sendMessage = useCallback((promptText) => {
    setState(prev => {
      if (!prev.activeSessionId || prev.currentPage !== 'chat') return prev

      const workflowInstance = detectWorkflow(promptText)
      const userMsg = {
        id: crypto.randomUUID(),
        role: 'user',
        text: promptText,
        workflowInstance,
      }

      const newCounts = { ...prev.workflowCounts }
      let toastMessage = prev.toastMessage
      let toastWorkflow = prev.toastWorkflow
      if (workflowInstance) {
        const key = getWorkflowCountKey(workflowInstance)
        newCounts[key] = (newCounts[key] || 0) + 1
        if (newCounts[key] === 3) {
          toastMessage = `You've used "${workflowInstance.workflowName}" 3 times today — you can automate it from Most Used section`
          toastWorkflow = workflowInstance.workflowName
        }
      }

      const newGlobalCount = prev.globalMessageCount + 1

      const sessions = prev.sessions.map(s => {
        if (s.id !== prev.activeSessionId) return s
        return {
          ...s,
          messages: [...s.messages, userMsg],
          detectedWorkflows: workflowInstance
            ? [...s.detectedWorkflows, workflowInstance]
            : s.detectedWorkflows,
        }
      })

      // Check 90% alert on user message count
      let globalAlertShown = prev.globalAlertShown
      let globalAlertState = prev.globalAlertState
      let globalAlertWorkflow = prev.globalAlertWorkflow
      if (newGlobalCount >= 10 && !prev.globalAlertShown) {
        globalAlertShown = true
        if (workflowInstance) {
          const wfKey = getWorkflowCountKey(workflowInstance)
          const gcCount = newCounts[wfKey] || 0
          if (gcCount >= 2) {
            globalAlertState = 'A'
            globalAlertWorkflow = workflowInstance
          } else {
            globalAlertState = 'B'
          }
        } else {
          globalAlertState = 'B'
        }
      }

      return { ...prev, sessions, workflowCounts: newCounts, globalMessageCount: newGlobalCount, toastMessage, toastWorkflow, globalAlertShown, globalAlertState, globalAlertWorkflow }
    })

    // Claude responds after 1s
    setTimeout(() => {
      setState(prev => {
        if (!prev.activeSessionId) return prev
        const claudeMsg = {
          id: crypto.randomUUID(),
          role: 'claude',
          text: 'Your output will appear here.',
        }

        const sessions = prev.sessions.map(s => {
          if (s.id !== prev.activeSessionId) return s
          return { ...s, messages: [...s.messages, claudeMsg] }
        })
        // Don't increment globalMessageCount for Claude responses
        return { ...prev, sessions }
      })
    }, 1000)
  }, [])

  const startNewTask = useCallback(() => {
    // Create a blank session — user will type in it
    setState(prev => ({
      ...prev,
      activeSessionId: null,
      currentPage: 'home',
    }))
  }, [])

  const selectSession = useCallback((sessionId) => {
    setState(prev => ({
      ...prev,
      activeSessionId: sessionId,
      currentPage: 'chat',
    }))
  }, [])

  const dismissAlert = useCallback(() => {
    setState(prev => ({ ...prev, globalAlertDismissed: true }))
  }, [])

  const dismissToast = useCallback(() => {
    setState(prev => ({ ...prev, toastMessage: null, toastWorkflow: null }))
  }, [])

  // ── Navigation ────────────────────────────────────────────────────────────

  const navigateTo = useCallback((page) => {
    setState(prev => ({ ...prev, currentPage: page }))
  }, [])

  // ── Modal ─────────────────────────────────────────────────────────────────

  const openAutomateModal = useCallback((workflowInstance) => {
    setState(prev => ({
      ...prev,
      showModal: true,
      pendingAutomateWorkflow: workflowInstance,
    }))
  }, [])

  const closeModal = useCallback(() => {
    setState(prev => ({ ...prev, showModal: false, pendingAutomateWorkflow: null }))
  }, [])

  const saveScheduledTask = useCallback((task) => {
    setState(prev => ({
      ...prev,
      scheduledTasks: [...prev.scheduledTasks, task],
      showModal: false,
      pendingAutomateWorkflow: null,
      currentPage: 'scheduled',
    }))
  }, [])

  // ── Active Session ────────────────────────────────────────────────────────
  const activeSession = state.sessions.find(s => s.id === state.activeSessionId)

  // Get workflow counts for Most Used — include steps from first matching workflow instance
  const mostUsedWorkflows = Object.entries(state.workflowCounts)
    .map(([key, count]) => {
      let workflowName = key
      let steps = []
      let promptText = ''
      let ruleKey = ''
      for (const session of state.sessions) {
        for (const wf of session.detectedWorkflows) {
          const wfKey = getWorkflowCountKey(wf)
          if (wfKey === key) {
            workflowName = wf.workflowName
            steps = wf.steps
            promptText = wf.promptText
            ruleKey = wf.ruleKey
            break
          }
        }
        if (workflowName !== key) break
      }
      return { key, workflowName, count, steps, promptText, ruleKey }
    })
    .filter(w => w.count >= 2)
    .sort((a, b) => b.count - a.count)

  // Nudge: any workflow at ×3
  const nudgeWorkflow = mostUsedWorkflows.find(w => w.count >= 3)

  // Handler for automate from sidebar (Most Used or nudge)
  const handleSidebarAutomate = useCallback((wfData) => {
    // wfData comes from mostUsedWorkflows — build a workflow-like object for the modal
    openAutomateModal({
      workflowName: wfData.workflowName,
      promptText: wfData.promptText || '',
      steps: wfData.steps || [],
      ruleKey: wfData.ruleKey || '',
    })
  }, [openAutomateModal])

  // Handler for "New task" on Scheduled page — open blank modal
  const openBlankModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showModal: true,
      pendingAutomateWorkflow: { workflowName: '', promptText: '', steps: [], ruleKey: '' },
    }))
  }, [])

  const showGlobalAlert = state.globalAlertShown && !state.globalAlertDismissed

  return (
    <div className="app-layout">
      <Sidebar
        sessions={state.sessions}
        activeSessionId={state.activeSessionId}
        mostUsedWorkflows={mostUsedWorkflows}
        nudgeWorkflow={nudgeWorkflow}
        onNewTask={startNewTask}
        onSelectSession={selectSession}
        onNavigate={navigateTo}
        onAutomate={handleSidebarAutomate}
        currentPage={state.currentPage}
      />

      <main className="dot-grid-bg" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {state.currentPage === 'scheduled' ? (
          <ScheduledPage
            tasks={state.scheduledTasks}
            onNewTask={openBlankModal}
          />
        ) : state.currentPage === 'chat' && activeSession ? (
          <ChatView
            session={activeSession}
            onSendMessage={sendMessage}
            onDismissAlert={dismissAlert}
            onAutomate={openAutomateModal}
            showAlert={showGlobalAlert}
            alertState={state.globalAlertState}
            alertWorkflow={state.globalAlertWorkflow}
          />
        ) : (
          <HomeView onSendMessage={createNewSession} />
        )}
      </main>

      {/* Toast popup — auto-dismiss after 6 seconds */}
      {state.toastMessage && (
        <div className="toast-popup" id="workflow-toast">
          <div className="toast-content">
            <span className="toast-icon">⚡</span>
            <span className="toast-text">{state.toastMessage}</span>
            <button className="toast-close" onClick={dismissToast} aria-label="Close">×</button>
          </div>
        </div>
      )}

      {state.showModal && (
        <CreateTaskModal
          workflow={state.pendingAutomateWorkflow}
          onClose={closeModal}
          onSave={saveScheduledTask}
        />
      )}
    </div>
  )
}
