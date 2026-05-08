import { motion } from 'framer-motion'
import { BookMarked } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="app-header"
    >
      {/* Logo */}
      <div className="header-logo">
        <div className="logo-mark">
          <BookMarked size={16} color="var(--paper-100)" strokeWidth={1.8} />
        </div>
        <div>
          <div className="logo-text-primary">DocMind</div>
          <div className="logo-text-secondary">RAG · AI Document Intelligence</div>
        </div>
      </div>

      {/* Right */}
      <div className="header-badge">
        <span className="dot" />
        Gemini 1.5 Flash
      </div>
    </motion.header>
  )
}