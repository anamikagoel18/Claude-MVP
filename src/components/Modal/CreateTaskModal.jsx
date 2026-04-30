import { useState, useEffect } from 'react'
import './Modal.css'

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <line x1="4" y1="4" x2="14" y2="14" stroke="#5E6C84" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="14" y1="4" x2="4" y2="14" stroke="#5E6C84" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const FolderIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M1.5 3.5h4l1.5 1.5H12a1 1 0 011 1v5a1 1 0 01-1 1H2a1 1 0 01-1-1V4.5a1 1 0 011-1z" stroke="#5E6C84" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
  </svg>
)

const ChevronDown = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2.5 4L5.5 7L8.5 4" stroke="#5E6C84" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const FREQUENCIES = ['Manual', 'Hourly', 'Daily', 'Weekdays', 'Weekly']

export default function CreateTaskModal({ workflow, onClose, onSave }) {
  const [name, setName] = useState(workflow?.workflowName || '')
  const [description, setDescription] = useState('')
  const [prompt, setPrompt] = useState(workflow?.promptText || '')
  const [frequency, setFrequency] = useState('Manual')
  const [time, setTime] = useState('09:00')
  const [freqOpen, setFreqOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.modal-freq-wrapper')) {
        setFreqOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSave = () => {
    if (!name.trim()) return
    onSave({
      id: crypto.randomUUID(),
      name: name.trim(),
      description: description.trim(),
      prompt: prompt.trim(),
      frequency,
      time: frequency !== 'Manual' ? time : null,
      workflowName: workflow?.workflowName,
    })
  }

  return (
    <div className="modal-overlay" id="create-task-modal-overlay" onClick={(e) => {
      if (e.target === e.currentTarget) onClose()
    }}>
      <div className="modal-box" id="create-task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">Create scheduled task</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal" id="modal-close-btn">
            <CloseIcon />
          </button>
        </div>

        {/* Name */}
        <div className="modal-field">
          <label className="modal-label" htmlFor="task-name-input">
            Name <span className="modal-required">*</span>
          </label>
          <input
            id="task-name-input"
            type="text"
            className="modal-input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Task name"
          />
        </div>

        {/* Description */}
        <div className="modal-field">
          <label className="modal-label" htmlFor="task-desc-input">
            Description <span className="modal-required">*</span>
          </label>
          <input
            id="task-desc-input"
            type="text"
            className="modal-input"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Short description of the task"
          />
        </div>

        {/* Prompt textarea */}
        <div className="modal-prompt-box">
          <textarea
            id="task-prompt-textarea"
            className="modal-prompt-textarea"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe what this task should do..."
            rows={4}
          />
          <div className="modal-prompt-toolbar">
            <button className="toolbar-btn" id="modal-project-btn">
              <FolderIcon />
              <span>Work in a project</span>
              <ChevronDown />
            </button>
            <button className="toolbar-btn" id="modal-ask-btn">
              <span>Ask</span>
              <ChevronDown />
            </button>
            <div style={{ flex: 1 }} />
            <button className="toolbar-btn" id="modal-model-btn">
              <span>Default model</span>
              <ChevronDown />
            </button>
          </div>
        </div>

        {/* Frequency */}
        <div className="modal-field">
          <label className="modal-label">Frequency</label>
          <div className="modal-freq-wrapper">
            <button
              className="modal-freq-btn"
              id="frequency-dropdown-btn"
              onClick={() => setFreqOpen(o => !o)}
              type="button"
            >
              <span>{frequency}</span>
              <ChevronDown />
            </button>
            {freqOpen && (
              <div className="modal-freq-dropdown" id="frequency-dropdown">
                {FREQUENCIES.map(f => (
                  <button
                    key={f}
                    className={`modal-freq-option ${f === frequency ? 'modal-freq-option--selected' : ''}`}
                    onClick={() => { setFrequency(f); setFreqOpen(false) }}
                    id={`freq-option-${f.toLowerCase()}`}
                  >
                    <span>{f}</span>
                    {f === frequency && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#0052CC" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Time picker — only when not Manual */}
        {frequency !== 'Manual' && (
          <div className="modal-field">
            <label className="modal-label" htmlFor="task-time-input">Time</label>
            <input
              id="task-time-input"
              type="time"
              className="modal-input modal-input--time"
              value={time}
              onChange={e => setTime(e.target.value)}
            />
          </div>
        )}

        {/* Actions */}
        <div className="modal-actions">
          <button className="modal-cancel-btn" id="modal-cancel-btn" onClick={onClose}>Cancel</button>
          <button
            className="modal-save-btn"
            id="modal-save-btn"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
