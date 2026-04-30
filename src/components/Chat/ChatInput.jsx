import { useState, useRef } from 'react'
import './Chat.css'

const PlusCircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="8" stroke="#5E6C84" strokeWidth="1.4"/>
    <line x1="9" y1="5.5" x2="9" y2="12.5" stroke="#5E6C84" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="5.5" y1="9" x2="12.5" y2="9" stroke="#5E6C84" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="5.5" y="1" width="5" height="8" rx="2.5" stroke="#5E6C84" strokeWidth="1.4"/>
    <path d="M3 7.5A5 5 0 0013 7.5" stroke="#5E6C84" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="8" y1="12.5" x2="8" y2="15" stroke="#5E6C84" strokeWidth="1.4" strokeLinecap="round"/>
    <line x1="5.5" y1="15" x2="10.5" y2="15" stroke="#5E6C84" strokeWidth="1.4" strokeLinecap="round"/>
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

export default function ChatInput({ onSend, isHome = false, placeholder }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px'
  }

  return (
    <div className={`chat-input-wrap ${isHome ? 'chat-input-wrap--home' : ''}`}>
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          className="chat-input-textarea"
          placeholder={placeholder || 'How can I help you today?'}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          id={isHome ? 'home-chat-input' : 'chat-input'}
        />
        <div className="chat-input-actions">
          <button className="chat-action-btn" aria-label="Attach" id="attach-btn">
            <PlusCircleIcon />
          </button>
          <button
            className="chat-mic-btn"
            aria-label="Voice input"
            id="mic-btn"
          >
            <MicIcon />
          </button>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="chat-toolbar">
        <div className="chat-toolbar-left">
          <button className="toolbar-btn" id="work-in-project-btn">
            <FolderIcon />
            <span>Work in a project</span>
            <ChevronDown />
          </button>
          <button className="toolbar-btn" id="ask-btn">
            <span>Ask</span>
            <ChevronDown />
          </button>
        </div>
        <div className="chat-toolbar-right">
          <button className="toolbar-btn toolbar-model-btn" id="model-btn">
            <span>Sonnet 4.6</span>
            <ChevronDown />
          </button>
        </div>
      </div>
    </div>
  )
}
