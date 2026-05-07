import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const SUGGESTED_QUESTIONS = [
  'What is the main topic of this document?',
  'Summarize the key findings.',
  'What conclusions does the author draw?',
  'List the main points discussed.',
]

export default function EmptyState({ hasDocuments, onSuggest }) {
  if (!hasDocuments) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full text-center px-8 py-16"
      >
        {/* Decorative orb */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-amber-400/5 blur-xl" />
        </div>

        <h3 className="font-display font-bold text-lg text-ink-300 mb-2">
          No documents yet
        </h3>
        <p className="text-sm text-ink-600 max-w-xs leading-relaxed">
          Upload a PDF or text file in the panel on the left to start asking questions about it.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-full text-center px-8 py-12"
    >
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <span className="text-3xl">🧠</span>
        </div>
        <div className="absolute inset-0 rounded-2xl bg-amber-400/5 blur-xl" />
      </div>

      <h3 className="font-display font-bold text-lg text-ink-200 mb-1">
        Ready to chat!
      </h3>
      <p className="text-sm text-ink-600 mb-6 max-w-xs">
        Your documents are indexed. Try one of these questions:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.07 }}
            onClick={() => onSuggest(q)}
            className="flex items-start gap-2 p-3 rounded-xl bg-ink-800/40 border border-ink-700/30 hover:border-amber-500/30 hover:bg-ink-800/60 transition-all text-left group"
          >
            <Lightbulb size={12} className="text-amber-500/50 group-hover:text-amber-400 mt-0.5 flex-shrink-0 transition-colors" />
            <span className="text-xs text-ink-500 group-hover:text-ink-300 transition-colors leading-relaxed">
              {q}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}