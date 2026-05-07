import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trash2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react'

/* ───────────────────────────────────────────── */
/* Global CSS */
/* ───────────────────────────────────────────── */
import './index.css'

/* ───────────────────────────────────────────── */
/* Components */
/* ───────────────────────────────────────────── */

import Header from './components/Header'
import UploadZone from './components/UploadZone'
import DocumentLibrary from './components/DocumentLibrary'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import TypingIndicator from './components/TypingIndicator'
import EmptyState from './components/EmptyState'

/* ───────────────────────────────────────────── */
/* Hooks */
/* ───────────────────────────────────────────── */

import { useChat } from './hooks/useChat'
import { useDocuments } from './hooks/useDocuments'

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const chatEndRef = useRef(null)

  const [pendingQuery, setPendingQuery] = useState(null)

  const {
    documents,
    isUploading,
    uploadProgress,
    uploadError,
    isLoadingDocs,
    upload,
    remove,
  } = useDocuments()

  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
  } = useChat()

  /* ───────────────────────────────────────────── */
  /* Auto Scroll */
  /* ───────────────────────────────────────────── */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, isLoading])

  /* ───────────────────────────────────────────── */
  /* Suggested Prompts */
  /* ───────────────────────────────────────────── */

  const handleSuggest = useCallback((q) => {
    setPendingQuery(q)
  }, [])

  useEffect(() => {
    if (pendingQuery) {
      sendMessage(pendingQuery)
      setPendingQuery(null)
    }
  }, [pendingQuery, sendMessage])

  const hasDocuments = documents.length > 0

  return (
    <div className="relative flex flex-col h-screen overflow-hidden bg-[#050816] text-white">
      {/* ───────────────────────────────────────── */}
      {/* Animated Background */}
      {/* ───────────────────────────────────────── */}

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(120,119,198,0.12),transparent_35%)]" />

        {/* Blob 1 */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 20, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl"
        />

        {/* Blob 2 */}
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -20, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl"
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* ───────────────────────────────────────── */}
      {/* Header */}
      {/* ───────────────────────────────────────── */}

      <div className="relative z-20">
        <Header />
      </div>

      {/* ───────────────────────────────────────── */}
      {/* Main Layout */}
      {/* ───────────────────────────────────────── */}

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* ───────────────── Sidebar ───────────── */}

        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{
                width: 0,
                opacity: 0,
              }}
              animate={{
                width: 320,
                opacity: 1,
              }}
              exit={{
                width: 0,
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: 'easeInOut',
              }}
              className="flex-shrink-0 overflow-hidden border-r border-white/10 bg-white/5 backdrop-blur-2xl"
            >
              <div className="w-[320px] h-full flex flex-col p-5 gap-5 overflow-y-auto">
                {/* Upload */}

                <div className="glass-panel p-4 fade-in">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.25em] mb-4">
                    Upload Document
                  </p>

                  <UploadZone
                    onUpload={upload}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    uploadError={uploadError}
                  />
                </div>

                {/* Library */}

                <div className="glass-panel p-4 flex-1 fade-in">
                  <DocumentLibrary
                    documents={documents}
                    onDelete={remove}
                    isLoading={isLoadingDocs}
                  />
                </div>

                {/* Info */}

                <div className="glass-panel-light p-4 space-y-3 fade-in">
                  <p className="text-xs font-semibold text-zinc-300">
                    How DocMind Works
                  </p>

                  {[
                    '📄 Extract text from documents',
                    '✂️ Split into semantic chunks',
                    '🧠 Generate vector embeddings',
                    '🔍 Retrieve relevant context',
                    '✨ Generate grounded answers',
                  ].map((step, i) => (
                    <div
                      key={i}
                      className="text-xs text-zinc-400 leading-relaxed"
                    >
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ───────────────── Main Chat ─────────── */}

        <main className="relative flex flex-1 flex-col overflow-hidden">
          {/* Toolbar */}

          <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/20 backdrop-blur-xl">
            {/* Sidebar Toggle */}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSidebarOpen((p) => !p)}
              className="flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
            >
              {sidebarOpen ? (
                <PanelLeftClose size={18} />
              ) : (
                <PanelLeftOpen size={18} />
              )}
            </motion.button>

            {/* Clear Chat */}

            {messages.length > 0 ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={clearChat}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-sm transition-all"
              >
                <Trash2 size={14} />
                Clear Chat
              </motion.button>
            ) : (
              <div />
            )}
          </div>

          {/* ───────────────── Messages ────────── */}

          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyState
                hasDocuments={hasDocuments}
                onSuggest={handleSuggest}
              />
            ) : (
              <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
                {messages.map((msg, i) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    index={i}
                  />
                ))}

                <AnimatePresence>
                  {isLoading && <TypingIndicator />}
                </AnimatePresence>

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* ───────────────── Input ───────────── */}

          <div className="border-t border-white/10 bg-black/30 backdrop-blur-2xl px-5 py-5">
            <div className="max-w-4xl mx-auto">
              <ChatInput
                onSend={sendMessage}
                isLoading={isLoading}
                disabled={!hasDocuments}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}