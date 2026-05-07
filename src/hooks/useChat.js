/**
 * useChat.js — Custom hook managing the full chat + RAG lifecycle.
 *
 * Responsibilities:
 *  - Maintain chat message history
 *  - Call /ask endpoint
 *  - Track loading / error states
 *  - Provide retrieved source chunks alongside answers
 */

import { useState, useCallback } from 'react'
import { askQuestion } from '../utils/api'

export const useChat = (selectedDocumentIds = null) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const sendMessage = useCallback(
    async (query) => {
      if (!query.trim() || isLoading) return

      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: query,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const response = await askQuestion(query, selectedDocumentIds)
        const { answer, sources, processing_time_ms } = response.data

        const assistantMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: answer,
          sources: sources || [],
          processingTime: processing_time_ms,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err.message)
        const errorMessage = {
          id: Date.now() + 1,
          role: 'error',
          content: err.message || 'Something went wrong. Please try again.',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    },
    [isLoading, selectedDocumentIds],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, error, sendMessage, clearChat }
}