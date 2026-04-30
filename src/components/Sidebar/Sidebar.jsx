import RecentsSection from './RecentsSection'
import MostUsedSection from './MostUsedSection'
import './Sidebar.css'

// ── SVG Icons ──────────────────────────────────────────────────────────────
const HamburgerIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="1" y="7.25" width="14" height="1.5" rx="0.75" fill="currentColor"/>
    <rect x="1" y="11.5" width="14" height="1.5" rx="0.75" fill="currentColor"/>
  </svg>
)

const ChatIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M2 2h12a1 1 0 011 1v8a1 1 0 01-1 1H5l-3 2.5V3a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
  </svg>
)

const CoworkIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="9" y="1.5" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="1.5" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
    <rect x="9" y="9" width="5.5" height="5.5" rx="1" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

const CodeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <polyline points="5,4 1,8 5,12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="11,4 15,8 11,12" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="9.5" y1="2" x2="6.5" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
)

const ProjectsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="4.5" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M1.5 7.5h13" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M5.5 4.5V3a1.5 1.5 0 013 0v1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const ScheduledIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="9" r="6" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 6.5V9l1.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.5 1.5h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 1.5V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const LiveArtifactsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M3.22 3.22l1.41 1.41M11.36 11.36l1.42 1.42M3.22 12.78l1.41-1.41M11.36 4.64l1.42-1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

const DispatchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M1.5 8L7 2.5 14.5 8 7 13.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    <path d="M7 2.5V13.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M1.5 8h13" stroke="currentColor" strokeWidth="1.4"/>
  </svg>
)

const CustomizeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M8 1v2.5M8 12.5V15M1 8h2.5M12.5 8H15M2.93 2.93l1.77 1.77M11.3 11.3l1.77 1.77M2.93 13.07l1.77-1.77M11.3 4.7l1.77-1.77" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const PinIcon = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
    <path d="M9.5 2L14 6.5l-3 1-3 3-1 3-4-4 3-1 1-3z" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
    <line x1="2.5" y1="13.5" x2="6" y2="10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

const UploadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
    <path d="M3 11v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 10V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M5 5.5L8 3l3 2.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const UserIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="11" fill="#E3E8F0" stroke="#C1C7D0" strokeWidth="1"/>
    <circle cx="12" cy="9" r="3.5" fill="#7A8899"/>
    <path d="M4.5 20C4.5 16.5 7.9 14 12 14s7.5 2.5 7.5 6" stroke="#7A8899" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
  </svg>
)

export default function Sidebar({
  sessions,
  activeSessionId,
  mostUsedWorkflows,
  nudgeWorkflow,
  onNewTask,
  onSelectSession,
  onNavigate,
  onAutomate,
  currentPage,
}) {
  return (
    <aside className="sidebar">
      {/* ── Top Nav ── */}
      <div className="sidebar-topnav">
        <button className="sidebar-icon-btn topnav-hamburger" aria-label="Menu">
          <HamburgerIcon />
        </button>
        <div className="topnav-tabs">
          <button className="topnav-tab">
            <ChatIcon /> Chat
          </button>
          <button className="topnav-tab topnav-tab--active">
            <CoworkIcon /> Cowork
          </button>
          <button className="topnav-tab">
            <CodeIcon /> Code
          </button>
        </div>
      </div>

      {/* ── Nav Items ── */}
      <nav className="sidebar-nav">
        <button
          id="new-task-btn"
          className="sidebar-navitem sidebar-navitem--new"
          onClick={onNewTask}
        >
          <PlusIcon />
          <span>New task</span>
        </button>
        <button className="sidebar-navitem">
          <ProjectsIcon />
          <span>Projects</span>
        </button>
        <button
          className={`sidebar-navitem ${currentPage === 'scheduled' ? 'sidebar-navitem--active-page' : ''}`}
          onClick={() => onNavigate('scheduled')}
          id="scheduled-nav-btn"
        >
          <ScheduledIcon />
          <span>Scheduled</span>
        </button>
        <button className="sidebar-navitem">
          <LiveArtifactsIcon />
          <span>Live artifacts</span>
        </button>
        <button className="sidebar-navitem sidebar-navitem--dispatch">
          <DispatchIcon />
          <span>Dispatch</span>
          <span className="beta-badge">Beta</span>
        </button>
        <button className="sidebar-navitem">
          <CustomizeIcon />
          <span>Customize</span>
        </button>
      </nav>

      {/* ── Scrollable content ── */}
      <div className="sidebar-scroll">
        {/* Pinned */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Pinned</div>
          <div className="sidebar-pin-placeholder">
            <PinIcon />
            <span>Drag to pin</span>
          </div>
        </div>

        {/* Recents */}
        <RecentsSection
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={onSelectSession}
        />

        {/* Most Used Today */}
        <MostUsedSection
          mostUsedWorkflows={mostUsedWorkflows}
          nudgeWorkflow={nudgeWorkflow}
          onNavigate={onNavigate}
          onAutomate={onAutomate}
        />
      </div>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-user">
          <UserIcon />
          <span className="sidebar-footer-name">Anamika Goel</span>
        </div>
        <button className="sidebar-icon-btn" aria-label="Upload">
          <UploadIcon />
        </button>
      </div>
    </aside>
  )
}
