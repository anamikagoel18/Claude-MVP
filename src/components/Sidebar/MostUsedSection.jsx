import { useState } from 'react'

// Check icon for workflow label
const CheckIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M2 5l2.5 2.5L8 3" stroke="#00875A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

/**
 * Single workflow type item with hover expand showing steps + automate button
 */
function MostUsedItem({ wf, onAutomate }) {
  const [hovered, setHovered] = useState(false)
  const showAutomate = wf.count >= 3

  return (
    <li
      className="most-used-item-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Main row */}
      <div className="most-used-item">
        <span className="most-used-name">{wf.workflowName}</span>
        <span className="most-used-count">×{wf.count}</span>
      </div>

      {/* Hover expand — shows steps + Automate button */}
      <div className={`most-used-expand ${hovered ? 'most-used-expand--open' : ''}`}>
        <div className="workflow-expand-block">
          <div className="workflow-expand-label">
            <CheckIcon />
            {wf.workflowName}
          </div>
          <ul className="workflow-steps">
            {(wf.steps || []).map((step, i) => (
              <li key={i} className="workflow-step">
                <span className="step-number">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          {showAutomate && (
            <button
              className="run-workflow-btn"
              onClick={(e) => {
                e.stopPropagation()
                onAutomate(wf)
              }}
            >
              Automate →
            </button>
          )}
        </div>
      </div>
    </li>
  )
}

export default function MostUsedSection({ mostUsedWorkflows, nudgeWorkflow, onNavigate, onAutomate }) {
  return (
    <div className="most-used-section">
      <div className="most-used-label">Most Used today</div>
      <ul className="most-used-list">
        {mostUsedWorkflows.map(wf => (
          <MostUsedItem
            key={wf.key}
            wf={wf}
            onAutomate={onAutomate}
          />
        ))}
      </ul>

      {/* Nudge banner at ×3 */}
      {nudgeWorkflow && (
        <div
          className="nudge-banner"
          role="button"
          tabIndex={0}
          onClick={() => {
            if (onAutomate) onAutomate(nudgeWorkflow)
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && onAutomate) onAutomate(nudgeWorkflow)
          }}
          id="nudge-banner"
        >
          You&apos;ve run this workflow {nudgeWorkflow.count} times today — automate it? →
        </div>
      )}
    </div>
  )
}
