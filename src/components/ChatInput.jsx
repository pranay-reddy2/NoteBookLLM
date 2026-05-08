import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, Loader2 } from 'lucide-react'

export default function ChatInput({ onSend, isLoading, disabled }) {
  const [query, setQuery] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault()
      if (!query.trim() || isLoading || disabled) return
      onSend(query.trim())
      setQuery('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    },
    [query, isLoading, disabled, onSend],
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleChange = (e) => {
    setQuery(e.target.value)
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`
  }

  const canSend = query.trim() && !isLoading && !disabled

  return (
    <div>
      <div className={`chat-input-wrap${disabled ? ' disabled' : ''}`}>
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Upload a document to start chatting…'
              : 'Ask anything about your documents…'
          }
          disabled={disabled || isLoading}
          rows={1}
          className="chat-textarea"
          style={{ height: 'auto' }}
        />

        <motion.button
          onClick={handleSubmit}
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.9 } : {}}
          className="send-btn"
        >
          {isLoading
            ? <Loader2 size={14} className="spin" />
            : <ArrowUp size={14} strokeWidth={2.2} />
          }
        </motion.button>
      </div>

      <p className="input-hint">Enter ↵ to send &nbsp;·&nbsp; Shift+Enter for newline</p>
    </div>
  )
}