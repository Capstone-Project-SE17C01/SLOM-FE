import { ref, get, set, onValue, off, runTransaction } from 'firebase/database'
import { database } from './hardCodedConfig'
import { getCurrentBucketKey } from '@/utils/bucketTimeUtils'
import type {
  MeetingData,
  TimeBucket,
  UserBucketContent,
  ContentEntry,
  AddContentResult,
  CreateMeetingResult,
  MeetingInfo,
  MeetingUpdateCallback,
  DatabaseUpdateCallback
} from '@/types/IFirebaseMeeting'

/**
 * Firebase Meeting Service
 * Handles all meeting-related operations with clean separation of concerns
 */
class MeetingService {
  private readonly MEETINGS_PATH = 'meetings'

  /**
   * Check if a meeting exists in the database
   */
  async meetingExists(meetingCode: string): Promise<boolean> {
    try {
      const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
      const snapshot = await get(meetingRef)
      return snapshot.exists()
    } catch (error) {
      console.error('❌ Error checking meeting existence:', error)
      return false
    }
  }

  /**
   * Get meeting information and statistics
   */
  async getMeetingInfo(meetingCode: string): Promise<MeetingInfo> {
    try {
      const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
      const snapshot = await get(meetingRef)

      if (!snapshot.exists()) {
        return {
          meetingCode,
          exists: false,
          bucketCount: 0,
          participantCount: 0
        }
      }

      const meetingData = snapshot.val() as TimeBucket
      const buckets = Object.keys(meetingData)
      const participants = new Set<string>()
      let lastActivity = 0

      // Analyze meeting data
      buckets.forEach(bucketKey => {
        const bucket = meetingData[bucketKey]
        Object.keys(bucket).forEach(userId => {
          participants.add(userId)
        })
        
        // Update last activity (latest bucket key)
        const bucketTime = parseInt(bucketKey)
        if (bucketTime > lastActivity) {
          lastActivity = bucketTime
        }
      })

      return {
        meetingCode,
        exists: true,
        bucketCount: buckets.length,
        participantCount: participants.size,
        lastActivity
      }
    } catch (error) {
      console.error('❌ Error getting meeting info:', error)
      return {
        meetingCode,
        exists: false,
        bucketCount: 0,
        participantCount: 0
      }
    }
  }

  /**
   * Create a new meeting in the database
   */
  async createMeeting(meetingCode: string): Promise<CreateMeetingResult> {
    try {
      const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
      
      // Check if meeting already exists
      const exists = await this.meetingExists(meetingCode)
      if (exists) {
        return {
          success: true,
          meetingCode,
          error: 'Meeting already exists'
        }
      }

      // Create empty meeting structure
      const initialData: TimeBucket = {}
      await set(meetingRef, initialData)

      console.log('✅ Meeting created:', meetingCode)
      return {
        success: true,
        meetingCode
      }
    } catch (error) {
      console.error('❌ Error creating meeting:', error)
      return {
        success: false,
        meetingCode,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Add content to a specific meeting, bucket, and user
   * Uses Firebase transaction to safely append content
   */
  async addContent(entry: ContentEntry): Promise<AddContentResult> {
    try {
      const { meetingCode, userId, content } = entry
      const bucketKey = getCurrentBucketKey(entry.timestamp)
      
      // Ensure meeting exists
      if (!(await this.meetingExists(meetingCode))) {
        const createResult = await this.createMeeting(meetingCode)
        if (!createResult.success) {
          return {
            success: false,
            bucketKey,
            previousContent: '',
            newContent: content,
            error: `Failed to create meeting: ${createResult.error}`
          }
        }
      }

      const userContentRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}/${bucketKey}/${userId}`)
      
      // Use transaction to safely append content
      const result = await runTransaction(userContentRef, (currentData) => {
        const currentContent = currentData || ''
        const newContent = currentContent ? `${currentContent}+${content}` : content
        return newContent
      })

      if (result.committed) {
        const previousContent = result.snapshot.val() || ''
        const segments = previousContent.split('+')
        const actualPreviousContent = segments.slice(0, -1).join('+') || ''
        
        console.log('✅ Content added successfully:', {
          meetingCode,
          userId,
          bucketKey,
          content
        })

        return {
          success: true,
          bucketKey,
          previousContent: actualPreviousContent,
          newContent: result.snapshot.val()
        }
      } else {
        throw new Error('Transaction was not committed')
      }
    } catch (error) {
      console.error('❌ Error adding content:', error)
      return {
        success: false,
        bucketKey: getCurrentBucketKey(entry.timestamp),
        previousContent: '',
        newContent: entry.content,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get all content for a specific meeting
   */
  async getMeetingContent(meetingCode: string): Promise<TimeBucket | null> {
    try {
      const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
      const snapshot = await get(meetingRef)
      
      if (snapshot.exists()) {
        return snapshot.val() as TimeBucket
      }
      
      return null
    } catch (error) {
      console.error('❌ Error getting meeting content:', error)
      return null
    }
  }

  /**
   * Get content for a specific bucket in a meeting
   */
  async getBucketContent(meetingCode: string, bucketKey: string): Promise<UserBucketContent | null> {
    try {
      const bucketRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}/${bucketKey}`)
      const snapshot = await get(bucketRef)
      
      if (snapshot.exists()) {
        return snapshot.val() as UserBucketContent
      }
      
      return null
    } catch (error) {
      console.error('❌ Error getting bucket content:', error)
      return null
    }
  }

  /**
   * Get user's content in a specific bucket
   */
  async getUserBucketContent(meetingCode: string, bucketKey: string, userId: string): Promise<string | null> {
    try {
      const userRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}/${bucketKey}/${userId}`)
      const snapshot = await get(userRef)
      
      if (snapshot.exists()) {
        return snapshot.val() as string
      }
      
      return null
    } catch (error) {
      console.error('❌ Error getting user bucket content:', error)
      return null
    }
  }

  /**
   * Subscribe to real-time updates for a specific meeting
   */
  subscribeToMeeting(meetingCode: string, callback: MeetingUpdateCallback): () => void {
    const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
    
    onValue(meetingRef, (snapshot) => {
      const data = snapshot.exists() ? (snapshot.val() as TimeBucket) : null
      callback(data)
    })

    return () => {
      off(meetingRef)
    }
  }

  /**
   * Subscribe to real-time updates for entire database
   */
  subscribeToDatabase(callback: DatabaseUpdateCallback): () => void {
    const rootRef = ref(database)
    
    onValue(rootRef, (snapshot) => {
      const data = snapshot.exists() ? snapshot.val() : null
      callback(data)
    })

    return () => {
      off(rootRef)
    }
  }

  /**
   * Parse user content string into individual segments
   */
  parseUserContent(content: string): string[] {
    if (!content) return []
    return content.split('+').filter(segment => segment.trim() !== '')
  }

  /**
   * Get all meetings from database
   */
  async getAllMeetings(): Promise<MeetingData | null> {
    try {
      const meetingsRef = ref(database, this.MEETINGS_PATH)
      const snapshot = await get(meetingsRef)
      
      if (snapshot.exists()) {
        return snapshot.val() as MeetingData
      }
      
      return null
    } catch (error) {
      console.error('❌ Error getting all meetings:', error)
      return null
    }
  }

  /**
   * Delete a meeting (useful for cleanup)
   */
  async deleteMeeting(meetingCode: string): Promise<boolean> {
    try {
      const meetingRef = ref(database, `${this.MEETINGS_PATH}/${meetingCode}`)
      await set(meetingRef, null)
      
      console.log('🗑️ Meeting deleted:', meetingCode)
      return true
    } catch (error) {
      console.error('❌ Error deleting meeting:', error)
      return false
    }
  }
}

// Export singleton instance
export const meetingService = new MeetingService()
export default meetingService
