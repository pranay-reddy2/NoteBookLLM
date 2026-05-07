import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, File, Trash2, Loader2, Library, ChevronDown } from 'lucide-react'

export default function DocumentLibrary({ documents, onDelete, isLoading }) {
  const [expanded, setExpanded] = useState(true)

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 px-2 text-xs text-ink-500">
        <Loader2 size={12} className="animate-spin" />
        Loading documents…
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setExpanded((p) => !p)}
        className="w-full flex items-center justify-between px-1 py-2 text-xs font-semibold text-ink-500 uppercase tracking-widest hover:text-ink-400 transition-colors"
      >
        <span className="flex items-center gap-1.5">
          <Library size={11} />
          My Documents
          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-ink-800 text-ink-400 font-mono">
            {documents.length}
          </span>
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform ${expanded ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {documents.length === 0 ? (
              <div className="py-6 text-center">
                <p className="text-xs text-ink-600">No documents yet.</p>
                <p className="text-[11px] text-ink-700 mt-1">Upload a PDF or TXT to begin.</p>
              </div>
            ) : (
              <ul className="space-y-1 mt-1">
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
    if (!confirm(`Remove "${doc.filename}" from the library?`)) return
    setDeleting(true)
    try {
      await onDelete(doc.document_id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -12 }}
      className="group flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-ink-800/50 transition-colors cursor-default"
    >
      <div
        className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
          isPdf ? 'bg-rose-500/10' : 'bg-amber-500/10'
        }`}
      >
        {isPdf ? (
          <File size={13} className="text-rose-400" />
        ) : (
          <FileText size={13} className="text-amber-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-ink-300 truncate">{doc.filename}</p>
        <p className="text-[10px] text-ink-600 font-mono">
          {doc.chunk_count} chunk{doc.chunk_count !== 1 ? 's' : ''}
        </p>
      </div>

      <button
        onClick={handleDelete}
        disabled={deleting}
        className="opacity-0 group-hover:opacity-100 text-ink-600 hover:text-rose-400 transition-all p-1 rounded"
        aria-label="Delete document"
      >
        {deleting ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Trash2 size={12} />
        )}
      </button>
    </motion.li>
  )
}