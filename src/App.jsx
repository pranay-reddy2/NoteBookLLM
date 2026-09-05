import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import './index.css'

import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DocumentLibrary from './components/DocumentLibrary'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import TypingIndicator from './components/TypingIndicator'
import EmptyState from './components/EmptyState'

import { useChat } from './hooks/useChat'
import { useDocuments } from './hooks/useDocuments'
import { waitForServer } from './utils/api'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const chatEndRef = useRef(null)
  const [pendingQuery, setPendingQuery] = useState(null)

  // 'warming' while the backend cold-starts, 'ready' once /health answers,
  // 'down' if it never does. Fired immediately on page load.
  const [serverStatus, setServerStatus] = useState('warming')
  const [warmupSeconds, setWarmupSeconds] = useState(0)

  const {
    documents, isUploading, uploadProgress,
    uploadError, isLoadingDocs, upload, remove, reload,
  } = useDocuments()

  const { messages, isLoading, sendMessage, clearChat } = useChat()

  useEffect(() => {
    const controller = new AbortController()
    const startedAt = Date.now()
    const tick = setInterval(() => setWarmupSeconds(Math.round((Date.now() - startedAt) / 1000)), 1000)

    waitForServer({ signal: controller.signal }).then((ok) => {
      clearInterval(tick)
      if (controller.signal.aborted) return
      setServerStatus(ok ? 'ready' : 'down')
      if (ok) reload() // the initial /documents call may have failed while the server was asleep
    })

    return () => {
      controller.abort()
      clearInterval(tick)
    }
  }, [reload])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const handleSuggest = useCallback((q) => setPendingQuery(q), [])

  useEffect(() => {
    if (pendingQuery) {
      sendMessage(pendingQuery)
      setPendingQuery(null)
    }
  }, [pendingQuery, sendMessage])

  const hasDocuments = documents.length > 0

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Header */}
      <Header />

      {/* Cold-start banner: free hosting sleeps when idle, so the first
          request of the day can take up to a minute. Never look like a hang. */}
      <AnimatePresence>
        {serverStatus !== 'ready' && (
          <motion.div
            key="server-banner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`server-banner ${serverStatus === 'down' ? 'server-banner--down' : ''}`}
            role="status"
          >
            {serverStatus === 'warming' ? (
              <>
                <span className="server-banner-spinner" />
                Warming up the server… free hosting sleeps when idle, this usually takes 30–60 s
                {warmupSeconds > 3 && <span className="server-banner-time">({warmupSeconds}s)</span>}
              </>
            ) : (
              <>The server isn’t responding. Refresh in a minute, or email pranayreddy672@gmail.com.</>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 312, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
              className="sidebar"
              style={{ overflow: 'hidden' }}
            >
              <div style={{ width: 312, height: '100%', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>

                {/* Upload */}
                <div className="sidebar-section fade-up">
                  <p className="section-label">Upload Document</p>
                  <UploadZone
                    onUpload={upload}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    uploadError={uploadError}
                  />
                </div>

                {/* Library */}
                <div className="sidebar-section fade-up" style={{ flex: 1 }}>
                  <DocumentLibrary
                    documents={documents}
                    onDelete={remove}
                    isLoading={isLoadingDocs}
                  />
                </div>

                {/* How it works */}
                <div className="sidebar-section fade-up">
                  <p className="section-label" style={{ marginBottom: 12 }}>How It Works</p>
                  <div className="info-box">
                    {[
                      'Extract text from documents',
                      'Split into semantic chunks',
                      'Generate vector embeddings',
                      'Retrieve relevant context',
                      'Generate grounded answers',
                    ].map((step, i) => (
                      <div key={i} className="info-step" style={{ paddingBottom: i < 4 ? 8 : 0 }}>
                        <div className="info-step-num">{i + 1}</div>
                        <span className="info-step-text">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main Chat ── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--paper-50)' }}>

          {/* Toolbar */}
          <div className="chat-toolbar">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarOpen((p) => !p)}
              className="btn-icon"
            >
              {sidebarOpen
                ? <PanelLeftClose size={16} strokeWidth={1.8} />
                : <PanelLeftOpen  size={16} strokeWidth={1.8} />
              }
            </motion.button>

            {messages.length > 0 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={clearChat}
                className="btn-danger"
              >
                <Trash2 size={13} strokeWidth={1.8} />
                Clear chat
              </motion.button>
            ) : (
              <div />
            )}
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 ? (
              <EmptyState hasDocuments={hasDocuments} onSuggest={handleSuggest} />
            ) : (
              <div className="messages-inner">
                {messages.map((msg, i) => (
                  <ChatMessage key={msg.id} message={msg} index={i} />
                ))}
                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input */}
          <div className="chat-input-bar">
            <div className="inner">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                disabled={!hasDocuments || serverStatus !== 'ready'}
              />
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}