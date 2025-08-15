import { useState, useEffect, useCallback } from 'react'
import { firebaseTestService } from '@/services/firebase/hardCodedConfig'

interface FirebaseTestState {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  allData: Record<string, unknown> | null
  lastUpdate: number
}

export const useFirebaseTest = () => {
  const [state, setState] = useState<FirebaseTestState>({
    isConnected: false,
    isLoading: false,
    error: null,
    allData: null,
    lastUpdate: 0
  })

  // Test connection
  const testConnection = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      console.log('🚀 Starting Firebase connection test...')
      
      const isConnected = await firebaseTestService.testConnection()
      
      setState(prev => ({ 
        ...prev, 
        isConnected, 
        isLoading: false,
        lastUpdate: Date.now()
      }))
      
      if (isConnected) {
        console.log('🎉 Firebase connection successful!')
      }
      
    } catch (error) {
      console.error('💥 Firebase test failed:', error)
      setState(prev => ({ 
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
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      console.log('📖 Reading all database data...')
      
      await firebaseTestService.logAllDatabase()
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        lastUpdate: Date.now()
      }))
      
    } catch (error) {
      console.error('💥 Failed to read database:', error)
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to read database',
        lastUpdate: Date.now()
      }))
    }
  }, [])

  // Create test data
  const createTestData = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }))
    
    try {
      console.log('🏗️ Creating test data...')
      
      await firebaseTestService.createTestMeeting()
      
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        lastUpdate: Date.now()
      }))
      
      console.log('✅ Test data created!')
      
    } catch (error) {
      console.error('💥 Failed to create test data:', error)
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create test data',
        lastUpdate: Date.now()
      }))
    }
  }, [])

  // Start real-time listener
  const startRealTimeListener = useCallback(() => {
    console.log('🎧 Starting real-time listener...')
    
    const unsubscribe = firebaseTestService.listenToDatabase((data) => {
      console.log('🔄 Real-time update received!')
      console.log('📊 Updated data:', data)
      
      setState(prev => ({ 
        ...prev, 
        allData: data,
        lastUpdate: Date.now()
      }))
    })
    
    return unsubscribe
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
    
    // Actions
    testConnection,
    readAllDatabase,
    createTestData,
    startRealTimeListener
  }
}
