import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudUpload,
  FileText,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react'

export default function UploadZone({ onUpload, isUploading, uploadProgress, uploadError }) {
  const [pendingFile, setPendingFile] = useState(null)
  const [uploadSuccess, setUploadSuccess] = useState(null)

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0]
      if (!file) return

      setPendingFile(file)
      setUploadSuccess(null)

      try {
        const result = await onUpload(file)
        setUploadSuccess(result)
        setTimeout(() => {
          setPendingFile(null)
          setUploadSuccess(null)
        }, 3000)
      } catch {
        // error is surfaced via uploadError prop
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: isUploading,
  })

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          relative rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300
          ${isDragActive
            ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
            : 'border-ink-700/60 hover:border-ink-600 hover:bg-ink-800/30 bg-ink-900/20'
          }
          ${isUploading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center justify-center gap-3 py-8 px-6 text-center">
          <motion.div
            animate={isDragActive ? { scale: 1.15, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              ${isDragActive ? 'bg-amber-500/20' : 'bg-ink-800/60'}
            `}
          >
            <CloudUpload
              size={22}
              className={isDragActive ? 'text-amber-400' : 'text-ink-500'}
            />
          </motion.div>

          <div>
            <p className="text-sm font-medium text-ink-300">
              {isDragActive ? 'Drop to upload' : 'Drag & drop a document'}
            </p>
            <p className="text-xs text-ink-600 mt-1">
              PDF or TXT • Max 50 MB
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-px w-12 bg-ink-800" />
            <span className="text-xs text-ink-600">or</span>
            <div className="h-px w-12 bg-ink-800" />
          </div>

          <button
            type="button"
            className="btn-primary text-xs !px-4 !py-2"
            disabled={isUploading}
          >
            Browse Files
          </button>
        </div>
      </div>

      {/* Upload Status */}
      <AnimatePresence mode="wait">
        {pendingFile && (
          <motion.div
            key="status"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass-panel-light p-3 space-y-2"
          >
            {/* File info */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ink-700/60 flex items-center justify-center flex-shrink-0">
                {pendingFile.name.endsWith('.pdf') ? (
                  <File size={14} className="text-rose-400" />
                ) : (
                  <FileText size={14} className="text-amber-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink-200 truncate">
                  {pendingFile.name}
                </p>
                <p className="text-[10px] text-ink-500">
                  {formatSize(pendingFile.size)}
                </p>
              </div>

              {uploadSuccess && (
                <CheckCircle2 size={16} className="text-jade-400 flex-shrink-0" />
              )}
              {uploadError && (
                <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
              )}
              {isUploading && (
                <Loader2 size={16} className="text-amber-400 animate-spin flex-shrink-0" />
              )}
            </div>

            {/* Progress bar */}
            {isUploading && (
              <div>
                <div className="flex justify-between text-[10px] text-ink-500 mb-1">
                  <span>
                    {uploadProgress < 100 ? 'Uploading…' : 'Processing chunks…'}
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-1 bg-ink-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-amber-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}

            {/* Success */}
            {uploadSuccess && (
              <p className="text-[11px] text-jade-400">
                ✓ Indexed {uploadSuccess.chunks_created} chunks — ready to chat!
              </p>
            )}

            {/* Error */}
            {uploadError && (
              <p className="text-[11px] text-rose-400">✗ {uploadError}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}