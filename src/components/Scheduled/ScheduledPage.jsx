import TaskCard from './TaskCard'
import './Scheduled.css'

// Stopwatch SVG illustration — matches Image 5
const StopwatchIllustration = () => (
  <svg width="72" height="80" viewBox="0 0 72 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Stopwatch body */}
    <circle cx="36" cy="48" r="26" stroke="#172B4D" strokeWidth="2" fill="none"/>
    {/* Crown/button top */}
    <rect x="30" y="16" width="12" height="6" rx="3" stroke="#172B4D" strokeWidth="2" fill="none"/>
    {/* Stem connecting crown to body */}
    <line x1="36" y1="22" x2="36" y2="24" stroke="#172B4D" strokeWidth="2" strokeLinecap="round"/>
    {/* Side buttons */}
    <rect x="6" y="30" width="8" height="4" rx="2" stroke="#172B4D" strokeWidth="1.5" fill="none"/>
    <rect x="58" y="30" width="8" height="4" rx="2" stroke="#172B4D" strokeWidth="1.5" fill="none"/>
    {/* Clock hands */}
    <line x1="36" y1="48" x2="36" y2="34" stroke="#172B4D" strokeWidth="2" strokeLinecap="round"/>
    <line x1="36" y1="48" x2="46" y2="54" stroke="#172B4D" strokeWidth="2" strokeLinecap="round"/>
    {/* Center dot */}
    <circle cx="36" cy="48" r="2" fill="#172B4D"/>
    {/* Tick marks */}
    <line x1="36" y1="24" x2="36" y2="27" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="36" y1="69" x2="36" y2="72" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="11" y1="48" x2="14" y2="48" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="58" y1="48" x2="61" y2="48" stroke="#172B4D" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Filter/sort icon
const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
    <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

// Sun icon for Keep awake
const SunIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="3" stroke="currentColor" strokeWidth="1.3"/>
    <line x1="7" y1="0.5" x2="7" y2="2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="7" y1="11.5" x2="7" y2="13.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="0.5" y1="7" x2="2.5" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="11.5" y1="7" x2="13.5" y2="7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="2.44" y1="2.44" x2="3.86" y2="3.86" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10.14" y1="10.14" x2="11.56" y2="11.56" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="2.44" y1="11.56" x2="3.86" y2="10.14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
    <line x1="10.14" y1="3.86" x2="11.56" y2="2.44" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

// Info icon
const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="7" cy="7" r="6" stroke="#5E6C84" strokeWidth="1.3"/>
    <line x1="7" y1="6" x2="7" y2="10" stroke="#5E6C84" strokeWidth="1.3" strokeLinecap="round"/>
    <circle cx="7" cy="4" r="0.7" fill="#5E6C84"/>
  </svg>
)

// Toggle component
function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`toggle ${checked ? 'toggle--on' : ''}`}
      onClick={() => onChange(!checked)}
      id="keep-awake-toggle"
    >
      <span className="toggle-thumb" />
    </button>
  )
}

import { useState } from 'react'

export default function ScheduledPage({ tasks, onNewTask }) {
  const [keepAwake, setKeepAwake] = useState(false)

  return (
    <div className="scheduled-page">
      {/* Header */}
      <div className="scheduled-header">
        <div className="scheduled-header-left">
          <h1 className="scheduled-title">Scheduled tasks</h1>
          <p className="scheduled-subtitle">
            Run tasks on a schedule or whenever you need them. Type /schedule in any existing task to set one up.
          </p>
        </div>
        <div className="scheduled-header-right">
          <button className="scheduled-icon-btn" aria-label="Filter">
            <FilterIcon />
          </button>
          <button className="scheduled-icon-btn" aria-label="Search">
            <SearchIcon />
          </button>
          <button className="scheduled-new-btn" id="scheduled-new-task-btn" onClick={onNewTask}>
            New task
          </button>
        </div>
      </div>

      {/* Awake Banner */}
      <div className="awake-banner" id="awake-banner">
        <div className="awake-banner-left">
          <InfoIcon />
          <span>Scheduled tasks only run while your computer is awake.</span>
        </div>
        <div className="awake-banner-right">
          <SunIcon />
          <span className="awake-label">Keep awake</span>
          <Toggle checked={keepAwake} onChange={setKeepAwake} />
        </div>
      </div>

      {/* Tasks or Empty State */}
      <div className="scheduled-content">
        {tasks.length === 0 ? (
          <div className="scheduled-empty" id="scheduled-empty-state">
            <StopwatchIllustration />
            <p className="scheduled-empty-text">No scheduled tasks yet.</p>
          </div>
        ) : (
          <div className="task-cards-list">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
