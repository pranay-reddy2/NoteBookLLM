import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, File,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react'

export default function UploadZone({ onUpload, isUploading, uploadProgress, uploadError }) {
  const [pendingFile, setPendingFile] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (!file) return
    setPendingFile(file)
    setUploadSuccess(null)
    try {
      const result = await onUpload(file)
      setUploadSuccess(result)
      setTimeout(() => { setPendingFile(null); setUploadSuccess(null) }, 3500)
    } catch { /* surfaced via uploadError prop */ }
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    disabled: isUploading,
  })

  const fmt = (bytes) => {
    if (bytes < 1024)            return `${bytes} B`
    if (bytes < 1024 * 1024)     return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* Drop target */}
      <div
        {...getRootProps()}
        className={`upload-zone${isDragActive ? ' drag-active' : ''}${isUploading ? ' disabled' : ''}`}
        style={{ pointerEvents: isUploading ? 'none' : 'auto', opacity: isUploading ? 0.7 : 1 }}
      >
        <input {...getInputProps()} />

        <motion.div
          animate={isDragActive ? { scale: 1.12 } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 280 }}
          className="upload-icon-ring"
        >
          <Upload
            size={18}
            color={isDragActive ? 'var(--accent)' : 'var(--ink-400)'}
            strokeWidth={1.8}
          />
        </motion.div>

        <p className="upload-title">
          {isDragActive ? 'Drop to upload' : 'Drag & drop a file'}
        </p>
        <p className="upload-sub" style={{ marginBottom: 14 }}>PDF or TXT · up to 50 MB</p>

        <div className="divider-or" style={{ marginBottom: 14 }}>or</div>

        <button
          type="button"
          className="btn-primary"
          style={{ fontSize: 12 }}
          disabled={isUploading}
        >
          Browse Files
        </button>
      </div>

      {/* Status card */}
      <AnimatePresence mode="wait">
        {pendingFile && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`upload-status${uploadSuccess ? ' success' : uploadError ? ' error' : ''}`}
          >
            {/* File row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className={`doc-icon ${pendingFile.name.endsWith('.pdf') ? 'pdf' : 'txt'}`}>
                {pendingFile.name.endsWith('.pdf')
                  ? <File     size={13} color="var(--crimson)"       strokeWidth={1.8} />
                  : <FileText size={13} color="var(--accent-light)"  strokeWidth={1.8} />
                }
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--ink-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', margin: 0 }}>
                  {pendingFile.name}
                </p>
                <p style={{ fontSize: 10, color: 'var(--ink-400)', margin: 0, fontFamily: 'JetBrains Mono' }}>
                  {fmt(pendingFile.size)}
                </p>
              </div>
              {uploadSuccess && <CheckCircle2 size={15} color="var(--verdant)"  />}
              {uploadError   && <AlertCircle  size={15} color="var(--crimson)"  />}
              {isUploading   && <Loader2      size={15} color="var(--accent)"   className="spin" />}
            </div>

            {/* Progress */}
            {isUploading && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: 'var(--ink-500)', fontFamily: 'JetBrains Mono' }}>
                    {uploadProgress < 100 ? 'Uploading…' : 'Processing chunks…'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--ink-500)', fontFamily: 'JetBrains Mono' }}>
                    {uploadProgress}%
                  </span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {uploadSuccess && (
              <p style={{ fontSize: 11, color: 'var(--verdant)', margin: 0 }}>
                ✓ Indexed {uploadSuccess.chunks_created} chunks — ready to chat
              </p>
            )}

            {uploadError && (
              <p style={{ fontSize: 11, color: 'var(--crimson)', margin: 0 }}>
                ✗ {uploadError}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}