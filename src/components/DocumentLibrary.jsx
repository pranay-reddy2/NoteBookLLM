import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, File, Trash2, Loader2, ChevronDown } from 'lucide-react'

export default function DocumentLibrary({ documents, onDelete, isLoading }) {
  const [expanded, setExpanded] = useState(true)

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0', fontSize: 12, color: 'var(--ink-400)' }}>
        <Loader2 size={12} className="spin" />
        Loading documents…
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((p) => !p)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 2px 10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span className="section-label" style={{ margin: 0 }}>My Documents</span>
          <span style={{
            fontFamily: 'JetBrains Mono', fontSize: 9.5, fontWeight: 600,
            color: 'var(--ink-500)', background: 'var(--paper-200)',
            border: '1px solid var(--paper-300)',
            borderRadius: 999, padding: '1px 6px',
          }}>
            {documents.length}
          </span>
        </div>
        <ChevronDown
          size={13}
          color="var(--ink-400)"
          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s' }}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{ overflow: 'hidden' }}
          >
            {documents.length === 0 ? (
              <div style={{ padding: '20px 8px', textAlign: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '0 0 4px' }}>No documents yet.</p>
                <p style={{ fontSize: 11, color: 'var(--ink-400)', margin: 0 }}>Upload a PDF or TXT to begin.</p>
              </div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {documents.map((doc) => (
                  <DocumentItem key={doc.document_id} doc={doc} onDelete={onDelete} />
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DocumentItem({ doc, onDelete }) {
  const [deleting, setDeleting] = useState(false)
  const isPdf = doc.filename.toLowerCase().endsWith('.pdf')

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (!confirm(`Remove "${doc.filename}"?`)) return
    setDeleting(true)
    try { await onDelete(doc.document_id) }
    finally { setDeleting(false) }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      className="doc-item"
    >
      <div className={`doc-icon ${isPdf ? 'pdf' : 'txt'}`}>
        {isPdf
          ? <File     size={12} color="var(--crimson)"      strokeWidth={1.8} />
          : <FileText size={12} color="var(--accent-light)" strokeWidth={1.8} />
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="doc-name">{doc.filename}</p>
        <p className="doc-meta">{doc.chunk_count} chunk{doc.chunk_count !== 1 ? 's' : ''}</p>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="doc-delete"
        aria-label="Delete document"
      >
        {deleting
          ? <Loader2 size={12} className="spin" />
          : <Trash2  size={12} />
        }
      </button>
    </motion.li>
  )
}