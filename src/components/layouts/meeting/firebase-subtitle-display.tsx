'use client'

import React, { useEffect, useState, useRef, useCallback } from 'react'
import { meetingService } from '@/services/firebase/meetingService'
import { getCurrentBucketKey, formatBucketTime } from '@/utils/bucketTimeUtils'
import { TimeBucket, UserBucketContent } from '@/types/IFirebaseMeeting'
import { cn } from '@/utils/cn'
import { ChevronDown, Clock, Users, GripHorizontal } from 'lucide-react'

interface FirebaseSubtitleDisplayProps {
  meetingCode: string
  currentUserId: string
  className?: string
}

interface BucketDisplay {
  bucketKey: string
  timeRange: string
  isCurrentBucket: boolean
  hasLiveContent?: boolean
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
  const [containerHeight, setContainerHeight] = useState(256) // Default height in pixels
  const [isResizing, setIsResizing] = useState(false)
  const [hasNewContent, setHasNewContent] = useState(false)

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const currentBucketRef = useRef<HTMLDivElement>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const resizeStartY = useRef<number>(0)
  const initialHeight = useRef<number>(0)
  const previousBucketsLength = useRef<number>(0)

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

    const buckets = Object.keys(meetingData).sort((a, b) => parseInt(a) - parseInt(b)) // Oldest first, newest at bottom

    // 🔥 FIX: Nhóm nội dung theo người dùng, kết hợp các bucket liên tiếp
    const displays: BucketDisplay[] = []
    
    // Theo dõi nội dung người dùng cuối cùng cho mỗi bucket để nhóm lại
    const lastUserContentByBucket: Record<string, Record<string, string[]>> = {}
    
    // 🔥 FIX: Tìm bucket mới nhất cho mỗi người dùng để hiển thị LIVE
    // Đây là bucket thực sự đang active, có thể khác với currentBucketKey
    const userLatestBuckets = new Map<string, string>()
    
    // Đầu tiên, xác định bucket mới nhất cho mỗi người dùng
    buckets.forEach((bucketKey) => {
      const userBucketContent: UserBucketContent = meetingData[bucketKey]
      Object.keys(userBucketContent).forEach((userId) => {
        userLatestBuckets.set(userId, bucketKey)
      })
    })
    
    buckets.forEach((bucketKey) => {
      const userBucketContent: UserBucketContent = meetingData[bucketKey]
      // 🔥 FIX: Bucket hiện tại là bucket mặc định theo thời gian hoặc bucket mới nhất của người dùng
      const isCurrentTimelineBucket = bucketKey === currentBucketKey
      
      // Xử lý từng người dùng trong bucket
      Object.entries(userBucketContent).forEach(([userId, content]) => {
        const parsedContents = meetingService.parseUserContent(content)
        if (parsedContents.length === 0) return
        
        const isCurrentUser = userId === currentUserId
        // 🔥 FIX: Kiểm tra xem đây có phải bucket mới nhất của người dùng không
        const isLatestUserBucket = userLatestBuckets.get(userId) === bucketKey
        
        // Kiểm tra xem có thể gộp với bucket trước đó không
        const prevBucketIndex = displays.length - 1
        const prevBucket = prevBucketIndex >= 0 ? displays[prevBucketIndex] : null
        
        // Điều kiện để gộp:
        // 1. Bucket trước đó tồn tại
        // 2. Bucket trước đó có nội dung của cùng người dùng
        // 3. Thời gian giữa hai bucket không quá 30 giây (2 bucket liên tiếp)
        const canMerge = prevBucket && 
                         prevBucket.userContents.some(u => u.userId === userId) &&
                         Math.abs(parseInt(bucketKey) - parseInt(prevBucket.bucketKey)) <= 30
        
        if (canMerge) {
          // Tìm nội dung của người dùng trong bucket trước đó để gộp
          const userContentIndex = prevBucket.userContents.findIndex(u => u.userId === userId)
          if (userContentIndex >= 0) {
            // Gộp nội dung
            prevBucket.userContents[userContentIndex].contents = [
              ...prevBucket.userContents[userContentIndex].contents,
              ...parsedContents
            ]
            
            // 🔥 FIX: Cập nhật trạng thái LIVE nếu đây là bucket mới nhất của người dùng
            if (isLatestUserBucket) {
              prevBucket.isCurrentBucket = true
              prevBucket.hasLiveContent = true
            }
            
            // Cập nhật thời gian hiển thị
            const endTime = parseInt(bucketKey) + 14
            prevBucket.timeRange = formatBucketTime(prevBucket.bucketKey, endTime)
            
            // Lưu lại để kiểm tra cho lần tiếp theo
            if (!lastUserContentByBucket[bucketKey]) {
              lastUserContentByBucket[bucketKey] = {}
            }
            lastUserContentByBucket[bucketKey][userId] = parsedContents
            
            return // Không tạo bucket mới
          }
        }
        
        // Nếu không thể gộp, tạo bucket mới
        const newBucketDisplay: BucketDisplay = {
          bucketKey,
          timeRange: formatBucketTime(bucketKey),
          // 🔥 FIX: Bucket hiện tại là bucket mặc định theo thời gian HOẶC bucket mới nhất của người dùng
          isCurrentBucket: isCurrentTimelineBucket || isLatestUserBucket,
          // 🔥 FIX: Thêm flag để đánh dấu bucket có nội dung LIVE
          hasLiveContent: isLatestUserBucket,
          userContents: [
            {
              userId,
              contents: parsedContents,
              isCurrentUser
            }
          ]
        }
        
        displays.push(newBucketDisplay)
        
        // Lưu lại để kiểm tra cho lần tiếp theo
        if (!lastUserContentByBucket[bucketKey]) {
          lastUserContentByBucket[bucketKey] = {}
        }
        lastUserContentByBucket[bucketKey][userId] = parsedContents
      })
    })

    // Kiểm tra nếu có bucket mới hoặc nội dung mới
    if (displays.length > previousBucketsLength.current) {
      setHasNewContent(true);
      previousBucketsLength.current = displays.length;
    }

    setBucketDisplays(displays)
  }, [meetingData, currentBucketKey, currentUserId])

  // Auto-scroll to bottom when new content appears
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    // Tự động cuộn xuống khi có nội dung mới hoặc bucket mới
    if (hasNewContent || bucketDisplays.some(bucket => bucket.hasLiveContent)) {
      setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: 'smooth'
          });
          setHasNewContent(false);
          setIsAtCurrentBucket(true);
        }
      }, 100);
    }
  }, [bucketDisplays, hasNewContent]);

  // Handle resize drag
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      resizeStartY.current = e.clientY
      initialHeight.current = containerHeight

      const handleMouseMove = (e: MouseEvent) => {
        const deltaY = resizeStartY.current - e.clientY // Inverted for natural drag feel
        const newHeight = Math.max(150, Math.min(600, initialHeight.current + deltaY))
        setContainerHeight(newHeight)
      }

      const handleMouseUp = () => {
        setIsResizing(false)
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [containerHeight]
  )

  // Handle scroll to detect if user is viewing older buckets
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !currentBucketRef.current) return

    const container = scrollContainerRef.current
    const currentBucket = currentBucketRef.current

    const containerBottom = container.scrollTop + container.clientHeight
    const currentBucketBottom = currentBucket.offsetTop + currentBucket.offsetHeight

    const isViewingCurrent = currentBucketBottom <= containerBottom + 50 // Add some tolerance

    setIsAtCurrentBucket(isViewingCurrent)
  }, [setIsAtCurrentBucket])

  // Format timestamp for display - Thêm tham số endTime để hỗ trợ hiển thị bucket gộp
  const formatTimestamp = (bucketKey: string, endTimestamp?: number): string => {
    const startTimestamp = parseInt(bucketKey) * 1000
    const endTime = endTimestamp ? endTimestamp * 1000 : startTimestamp + 14000
    
    const startDate = new Date(startTimestamp)
    const endDate = new Date(endTime)
    
    const formatOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    
    return `${startDate.toLocaleTimeString('vi-VN', formatOptions)} - ${endDate.toLocaleTimeString('vi-VN', formatOptions)}`
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
          <span className="text-sm">Translating... Please speak or use sign language</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Resize Handle */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center z-20 hover:bg-blue-500/20 transition-colors',
          isResizing && 'bg-blue-500/30'
        )}
        onMouseDown={handleResizeStart}
      >
        <GripHorizontal className="w-4 h-3 text-gray-400" />
      </div>

      {/* Subtitle Container */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-black/80 text-white rounded-lg backdrop-blur-sm overflow-y-auto mt-2"
        style={{
          height: `${containerHeight}px`,
          scrollbarWidth: 'thin',
          scrollbarColor: '#4b5563 transparent'
        }}
      >
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Meeting Subtitles</span>
            <span className="text-xs text-gray-400 ml-auto">
              {bucketDisplays.length} periods • {containerHeight}px
            </span>
          </div>

          {/* Bucket List */}
          <div className="space-y-3">
            {bucketDisplays.map((bucket) => (
              <div
                key={bucket.bucketKey}
                ref={bucket.hasLiveContent ? currentBucketRef : null}
                className={cn(
                  'border-l-2 pl-3 transition-all duration-200',
                  bucket.hasLiveContent ? 'border-green-500 bg-green-900/20' : 'border-gray-600'
                )}
              >
                {/* Time Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs font-medium text-gray-300">{formatTimestamp(bucket.bucketKey)}</span>
                  {bucket.hasLiveContent && (
                    <span className="text-xs bg-green-600 px-2 py-0.5 rounded text-white">LIVE</span>
                  )}
                </div>

                {/* User Contents - Separated by User */}
                <div className="space-y-3">
                  {bucket.userContents.map((userContent) => {
                    // Join all content pieces into one continuous text
                    const fullContent = userContent.contents.join(' ').trim()

                    if (!fullContent) return null

                    // Clean display content - remove any remaining prefixes
                    const displayContent = fullContent
                      .replace(/\[SIGN\]\s*/g, '')
                      .replace(/\[AI.*?\]\s*/g, '')
                      .replace(/\[SCRIPT.*?\]\s*/g, '')
                      .replace(/\[BATCH.*?\]\s*/g, '')
                      .trim()

                    // Get user display name
                    const userDisplayName = userContent.isCurrentUser ? 'You' : `User ${userContent.userId.slice(-4)}`

                    return (
                      <div
                        key={`${bucket.bucketKey}-${userContent.userId}`}
                        className={cn(
                          'border rounded-lg p-3 transition-all duration-200',
                          userContent.isCurrentUser
                            ? 'border-blue-500/30 bg-blue-900/20'
                            : 'border-gray-600/30 bg-gray-800/20'
                        )}
                      >
                        {/* User Header - Clean without type indicators */}
                        <div className="flex items-center gap-2 mb-2">
                          {/* Simple User Indicator */}
                          <div
                            className={cn(
                              'w-4 h-4 rounded-full',
                              userContent.isCurrentUser ? 'bg-blue-500' : 'bg-gray-500'
                            )}
                          ></div>

                          {/* User Name */}
                          <span
                            className={cn(
                              'text-xs font-medium',
                              userContent.isCurrentUser ? 'text-blue-300' : 'text-gray-300'
                            )}
                          >
                            {userDisplayName}
                          </span>
                        </div>

                        {/* User Content - Natural subtitle display */}
                        <p
                          className={cn(
                            'text-sm leading-relaxed',
                            userContent.isCurrentUser ? 'text-blue-100' : 'text-white'
                          )}
                        >
                          {displayContent}
                        </p>
                      </div>
                    )
                  })}

                  {bucket.userContents.length === 0 && (
                    <p className="text-xs text-gray-500 italic text-center py-2">No content in this time period</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Auto-scroll indicator */}
          {!isAtCurrentBucket && (
            <div className="text-center py-2">
              <div className="inline-flex items-center gap-1 text-xs text-gray-400">
                <ChevronDown className="w-3 h-3" />
                <span>Scroll down for latest messages</span>
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
