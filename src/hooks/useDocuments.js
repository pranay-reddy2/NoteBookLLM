/**
 * useDocuments.js — Hook managing document uploads and library state.
 */

import { useState, useCallback, useEffect } from 'react'
import { uploadDocument, fetchDocuments, deleteDocument } from '../utils/api'

export const useDocuments = () => {
  const [documents, setDocuments] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState(null)
  const [isLoadingDocs, setIsLoadingDocs] = useState(false)

  // Load existing documents on mount
  const loadDocuments = useCallback(async () => {
    setIsLoadingDocs(true)
    try {
      const res = await fetchDocuments()
      setDocuments(res.data || [])
    } catch {
      // Silently fail – docs list is not critical
    } finally {
      setIsLoadingDocs(false)
    }
  }, [])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  const upload = useCallback(async (file) => {
    setIsUploading(true)
    setUploadProgress(0)
    setUploadError(null)

    try {
      const res = await uploadDocument(file, setUploadProgress)
      const newDoc = {
        document_id: res.data.document_id,
        filename: res.data.filename,
        chunk_count: res.data.chunks_created,
      }
      setDocuments((prev) => [newDoc, ...prev])
      setUploadProgress(100)
      return res.data
    } catch (err) {
      setUploadError(err.message)
      throw err
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 2000)
    }
  }, [])

  const remove = useCallback(async (documentId) => {
    try {
      await deleteDocument(documentId)
      setDocuments((prev) => prev.filter((d) => d.document_id !== documentId))
    } catch (err) {
      console.error('Failed to delete document:', err)
    }
  }, [])

  return {
    documents,
    isUploading,
    uploadProgress,
    uploadError,
    isLoadingDocs,
    upload,
    remove,
    reload: loadDocuments,
  }
}