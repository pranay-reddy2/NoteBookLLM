import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-full bg-ink-800 border border-ink-700/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot size={13} className="text-ink-400" />
      </div>

      <div className="bg-ink-800/60 border border-ink-700/40 rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      </div>
    </motion.div>
  )
}