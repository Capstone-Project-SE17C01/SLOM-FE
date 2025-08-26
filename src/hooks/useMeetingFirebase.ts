import { useCallback, useEffect, useRef } from 'react'
import { meetingService } from '@/services/firebase/meetingService'
import type { ContentEntry } from '@/types/IFirebaseMeeting'

interface UseMeetingFirebaseOptions {
  meetingCode: string
  userId: string
  enabled?: boolean
}

interface UseMeetingFirebaseReturn {
  sendSpeechContent: (content: string) => Promise<void>
  sendSignContent: (content: string) => Promise<void>
  isConnected: boolean
  error: string | null
}

function mappingContent(content: string) {
  try {
    const contentTrim = content.trim()
    const dictionary = {
      J: 'Run'
    }
    if (dictionary[contentTrim as keyof typeof dictionary]) {
      return dictionary[contentTrim as keyof typeof dictionary]
    }
    return contentTrim
  } catch (error) {
    console.error('❌ Error mapping content:', error)
    return content.trim()
  }
}

/**
 * Hook to automatically sync meeting transcripts to Firebase
 * Handles both speech-to-text and sign language content
 */
export const useMeetingFirebase = ({
  meetingCode,
  userId,
  enabled = true
}: UseMeetingFirebaseOptions): UseMeetingFirebaseReturn => {
  const isConnectedRef = useRef(false)
  const errorRef = useRef<string | null>(null)

  // Initialize meeting if needed
  useEffect(() => {
    if (!enabled || !meetingCode || !userId) return

    const initializeMeeting = async () => {
      try {
        const exists = await meetingService.meetingExists(meetingCode)
        if (!exists) {
          console.log('🏗️ Creating new meeting:', meetingCode)
          await meetingService.createMeeting(meetingCode)
        }
        isConnectedRef.current = true
        errorRef.current = null
      } catch (error) {
        console.error('❌ Failed to initialize meeting:', error)
        isConnectedRef.current = false
        errorRef.current = error instanceof Error ? error.message : 'Failed to initialize meeting'
      }
    }

    initializeMeeting()
  }, [meetingCode, userId, enabled])

  // Send speech content to Firebase
  const sendSpeechContent = useCallback(
    async (content: string) => {
      if (!enabled || !content.trim() || !meetingCode || !userId) return

      try {
        console.log('🗣️ Sending speech content to Firebase:', content)

        const entry: ContentEntry = {
          meetingCode,
          userId,
          content: content.trim(),
          timestamp: Date.now()
        }

        const result = await meetingService.addContent(entry)

        if (result.success) {
          console.log('✅ Speech content sent successfully')
          isConnectedRef.current = true
          errorRef.current = null
        } else {
          throw new Error(result.error || 'Failed to send speech content')
        }
      } catch (error) {
        console.error('❌ Error sending speech content:', error)
        isConnectedRef.current = false
        errorRef.current = error instanceof Error ? error.message : 'Unknown error'
      }
    },
    [meetingCode, userId, enabled]
  )

  // Send sign language content to Firebase
  const sendSignContent = useCallback(
    async (content: string) => {
      if (!enabled || !content.trim() || !meetingCode || !userId) return

      try {
        const mappedContent = mappingContent(content)
        console.log('👋 Sending sign language content to Firebase:', content)

        const entry: ContentEntry = {
          meetingCode,
          userId,
          content: mappedContent.trim(), // 🔥 NO PREFIX - clean natural subtitle
          timestamp: Date.now()
        }

        const result = await meetingService.addContent(entry)

        if (result.success) {
          console.log('✅ Sign language content sent successfully')
          isConnectedRef.current = true
          errorRef.current = null
        } else {
          throw new Error(result.error || 'Failed to send sign content')
        }
      } catch (error) {
        console.error('❌ Error sending sign language content:', error)
        isConnectedRef.current = false
        errorRef.current = error instanceof Error ? error.message : 'Unknown error'
      }
    },
    [meetingCode, userId, enabled]
  )

  return {
    sendSpeechContent,
    sendSignContent,
    isConnected: isConnectedRef.current,
    error: errorRef.current
  }
}
