import { useState, useEffect, useCallback } from 'react'
import { meetingService } from '@/services/firebase/meetingService'
import { getCurrentBucketKey, formatBucketTime } from '@/utils/bucketTimeUtils'
import type { FirebaseDatabase, ContentEntry } from '@/types/IFirebaseMeeting'

interface FirebaseTestState {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  allData: FirebaseDatabase | null
  lastUpdate: number
  // New form states
  userId: string
  content: string
  meetingCode: string
}

export const useFirebaseTest = () => {
  const [state, setState] = useState<FirebaseTestState>({
    isConnected: false,
    isLoading: false,
    error: null,
    allData: null,
    lastUpdate: 0,
    // Initialize form states
    userId: '',
    content: '',
    meetingCode: ''
  })

  // Test connection to Firebase
  const testConnection = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('🚀 Testing Firebase connection...')

      // Test by getting all meetings
      const allMeetings = await meetingService.getAllMeetings()
      const isConnected = allMeetings !== null

      setState((prev) => ({
        ...prev,
        isConnected,
        isLoading: false,
        lastUpdate: Date.now()
      }))

      if (isConnected) {
        console.log('🎉 Firebase connection successful!')
      }
    } catch (error) {
      console.error('💥 Firebase connection test failed:', error)
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        lastUpdate: Date.now()
      }))
    }
  }, [])

  // Read all database
  const readAllDatabase = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }))

    try {
      console.log('📖 Reading all database data...')

      const allData = await meetingService.subscribeToDatabase((data) => {
        setState((prev) => ({
          ...prev,
          allData: data,
          lastUpdate: Date.now()
        }))
      })

      setState((prev) => ({
        ...prev,
        isLoading: false,
        lastUpdate: Date.now()
      }))
    } catch (error) {
      console.error('💥 Failed to read database:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to read database',
        lastUpdate: Date.now()
      }))
    }
  }, [])

  // Add content to meeting
  const addContent = useCallback(async () => {
    if (!state.userId.trim() || !state.content.trim() || !state.meetingCode.trim()) {
      setState((prev) => ({
        ...prev,
        error: 'Please fill in all fields: Meeting Code, User ID, and Content'
      }))
      return
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      console.log('✍️ Adding content to meeting...', {
        meetingCode: state.meetingCode,
        userId: state.userId,
        content: state.content
      })

      const entry: ContentEntry = {
        meetingCode: state.meetingCode,
        userId: state.userId,
        content: state.content,
        timestamp: Date.now()
      }

      const result = await meetingService.addContent(entry)

      if (result.success) {
        console.log('✅ Content added successfully!')
        console.log('📊 Bucket info:', {
          bucketKey: result.bucketKey,
          bucketTime: formatBucketTime(result.bucketKey),
          previousContent: result.previousContent,
          newContent: result.newContent
        })

        // Clear content after successful addition
        setState((prev) => ({
          ...prev,
          content: '',
          isLoading: false,
          lastUpdate: Date.now()
        }))
      } else {
        throw new Error(result.error || 'Failed to add content')
      }
    } catch (error) {
      console.error('💥 Failed to add content:', error)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to add content',
        lastUpdate: Date.now()
      }))
    }
  }, [state.userId, state.content, state.meetingCode])

  // Start real-time listener
  const startRealTimeListener = useCallback(() => {
    console.log('🎧 Starting real-time listener...')

    const unsubscribe = meetingService.subscribeToDatabase((data) => {
      console.log('🔄 Real-time update received!')
      console.log('📊 Updated data:', data)

      setState((prev) => ({
        ...prev,
        allData: data,
        lastUpdate: Date.now()
      }))
    })

    return unsubscribe
  }, [])

  // Form update handlers
  const updateUserId = useCallback((userId: string) => {
    setState((prev) => ({ ...prev, userId }))
  }, [])

  const updateContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, content }))
  }, [])

  const updateMeetingCode = useCallback((meetingCode: string) => {
    setState((prev) => ({ ...prev, meetingCode }))
  }, [])

  // Get current bucket info for display
  const getCurrentBucketInfo = useCallback(() => {
    const bucketKey = getCurrentBucketKey()
    return {
      bucketKey,
      timeRange: formatBucketTime(bucketKey)
    }
  }, [])

  // Auto test connection on mount
  useEffect(() => {
    console.log('🚀 Auto-testing Firebase connection...')
    testConnection()
  }, [testConnection])

  return {
    // State
    isConnected: state.isConnected,
    isLoading: state.isLoading,
    error: state.error,
    allData: state.allData,
    lastUpdate: state.lastUpdate,
    
    // Form states
    userId: state.userId,
    content: state.content,
    meetingCode: state.meetingCode,

    // Actions
    testConnection,
    readAllDatabase,
    addContent,
    startRealTimeListener,
    
    // Form handlers
    updateUserId,
    updateContent,
    updateMeetingCode,
    getCurrentBucketInfo
  }
}
