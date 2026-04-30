export default function TaskCard({ task }) {
  const frequencyLabel = task.frequency === 'Manual' ? 'Manual trigger' : `${task.frequency}`

  return (
    <div className="task-card" id={`task-card-${task.id}`}>
      <div className="task-card-header">
        <div className="task-card-info">
          <h3 className="task-card-name">{task.name}</h3>
          <p className="task-card-desc">{task.description || task.promptPreview}</p>
        </div>
        <div className="task-card-meta">
          <span className="task-card-freq">{frequencyLabel}</span>
          {task.time && <span className="task-card-time">{task.time}</span>}
        </div>
      </div>
      <div className="task-card-prompt">
        <p>{task.prompt}</p>
      </div>
      <div className="task-card-footer">
        <span className="task-card-status task-card-status--idle">Idle</span>
        <button className="task-card-run-btn">Run now</button>
      </div>
    </div>
  )
}
