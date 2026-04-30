import './Chat.css'

export default function AlertBar({ alertState, workflow, onDismiss, onAutomate }) {
  if (alertState === 'A' && workflow) {
    return (
      <div className="alert-bar alert-bar--state-a" id="alert-bar-state-a">
        <p className="alert-text">
          You&apos;ve used 90% of your session limit — you&apos;ve used a similar
          workflow (<strong>{workflow.workflowName}</strong>) before.
          Automate it to save time and tokens on future runs.
        </p>
        <button
          className="alert-automate-btn"
          id="automate-btn"
          onClick={onAutomate}
        >
          Automate →
        </button>
      </div>
    )
  }

  // State B — simple 90% message, no workflow reference
  return (
    <div className="alert-bar alert-bar--state-b" id="alert-bar-state-b">
      <p className="alert-text">You&apos;ve used 90% of your session limit</p>
      <div className="alert-bar-right">
        <button className="alert-get-more-btn" id="get-more-usage-btn">
          Get more usage
        </button>
        <button
          className="alert-close-btn"
          id="alert-close-btn"
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </button>
      </div>
    </div>
  )
}
