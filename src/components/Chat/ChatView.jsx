import { useEffect, useRef } from 'react'
import ChatInput from './ChatInput'
import AlertBar from './AlertBar'
import './Chat.css'

// Claude asterisk (mini, for chat messages)
const ClaudeAsteriskMini = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
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
  </svg>
)

function UserMessage({ message }) {
  return (
    <div className="message-row message-row--user">
      <div className="message-bubble message-bubble--user">
        {message.text}
      </div>
    </div>
  )
}

function ClaudeMessage({ message }) {
  return (
    <div className="message-row message-row--claude">
      <div className="message-avatar">
        <ClaudeAsteriskMini />
      </div>
      <div className="message-bubble message-bubble--claude">
        {message.text}
      </div>
    </div>
  )
}

export default function ChatView({
  session,
  onSendMessage,
  onDismissAlert,
  onAutomate,
}) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [session.messages])

  // The workflow attached to the alert (set only when State A)
  const alertWorkflow = session.alertWorkflow || null

  const showAlert = session.alertShown && !session.alertDismissed

  return (
    <div className="chat-view">
      {/* Message list */}
      <div className="chat-messages">
        {session.messages.map(msg => (
          msg.role === 'user'
            ? <UserMessage key={msg.id} message={msg} />
            : <ClaudeMessage key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Bottom area: alert + input */}
      <div className="chat-bottom">
        {showAlert && (
          <AlertBar
            alertState={session.alertState}
            workflow={alertWorkflow}
            onDismiss={onDismissAlert}
            onAutomate={() => alertWorkflow && onAutomate(alertWorkflow)}
          />
        )}
        <ChatInput
          onSend={onSendMessage}
          placeholder="Write a message..."
        />
      </div>
    </div>
  )
}
