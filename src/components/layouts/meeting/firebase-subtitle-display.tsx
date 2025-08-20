'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { meetingService } from '@/services/firebase/meetingService'
import { getCurrentBucketKey, formatBucketTime } from '@/utils/bucketTimeUtils'
import { TimeBucket, UserBucketContent } from '@/types/IFirebaseMeeting'
import { cn } from '@/utils/cn'
import { ChevronDown, Clock, Users, ArrowDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FirebaseSubtitleDisplayProps {
  meetingCode: string
  currentUserId: string
  className?: string
}

interface BucketDisplay {
  bucketKey: string
  timeRange: string
  isCurrentBucket: boolean
  userContents: Array<{
    userId: string
    contents: string[]
    isCurrentUser: boolean
  }>
}

export default function FirebaseSubtitleDisplay({
  meetingCode,
  currentUserId,
  className = ''
}: FirebaseSubtitleDisplayProps) {
  const [meetingData, setMeetingData] = useState<TimeBucket | null>(null)
  const [bucketDisplays, setBucketDisplays] = useState<BucketDisplay[]>([])
  const [currentBucketKey, setCurrentBucketKey] = useState<string>('')
  const [isAtCurrentBucket, setIsAtCurrentBucket] = useState(true)
  const [showBackToCurrentBtn, setShowBackToCurrentBtn] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentBucketRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)

  // Update current bucket key every second
  useEffect(() => {
    const updateCurrentBucket = () => {
      const newBucketKey = getCurrentBucketKey()
      setCurrentBucketKey(newBucketKey)
    }

    updateCurrentBucket()
    const interval = setInterval(updateCurrentBucket, 1000)

    return () => clearInterval(interval)
  }, [])

  // Subscribe to Firebase meeting data
  useEffect(() => {
    if (!meetingCode) return

    console.log('🔔 Subscribing to Firebase meeting:', meetingCode)

    const unsubscribe = meetingService.subscribeToMeeting(meetingCode, (data) => {
      console.log('📡 Firebase subtitle data updated:', data)
      setMeetingData(data)
    })

    unsubscribeRef.current = unsubscribe

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
      }
    }
  }, [meetingCode])

  // Process meeting data into bucket displays
  useEffect(() => {
    if (!meetingData || !currentBucketKey) return

    const buckets = Object.keys(meetingData).sort((a, b) => parseInt(b) - parseInt(a)) // Latest first

    const displays: BucketDisplay[] = buckets.map((bucketKey) => {
      const userBucketContent: UserBucketContent = meetingData[bucketKey]
      const userContents = Object.entries(userBucketContent).map(([userId, content]) => ({
        userId,
        contents: meetingService.parseUserContent(content),
        isCurrentUser: userId === currentUserId
      }))

      return {
        bucketKey,
        timeRange: formatBucketTime(bucketKey),
        isCurrentBucket: bucketKey === currentBucketKey,
        userContents
      }
    })

    setBucketDisplays(displays)
  }, [meetingData, currentBucketKey, currentUserId])

  // Auto-scroll to current bucket when new current bucket appears
  useEffect(() => {
    if (isAtCurrentBucket && currentBucketRef.current) {
      currentBucketRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [currentBucketKey, isAtCurrentBucket])

  // Handle scroll to detect if user is viewing older buckets
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !currentBucketRef.current) return

    const container = scrollContainerRef.current
    const currentBucket = currentBucketRef.current

    const containerBottom = container.scrollTop + container.clientHeight
    const currentBucketTop = currentBucket.offsetTop

    const isViewingCurrent = currentBucketTop <= containerBottom

    setIsAtCurrentBucket(isViewingCurrent)
    setShowBackToCurrentBtn(!isViewingCurrent)
  }, [])

  // Scroll back to current bucket
  const scrollToCurrentBucket = useCallback(() => {
    if (currentBucketRef.current) {
      currentBucketRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end'
      })
      setIsAtCurrentBucket(true)
      setShowBackToCurrentBtn(false)
    }
  }, [])

  // Format timestamp for display
  const formatTimestamp = (bucketKey: string): string => {
    const timestamp = parseInt(bucketKey) * 1000
    return new Date(timestamp).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  if (!meetingData || bucketDisplays.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center p-4 bg-black/80 text-white rounded-lg backdrop-blur-sm',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 animate-pulse" />
          <span className="text-sm">Waiting for subtitles...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Back to Current Button */}
      {showBackToCurrentBtn && (
        <div className="absolute top-2 right-2 z-10">
          <Button
            size="sm"
            variant="outline"
            onClick={scrollToCurrentBucket}
            className="bg-blue-600 text-white border-blue-500 hover:bg-blue-700 px-3 py-1 h-auto"
          >
            <ArrowDown className="w-3 h-3 mr-1" />
            <span className="text-xs">Current</span>
          </Button>
        </div>
      )}

      {/* Subtitle Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-black/80 text-white rounded-lg backdrop-blur-sm max-h-64 overflow-y-auto"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#4b5563 transparent'
        }}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Meeting Subtitles</span>
            <span className="text-xs text-gray-400 ml-auto">{bucketDisplays.length} time periods</span>
          </div>

          {/* Bucket List */}
          <div className="space-y-3">
            {bucketDisplays.map(
              (bucket, index) => (
                console.log('index', index),
                (
                  <div
                    key={bucket.bucketKey}
                    ref={bucket.isCurrentBucket ? currentBucketRef : null}
                    className={cn(
                      'border-l-2 pl-3 transition-all duration-200',
                      bucket.isCurrentBucket ? 'border-green-500 bg-green-900/20' : 'border-gray-600'
                    )}
                  >
                    {/* Time Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs font-medium text-gray-300">{formatTimestamp(bucket.bucketKey)}</span>
                      {bucket.isCurrentBucket && (
                        <span className="text-xs bg-green-600 px-2 py-0.5 rounded text-white">LIVE</span>
                      )}
                    </div>

                    {/* User Contents */}
                    <div className="space-y-2">
                      {bucket.userContents.map((userContent, userIndex) => {
                        console.log('userContent', userIndex)
                        // Join all content pieces into one continuous text
                        const fullContent = userContent.contents.join(' ').trim()

                        if (!fullContent) return null

                        // Check if content contains sign language
                        const isSignLanguage = fullContent.includes('[SIGN]')
                        const displayContent = fullContent.replace(/\[SIGN\]\s*/g, '')

                        return (
                          <div
                            key={`${bucket.bucketKey}-${userContent.userId}`}
                            className={cn(
                              'text-sm leading-relaxed mb-2',
                              userContent.isCurrentUser ? 'text-blue-300' : 'text-white'
                            )}
                          >
                            <div className="flex items-start gap-2">
                              {/* Content Type Indicator */}
                              {isSignLanguage ? (
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center">
                                    <span className="text-xs text-white font-bold">🤟</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex-shrink-0 mt-0.5">
                                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                </div>
                              )}

                              {/* Content */}
                              <p className="flex-1">{displayContent}</p>

                              {/* User Indicator */}
                              {userContent.isCurrentUser && (
                                <span className="text-xs text-blue-400 flex-shrink-0">You</span>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {bucket.userContents.length === 0 && (
                        <p className="text-xs text-gray-500 italic">No content in this period</p>
                      )}
                    </div>
                  </div>
                )
              )
            )}
          </div>

          {/* Auto-scroll indicator */}
          {!isAtCurrentBucket && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1 text-xs text-gray-400">
                <ChevronDown className="w-3 h-3" />
                <span>Viewing older messages</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-400">🔴 Live • Firebase Real-time</span>
      </div>
    </div>
  )
}
