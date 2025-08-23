import { BucketTimeInfo } from '@/types/IFirebaseMeeting'

/**
 * Utility functions for calculating time buckets (10-second intervals)
 */

/**
 * Calculate bucket key from current UTC time
 * Rounds down to nearest 10-second interval
 * 
 * @param timestamp - Optional timestamp in milliseconds (defaults to now)
 * @returns Bucket key as string (e.g., "1710000110")
 */
export function getCurrentBucketKey(timestamp?: number): string {
  const now = timestamp || Date.now()
  const unixSeconds = Math.floor(now / 1000)
  const bucketKey = Math.floor(unixSeconds / 10) * 10
  return bucketKey.toString()
}

/**
 * Get detailed bucket time information
 * 
 * @param timestamp - Optional timestamp in milliseconds (defaults to now)
 * @returns BucketTimeInfo with start/end times
 */
export function getBucketTimeInfo(timestamp?: number): BucketTimeInfo {
  const bucketKey = getCurrentBucketKey(timestamp)
  const startTime = parseInt(bucketKey)
  const endTime = startTime + 9 // 10 seconds minus 1

  return {
    bucketKey,
    startTime,
    endTime
  }
}

/**
 * Parse bucket key back to readable time
 * 
 * @param bucketKey - Bucket key string
 * @returns Formatted time range string
 */
export function formatBucketTime(bucketKey: string): string {
  const startTime = parseInt(bucketKey)
  const endTime = startTime + 9
  
  const startDate = new Date(startTime * 1000)
  const endDate = new Date(endTime * 1000)
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    })
  }
  
  return `${formatTime(startDate)} - ${formatTime(endDate)} UTC`
}

/**
 * Check if a timestamp falls within a specific bucket
 * 
 * @param timestamp - Timestamp to check (milliseconds)
 * @param bucketKey - Bucket key to check against
 * @returns True if timestamp is in bucket range
 */
export function isTimestampInBucket(timestamp: number, bucketKey: string): boolean {
  const unixSeconds = Math.floor(timestamp / 1000)
  const bucketStart = parseInt(bucketKey)
  const bucketEnd = bucketStart + 9
  
  return unixSeconds >= bucketStart && unixSeconds <= bucketEnd
}

/**
 * Get all bucket keys between two timestamps
 * 
 * @param startTimestamp - Start time in milliseconds
 * @param endTimestamp - End time in milliseconds
 * @returns Array of bucket keys covering the time range
 */
export function getBucketKeysInRange(startTimestamp: number, endTimestamp: number): string[] {
  const buckets: string[] = []
  
  let current = Math.floor(startTimestamp / 1000)
  const end = Math.floor(endTimestamp / 1000)
  
  while (current <= end) {
    const bucketKey = Math.floor(current / 10) * 10
    const bucketKeyStr = bucketKey.toString()
    
    if (!buckets.includes(bucketKeyStr)) {
      buckets.push(bucketKeyStr)
    }
    
    current = bucketKey + 10 // Move to next bucket
  }
  
  return buckets
}

/**
 * Calculate time remaining in current bucket
 * 
 * @param timestamp - Optional timestamp in milliseconds (defaults to now)
 * @returns Seconds remaining in current bucket
 */
export function getTimeRemainingInBucket(timestamp?: number): number {
  const now = timestamp || Date.now()
  const unixSeconds = Math.floor(now / 1000)
  const bucketStart = Math.floor(unixSeconds / 10) * 10
  const bucketEnd = bucketStart + 9
  
  return bucketEnd - unixSeconds
}
