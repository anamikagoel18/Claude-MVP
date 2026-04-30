import ChatInput from '../Chat/ChatInput'
import './Home.css'

// Claude asterisk logo — matches the orange/red asterisk from reference Image 1
const ClaudeAsterisk = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      {/* 6-pointed asterisk rays */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => (
        <rect
          key={i}
          x="14.5"
          y="2"
          width="3"
          height="13"
          rx="1.5"
          fill="#CC785C"
          transform={`rotate(${deg} 16 16)`}
        />
      ))}
    </g>
  </svg>
)

export default function HomeView({ onSendMessage }) {
  return (
    <div className="home-view">
      <div className="home-center">
        <div className="home-heading-row">
          <ClaudeAsterisk />
          <h1 className="home-heading">Let&apos;s knock something off your list</h1>
        </div>
        <p className="home-subtitle">Learn how to use Cowork safely.</p>
        <ChatInput onSend={onSendMessage} isHome />
      </div>
    </div>
  )
}
