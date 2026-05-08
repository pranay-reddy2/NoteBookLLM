import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
    >
      <div className="msg-avatar assistant">
        <Bot size={12} color="var(--ink-500)" strokeWidth={2} />
      </div>
      <div className="typing-bubble">
        <span className="typing-dot" />
        <span className="typing-dot" />
        <span className="typing-dot" />
      </div>
    </motion.div>
  )
}