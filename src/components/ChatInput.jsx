import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Send, Loader2 } from 'lucide-react'

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
    // Auto-resize textarea
    const el = e.target
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const canSend = query.trim() && !isLoading && !disabled

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div
        className={`
          flex items-end gap-2 px-3 py-3 rounded-xl border transition-all duration-200
          ${disabled
            ? 'border-ink-800/40 bg-ink-900/20 opacity-60'
            : 'border-ink-700/50 bg-ink-800/40 hover:border-ink-600/60 focus-within:border-amber-500/40 focus-within:bg-ink-800/60'
          }
        `}
      >
        <textarea
          ref={textareaRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? 'Upload a document to start chatting…' : 'Ask anything about your documents…'}
          disabled={disabled || isLoading}
          rows={1}
          className="flex-1 bg-transparent text-sm text-ink-200 placeholder-ink-600 resize-none outline-none min-h-[24px] max-h-40 leading-6 font-body"
          style={{ height: 'auto' }}
        />

        <motion.button
          type="submit"
          disabled={!canSend}
          whileTap={canSend ? { scale: 0.9 } : {}}
          className={`
            flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200
            ${canSend
              ? 'bg-amber-500 hover:bg-amber-400 text-ink-950 shadow-lg shadow-amber-500/20'
              : 'bg-ink-700/50 text-ink-600 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Send size={14} />
          )}
        </motion.button>
      </div>

      <p className="text-[10px] text-ink-700 text-center mt-1.5">
        Press Enter to send • Shift+Enter for new line
      </p>
    </form>
  )
}