/**
 * api.js — Centralised Axios client for the DocMind backend.
 *
 * All API calls go through this module so we have a single place to:
 *  - Set the base URL from env variables
 *  - Handle auth headers (if added later)
 *  - Apply global error interceptors
 */

import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 120_000, // 2 min — embedding + LLM can be slow on cold starts
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor — normalise error messages
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  },
)

// ── API Methods ──────────────────────────────────────────────────────────────

/**
 * Upload a document (PDF or TXT).
 * @param {File} file
 * @param {(progress: number) => void} onProgress
 */
export const uploadDocument = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

/**
 * Ask a question against uploaded documents.
 * @param {string} query
 * @param {string[]|null} documentIds
 * @param {number} topK
 */
export const askQuestion = (query, documentIds = null, topK = 4) =>
  api.post('/ask', { query, document_ids: documentIds, top_k: topK })

/**
 * Fetch all documents in the vector store.
 */
export const fetchDocuments = () => api.get('/documents')

/**
 * Delete a document from the vector store.
 * @param {string} documentId
 */
export const deleteDocument = (documentId) => api.delete(`/documents/${documentId}`)

/**
 * Health check. Short timeout: it either answers in milliseconds or the
 * server is still cold-starting and we should just try again.
 */
export const healthCheck = () => api.get('/health', { timeout: 6_000 })

/**
 * Poll /health until the backend answers, so a Render cold start (which can
 * take a minute) shows as "warming up" instead of a silent hang.
 *
 * @param {{ onAttempt?: (n: number) => void, maxWaitMs?: number, signal?: AbortSignal }} opts
 * @returns {Promise<boolean>} true once healthy, false if we gave up
 */
export const waitForServer = async ({ onAttempt, maxWaitMs = 180_000, signal } = {}) => {
  const startedAt = Date.now()
  let attempt = 0
  while (Date.now() - startedAt < maxWaitMs) {
    if (signal?.aborted) return false
    attempt += 1
    onAttempt?.(attempt)
    try {
      const res = await healthCheck()
      if (res.data?.ok) return true
    } catch {
      // still asleep / booting — fall through and retry
    }
    await new Promise((r) => setTimeout(r, Math.min(1_000 + attempt * 500, 4_000)))
  }
  return false
}

export default api