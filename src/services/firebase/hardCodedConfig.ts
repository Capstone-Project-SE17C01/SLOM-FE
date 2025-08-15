import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database'

// Hard coded Firebase config từ google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyD5-V3cI0UDyjLYubtqCFIsYFWSaIwnQGs",
  authDomain: "prnpe-42147.firebaseapp.com", 
  databaseURL: "https://prnpe-42147-default-rtdb.firebaseio.com",
  projectId: "prnpe-42147",
  storageBucket: "prnpe-42147.firebasestorage.app",
  messagingSenderId: "636023800043",
  appId: "1:636023800043:android:0a81502f3617926e73beae"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

// Test service
class FirebaseTestService {
  // Test connection bằng cách write một test data
  async testConnection(): Promise<boolean> {
    try {
      console.log('🔥 Testing Firebase connection...')
      
      // Write test data
      const testRef = ref(database, 'test/connection')
      await set(testRef, {
        message: 'Firebase connection successful!',
        timestamp: Date.now(),
        testId: Math.random().toString(36).substring(7)
      })
      
      console.log('✅ Write test successful!')
      
      // Read test data
      const snapshot = await get(testRef)
      if (snapshot.exists()) {
        console.log('✅ Read test successful!')
        console.log('📄 Test data:', snapshot.val())
        return true
      } else {
        console.log('❌ No test data found')
        return false
      }
    } catch (error) {
      console.error('❌ Firebase connection failed:', error)
      return false
    }
  }

  // Console.log tất cả data trong DB
  async logAllDatabase(): Promise<void> {
    try {
      console.log('📊 Reading all database data...')
      
      const rootRef = ref(database)
      const snapshot = await get(rootRef)
      
      if (snapshot.exists()) {
        console.log('🗃️ ALL DATABASE DATA:')
        console.log('=' .repeat(50))
        console.log(JSON.stringify(snapshot.val(), null, 2))
        console.log('=' .repeat(50))
      } else {
        console.log('📭 Database is empty')
      }
    } catch (error) {
      console.error('❌ Failed to read database:', error)
    }
  }

  // Write test meeting data
  async createTestMeeting(): Promise<void> {
    try {
      console.log('📝 Creating test meeting data...')
      
      const meetingId = 'test_meeting_' + Date.now()
      const meetingRef = ref(database, `meetings/${meetingId}`)
      
      const testMeetingData = {
        info: {
          createdAt: Date.now(),
          lastActivity: Date.now(),
          title: 'Test Meeting'
        },
        participants: {
          user_123: {
            name: 'Test User 1',
            isOnline: true,
            lastSeen: Date.now()
          },
          user_456: {
            name: 'Test User 2', 
            isOnline: true,
            lastSeen: Date.now()
          }
        },
        transcript: {
          user_123: {
            '202412211430': {
              minute: '2024-12-21 14:30',
              content: 'Xin chào mọi người. Đây là test message.',
              type: 'speech',
              firstTimestamp: Date.now() - 30000,
              lastTimestamp: Date.now(),
              messageCount: 2
            }
          },
          user_456: {
            '202412211431': {
              minute: '2024-12-21 14:31',
              content: 'Tôi đồng ý với ý kiến này. Test sign language.',
              type: 'sign_language', 
              firstTimestamp: Date.now() - 15000,
              lastTimestamp: Date.now(),
              messageCount: 1
            }
          }
        }
      }
      
      await set(meetingRef, testMeetingData)
      console.log('✅ Test meeting created:', meetingId)
      
    } catch (error) {
      console.error('❌ Failed to create test meeting:', error)
    }
  }

  // Listen to real-time changes
  listenToDatabase(callback: (data: Record<string, unknown> | null) => void): () => void {
    console.log('👂 Starting real-time listener...')
    
    const rootRef = ref(database)
    
    onValue(rootRef, (snapshot) => {
      console.log('🔄 Database updated!')
      const data = snapshot.val()
      callback(data)
    })
    
    // Return unsubscribe function
    return () => {
      console.log('🔇 Stopping real-time listener...')
      off(rootRef)
    }
  }
}

export const firebaseTestService = new FirebaseTestService()
export { database }
