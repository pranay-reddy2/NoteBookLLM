import { motion } from 'framer-motion'
import { Sparkles, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative z-50 flex items-center justify-between px-6 py-4 border-b border-ink-800/60"
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <BookOpen size={16} className="text-amber-400" />
          </div>
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-amber-400 flex items-center justify-center">
            <Sparkles size={6} className="text-ink-950" />
          </div>
        </div>
        <div>
          <h1 className="font-display font-bold text-base text-ink-100 leading-none">
            DocMind
          </h1>
          <p className="text-[10px] text-ink-500 leading-none mt-0.5 font-mono">
            RAG • AI Document Intelligence
          </p>
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-ink-500 px-3 py-1.5 rounded-full border border-ink-800/60 bg-ink-900/40">
          <span className="w-1.5 h-1.5 rounded-full bg-jade-500 animate-pulse" />
          Powered by Gemini 1.5 Flash
        </span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost !px-2.5 !py-2"
          aria-label="GitHub"
        >
        </a>
      </div>
    </motion.header>
  )
}