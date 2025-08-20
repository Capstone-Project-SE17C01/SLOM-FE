/**
 * Firebase Realtime Database Types for Meeting Transcripts
 *
 * Structure:
 * meetings/{meetingCode}/{bucketKey}/{userId} = "content1 content2 content3"
 *
 * Where:
 * - meetingCode: unique meeting identifier (e.g., roomID from Zego)
 * - bucketKey: UTC timestamp rounded down to 100-second intervals
 * - userId: user identifier
 * - value: concatenated content separated by space
 */

// Raw user content in a specific time bucket
export interface UserBucketContent {
  [userId: string]: string // "content1 content2 content3"
}

// Time bucket containing all users' content for that period
export interface TimeBucket {
  [bucketKey: string]: UserBucketContent // bucketKey is string representation of UTC timestamp
}

// Complete meeting data structure
export interface MeetingData {
  [meetingCode: string]: TimeBucket
}

// Root Firebase structure
export interface FirebaseDatabase {
  meetings?: MeetingData
}

// Helper types for operations
export interface BucketTimeInfo {
  bucketKey: string // e.g., "1710000100"
  startTime: number // Unix timestamp in seconds
  endTime: number // Unix timestamp in seconds
}

export interface ContentEntry {
  meetingCode: string
  userId: string
  content: string
  timestamp?: number // Optional: when content was created (for logging)
}

export interface MeetingInfo {
  meetingCode: string
  exists: boolean
  bucketCount: number
  participantCount: number
  lastActivity?: number
}

// Utility type for content parsing
export interface ParsedUserContent {
  userId: string
  contents: string[] // Split by space
  totalSegments: number
}

// Real-time subscription callback types
export type MeetingUpdateCallback = (meetingData: TimeBucket | null) => void
export type DatabaseUpdateCallback = (allData: FirebaseDatabase | null) => void

// Operation result types
export interface AddContentResult {
  success: boolean
  bucketKey: string
  previousContent: string
  newContent: string
  error?: string
}

export interface CreateMeetingResult {
  success: boolean
  meetingCode: string
  error?: string
}
