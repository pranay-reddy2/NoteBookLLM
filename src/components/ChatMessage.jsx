import { useState } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BookOpen, ChevronDown, ChevronUp, User, Bot, AlertTriangle } from 'lucide-react'

export default function ChatMessage({ message, index }) {
  const [sourcesExpanded, setSourcesExpanded] = useState(false)
  const isUser      = message.role === 'user'
  const isError     = message.role === 'error'
  const isAssistant = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.025, ease: 'easeOut' }}
      className={`msg-${isUser ? 'user' : isError ? 'error' : 'assistant'}`}
      style={{
        display: 'flex',
        gap: 10,
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
      }}
    >
      {/* Avatar */}
      <div className={`msg-avatar ${isUser ? 'user' : isError ? 'error' : 'assistant'}`}>
        {isUser    && <User          size={12} color="var(--paper-200)" strokeWidth={2} />}
        {isError   && <AlertTriangle size={12} color="var(--crimson)"   strokeWidth={2} />}
        {isAssistant && <Bot         size={12} color="var(--ink-500)"   strokeWidth={2} />}
      </div>

      {/* Content column */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        maxWidth: '78%',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        {/* Bubble */}
        <div className="bubble">
          {isUser || isError ? (
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65 }}>{message.content}</p>
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p:      ({ children }) => <p>{children}</p>,
                strong: ({ children }) => <strong>{children}</strong>,
                code:   ({ inline, children }) =>
                  inline
                    ? <code>{children}</code>
                    : <pre><code>{children}</code></pre>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 2 }}>
          {message.processingTime && (
            <span className="processing-time">
              {message.processingTime}ms
            </span>
          )}

          {isAssistant && message.sources?.length > 0 && (
            <button
              onClick={() => setSourcesExpanded((p) => !p)}
              className="sources-toggle"
            >
              <BookOpen size={10} strokeWidth={2} />
              {message.sources.length} source{message.sources.length !== 1 ? 's' : ''}
              {sourcesExpanded ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
            </button>
          )}
        </div>

        {/* Sources */}
        {sourcesExpanded && message.sources?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}
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
  const score = Math.round(source.similarity_score * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="source-card"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <BookOpen size={10} color="var(--accent)" strokeWidth={2} />
          <span className="source-filename" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {source.source}
          </span>
          {source.page_number && (
            <span style={{ fontSize: 10, color: 'var(--ink-400)', flexShrink: 0 }}>
              p.{source.page_number}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div className="source-score-bar">
              <div className="source-score-fill" style={{ width: `${score}%` }} />
            </div>
            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, color: 'var(--ink-400)', width: 28, textAlign: 'right' }}>
              {score}%
            </span>
          </div>
          <button
            onClick={() => setExpanded((p) => !p)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-400)', padding: '2px 3px', display: 'flex' }}
          >
            {expanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="source-content"
        >
          {source.content}
        </motion.div>
      )}
    </motion.div>
  )
}