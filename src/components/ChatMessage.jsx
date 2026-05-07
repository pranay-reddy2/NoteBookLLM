import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, ChevronDown, ChevronUp, User, Bot, AlertTriangle, Clock } from 'lucide-react'

export default function ChatMessage({ message, index }) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false)
  const isUser = message.role === 'user'
  const isError = message.role === 'error'
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.03, ease: 'easeOut' }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
            <User size={13} className="text-amber-400" />
          </div>
        ) : isError ? (
          <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
            <AlertTriangle size={13} className="text-rose-400" />
          </div>
        ) : (
          <div className="w-7 h-7 rounded-full bg-ink-800 border border-ink-700/50 flex items-center justify-center">
            <Bot size={13} className="text-ink-400" />
          </div>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex flex-col gap-1.5 max-w-[82%] ${isUser ? 'items-end' : 'items-start'}`}>
        {/* Message body */}
        <div
          className={`
            rounded-2xl px-4 py-3 text-sm leading-relaxed
            ${isUser
              ? 'bg-amber-500/15 border border-amber-500/20 text-ink-100 rounded-tr-sm'
              : isError
              ? 'bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-tl-sm'
              : 'bg-ink-800/60 border border-ink-700/40 text-ink-200 rounded-tl-sm'
            }
          `}
        >
          {isUser || isError ? (
            <p>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => (
                  <strong className="font-semibold text-ink-100">{children}</strong>
                ),
                code: ({ inline, children }) =>
                  inline ? (
                    <code className="font-mono text-xs bg-ink-700/60 rounded px-1 py-0.5 text-amber-300">
                      {children}
                    </code>
                  ) : (
                    <pre className="font-mono text-xs bg-ink-900/60 rounded-lg p-3 mt-2 overflow-x-auto border border-ink-700/30">
                      <code>{children}</code>
                    </pre>
                  ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>
                ),
                li: ({ children }) => <li className="text-ink-300">{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Metadata row */}
        <div className="flex items-center gap-3 px-1">
          {message.processingTime && (
            <span className="flex items-center gap-1 text-[10px] text-ink-600 font-mono">
              <Clock size={9} />
              {message.processingTime}ms
            </span>
          )}

          {/* Source toggle */}
          {isAssistant && message.sources?.length > 0 && (
            <button
              onClick={() => setSourcesExpanded((p) => !p)}
              className="flex items-center gap-1 text-[11px] text-amber-500/70 hover:text-amber-400 transition-colors font-medium"
            >
              <BookOpen size={11} />
              {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
              {sourcesExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
            </button>
          )}
        </div>

        {/* Sources panel */}
        {sourcesExpanded && message.sources?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full space-y-1.5"
          >
            {message.sources.map((source, i) => (
              <SourceCard key={source.chunk_id} source={source} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function SourceCard({ source, index }) {
  const [expanded, setExpanded] = useState(false)
  const scorePercent = Math.round(source.similarity_score * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-panel-light p-3 text-xs space-y-1.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <BookOpen size={11} className="text-amber-400 flex-shrink-0" />
          <span className="text-ink-400 truncate font-medium">{source.source}</span>
          {source.page_number && (
            <span className="text-ink-600 flex-shrink-0">p.{source.page_number}</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Relevance score bar */}
          <div className="flex items-center gap-1">
            <div className="w-12 h-1 bg-ink-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <span className="text-[10px] text-ink-500 font-mono w-7 text-right">
              {scorePercent}%
            </span>
          </div>

          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-ink-600 hover:text-ink-400 transition-colors"
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-[11px] text-ink-500 leading-relaxed bg-ink-900/40 rounded-lg p-2.5 border border-ink-800/40"
        >
          {source.content}
        </motion.div>
      )}
    </motion.div>
  )
}