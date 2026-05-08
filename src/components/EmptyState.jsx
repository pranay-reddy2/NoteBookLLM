import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="empty-state"
      >
        <div className="orb">
          <span className="orb-icon">📄</span>
        </div>
        <h3 className="empty-title">No documents yet</h3>
        <p className="empty-sub">
          Upload a PDF or text file using the panel on the left to start asking questions about it.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="empty-state"
    >
      <div className="orb">
        <span className="orb-icon">🧠</span>
      </div>
      <h3 className="empty-title">Ready to explore</h3>
      <p className="empty-sub">
        Your documents are indexed. Try one of these questions to get started:
      </p>

      <div className="suggest-grid">
        {SUGGESTED_QUESTIONS.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.07 }}
            onClick={() => onSuggest(q)}
            className="suggest-pill"
          >
            <div className="suggest-pill-icon">
              <Sparkles size={10} color="var(--accent)" strokeWidth={2} />
            </div>
            <span className="suggest-pill-text">{q}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}