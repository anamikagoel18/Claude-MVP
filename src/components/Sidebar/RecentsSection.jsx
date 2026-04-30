import { useState } from 'react'

// Workflow SVG check icon
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke="#00875A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

function SessionItem({ session, isActive, onSelect }) {
  const [hovered, setHovered] = useState(false)

  // Deduplicate workflows by workflowName — show each type only once
  const uniqueWorkflows = session.detectedWorkflows.reduce((acc, wf) => {
    if (!acc.find(w => w.workflowName === wf.workflowName)) {
      acc.push(wf)
    }
    return acc
  }, [])

  const hasWorkflows = uniqueWorkflows.length > 0

  return (
    <li
      className="session-item"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className={`session-item-row ${isActive ? 'session-item-row--active' : ''}`}
        onClick={() => onSelect(session.id)}
      >
        <div className="session-dot" />
        <div className="session-content">
          <div className="session-title">{session.title}</div>
        </div>
      </div>

      {/* Hover expand — only if this session has detected workflows */}
      {hasWorkflows && (
        <div className={`session-expand ${hovered ? 'session-expand--open' : ''}`}>
          {uniqueWorkflows.map((wf) => (
            <div key={wf.id} className="workflow-expand-block">
              <div className="workflow-expand-label">
                <CheckIcon />
                {wf.workflowName}
              </div>
              <ul className="workflow-steps">
                {wf.steps.map((step, i) => (
                  <li key={i} className="workflow-step">
                    <span className="step-number">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  )
}

export default function RecentsSection({ sessions, activeSessionId, onSelectSession }) {
  return (
    <div className="recents-section">
      <div className="recents-label">Recents</div>
      <ul className="recents-list">
        {sessions.map(session => (
          <SessionItem
            key={session.id}
            session={session}
            isActive={session.id === activeSessionId}
            onSelect={onSelectSession}
          />
        ))}
      </ul>
    </div>
  )
}
