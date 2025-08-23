'use client'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useRecording } from '@/hooks/useRecording'
import { useRealSignLanguageRecognition } from '@/hooks/useRealSignLanguageRecognition'
import SignLanguageDetector from '@/components/SignLanguageDetector/SignLanguageDetector'
import { useEffect } from 'react'
import { useSpeechToText } from '@/hooks/useSpeechToText'

import { useMeetingFirebase } from '@/hooks/useMeetingFirebase'
import { Mic, Square, Languages, MessageCircle } from 'lucide-react'
import { generateZegoToken } from '@/services/zego/config'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { SignLanguageOverlay, SignLanguageToggleButton } from '@/components/ui/signLanguageOverlay'
import { cn } from '@/utils/cn'
import { RootState } from '@/redux/store'
import { useAddRecordingMutation, useGetMeetingQuery, useLeaveMeetingMutation } from '@/api/MeetingApi'
import { FolderSelectionModal } from '@/components/layouts/meeting/folder-selection-form'
import FirebaseSubtitleDisplay from '@/components/layouts/meeting/firebase-subtitle-display'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

export default function MeetingPage() {
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  // Meeting states
  const [roomID, setRoomID] = React.useState('')
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState(false)
  const [meetingExpired, setMeetingExpired] = React.useState(false)
  const [signLanguageVisible, setSignLanguageVisible] = React.useState(false)
  const [joinAttempted, setJoinAttempted] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  // Speech-to-text states
  const [speechLang, setSpeechLang] = React.useState<'vi-VN' | 'en-US'>('en-US')
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || ''
  const region = process.env.NEXT_PUBLIC_AZURE_REGION || ''
  const translatorKey = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY || ''
  const fromLang = speechLang === 'vi-VN' ? 'en-US' : 'vi-VN'
  const toLang = speechLang === 'vi-VN' ? 'vi' : 'en'

  // API hooks
  const [leaveMeeting] = useLeaveMeetingMutation()
  const [addRecording] = useAddRecordingMutation()
  const { data: meetingData } = useGetMeetingQuery(roomID, {
    skip: !roomID,
    pollingInterval: 30000
  })

  // Speech-to-text hook
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechToText({
    subscriptionKey,
    region,
    translatorKey,
    fromLang,
    toLang
  })

  // Firebase hooks
  const meetingFirebase = useMeetingFirebase({
    meetingCode: roomID,
    userId: userInfo?.id || '',
    enabled: hasJoinedRoom && !meetingExpired && userInfo?.vipUser
  })

  // Track previously sent speech content to avoid duplicates
  const lastSentSpeechRef = React.useRef<string>('')
  const lastSentSignRef = React.useRef<string>('')
  const lastSentTemporarySignRef = React.useRef<string>('')

  // Callback for temporary sign language predictions (real-time)
  const handleTemporarySignPrediction = React.useCallback(
    (gesture: string, confidence: number) => {
      if (!hasJoinedRoom || meetingExpired || !userInfo?.vipUser) return

      // Debounce temporary predictions to avoid spam
      const debounceTimeout = setTimeout(() => {
        if (gesture !== lastSentTemporarySignRef.current) {
          meetingFirebase.sendSignContent(`[TEMP] ${gesture} (${confidence}%)`)
          lastSentTemporarySignRef.current = gesture
          console.log(`🔄 Sent temporary sign prediction: ${gesture}`)
        }
      }, 300) // Short debounce for real-time feel

      return () => clearTimeout(debounceTimeout)
    },
    [hasJoinedRoom, meetingExpired, userInfo?.vipUser, meetingFirebase]
  )

  // Callback for confirmed sign language predictions (final)
  const handleConfirmedSignPrediction = React.useCallback(
    (gesture: string, confidence: number) => {
      if (!hasJoinedRoom || meetingExpired || !userInfo?.vipUser) return

      meetingFirebase.sendSignContent(`[CONFIRMED] ${gesture}`)
      console.log(`✅ Sent confirmed sign prediction: ${gesture}`)
    },
    [hasJoinedRoom, meetingExpired, userInfo?.vipUser, meetingFirebase]
  )

  // Real AI Sign Language Recognition hook
  const signLanguageRecognition = useRealSignLanguageRecognition({
    confidenceThreshold: 70, // Only accept gestures with >70% confidence
    maxRecentPredictions: 20, // Keep last 20 predictions
    onTemporaryPrediction: handleTemporarySignPrediction, // Real-time callback
    onConfirmedPrediction: handleConfirmedSignPrediction // Final callback
  })

  // Auto show overlay when sign language recognition is activated
  React.useEffect(() => {
    if (signLanguageRecognition.isActive && !signLanguageVisible) {
      setSignLanguageVisible(true)
    }
  }, [signLanguageRecognition.isActive, signLanguageVisible])

  // Auto-send speech transcript to Firebase when it changes (only new content)
  React.useEffect(() => {
    if (transcript && hasJoinedRoom && !meetingExpired && userInfo?.vipUser) {
      // Only send if content is different from what was last sent
      if (transcript !== lastSentSpeechRef.current && transcript.trim()) {
        const timeoutId = setTimeout(() => {
          // Check if transcript is longer than last sent content (new content added)
          if (transcript.startsWith(lastSentSpeechRef.current)) {
            // Extract only the new part
            const newContent = transcript.slice(lastSentSpeechRef.current.length).trim()
            if (newContent) {
              meetingFirebase.sendSpeechContent(newContent)
              lastSentSpeechRef.current = transcript
            }
          } else {
            // Completely new transcript (user started a new speech session)
            meetingFirebase.sendSpeechContent(transcript)
            lastSentSpeechRef.current = transcript
          }
        }, 200) // Increased debounce to 1 second for better stability

        return () => clearTimeout(timeoutId)
      }
    }
  }, [transcript, hasJoinedRoom, meetingExpired, userInfo?.vipUser, meetingFirebase])

  // 🔥 DEPRECATED: Auto-send sign language transcript to Firebase when it changes (only new content)
  // This has been replaced by the new hybrid approach with onTemporaryPrediction & onConfirmedPrediction callbacks
  /*
  React.useEffect(() => {
    if (signLanguageRecognition.fullTranscript && hasJoinedRoom && !meetingExpired && userInfo?.vipUser) {
      // Only send if content is different from what was last sent
      if (
        signLanguageRecognition.fullTranscript !== lastSentSignRef.current &&
        signLanguageRecognition.fullTranscript.trim()
      ) {
        const timeoutId = setTimeout(() => {
          // Check if transcript is longer than last sent content (new content added)
          if (signLanguageRecognition.fullTranscript.startsWith(lastSentSignRef.current)) {
            // Extract only the new part
            const newContent = signLanguageRecognition.fullTranscript.slice(lastSentSignRef.current.length).trim()
            if (newContent) {
              meetingFirebase.sendSignContent(newContent)
              lastSentSignRef.current = signLanguageRecognition.fullTranscript
            }
          } else {
            // Completely new transcript (user started a new sign language session)
            meetingFirebase.sendSignContent(signLanguageRecognition.fullTranscript)
            lastSentSignRef.current = signLanguageRecognition.fullTranscript
          }
        }, 1000) // Increased debounce to 1 second for better stability

        return () => clearTimeout(timeoutId)
      }
    }
  }, [signLanguageRecognition.fullTranscript, hasJoinedRoom, meetingExpired, userInfo?.vipUser, meetingFirebase])
  */

  const handleRecordingSave = React.useCallback(
    async (recordingPath: string, duration: number) => {
      if (!roomID || !userInfo?.id) return
      try {
        await addRecording({
          id: roomID,
          request: {
            storagePath: recordingPath,
            duration,
            userId: userInfo.id
          }
        }).unwrap()
      } catch (error) {
        console.error('Failed to save recording:', error)
      }
    },
    [addRecording, roomID, userInfo]
  )

  const {
    isRecording,
    startRecording,
    stopRecording,
    showFolderModal,
    setShowFolderModal,
    folderName,
    customFolderName,
    setCustomFolderName,
    handleFolderSelect,
    handleCustomFolderSubmit
  } = useRecording({ roomID, onStopRecording: handleRecordingSave })

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const id = params.get('roomID')
      if (id) setRoomID(id)
    }
  }, [])

  React.useEffect(() => {
    if (meetingData?.endTime) {
      const endTime = new Date(meetingData.endTime).getTime()
      const now = new Date().getTime()
      const timeLeft = Math.max(0, Math.floor((endTime - now) / 1000))

      if (timeLeft <= 0 || meetingData.status === 'Ended') {
        setMeetingExpired(true)
      }
    }
  }, [meetingData])

  // Reset tracking refs when speech listening stops
  React.useEffect(() => {
    if (!isListening) {
      lastSentSpeechRef.current = ''
    }
  }, [isListening])

  // Reset tracking refs when sign language recognition stops
  React.useEffect(() => {
    if (!signLanguageRecognition.isActive) {
      lastSentSignRef.current = ''
    }
  }, [signLanguageRecognition.isActive])

  React.useEffect(() => {
    return () => {
      if (isListening) stopListening()
      resetTranscript()
      // Reset tracking refs on cleanup
      lastSentSpeechRef.current = ''
      lastSentSignRef.current = ''
      if (roomID && userInfo?.id) {
        leaveMeeting({ id: roomID, request: { userId: userInfo.id } })
      }
    }
  }, [leaveMeeting, roomID, userInfo, isListening, stopListening, resetTranscript])

  const joinZegoRoom = React.useCallback(
    async (element: HTMLDivElement) => {
      if (!element || !roomID || !userInfo?.id || joinAttempted) return

      setJoinAttempted(true)

      try {
        const kitToken = generateZegoToken(roomID)
        const zp = ZegoUIKitPrebuilt.create(kitToken)
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: 'Personal link',
              url:
                typeof window !== 'undefined'
                  ? `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`
                  : ''
            }
          ],
          scenario: { mode: ZegoUIKitPrebuilt.GroupCall },
          onJoinRoom: () => setHasJoinedRoom(true),
          onLeaveRoom: () => {
            setHasJoinedRoom(false)
            if (isListening) stopListening()
            resetTranscript()
          },
          leaveRoomDialogConfig: {
            titleText: 'Leave Meeting',
            descriptionText: 'Are you sure you want to leave this meeting?',
            confirmCallback: () => {
              if (roomID && userInfo?.id) {
                leaveMeeting({ id: roomID, request: { userId: userInfo.id } })
              }
              router.push('/meeting-room')
            }
          }
        })
      } catch (error) {
        console.error('Failed to join meeting:', error)
      }
    },
    [roomID, userInfo, isListening, stopListening, resetTranscript, leaveMeeting, router, joinAttempted]
  )

  useEffect(() => {
    if (containerRef.current && roomID && userInfo?.id && !hasJoinedRoom && !joinAttempted) {
      joinZegoRoom(containerRef.current)
    }
  }, [roomID, userInfo?.id, joinZegoRoom, hasJoinedRoom, joinAttempted])

  return (
    <>
      <div className="myCallContainer" ref={containerRef} style={{ height: '100vh', width: '100vw' }} />

      {/* Main control bar */}
      {hasJoinedRoom && !meetingExpired && roomID && (
        <div className="fixed bottom-3 left-5 z-[999] flex items-center gap-4 bg-opacity-80 bg-gray-900 dark:bg-gray-800 py-2 px-4 rounded-full shadow-lg">
          {userInfo?.vipUser && (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-medium text-sm',
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                )}
              >
                {isRecording ? (
                  <>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
                    </span>
                    <Square className="w-3.5 h-3.5" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Record</span>
                  </>
                )}
              </button>

              <div className="h-8 w-[1px] bg-gray-500 dark:bg-gray-600 mx-1" />

              {/* Translation Dropdown Menu */}
              <div className="flex items-center gap-2 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full transition-all font-medium text-sm',
                      isListening || signLanguageRecognition.isActive
                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    {isListening || signLanguageRecognition.isActive ? (
                      <>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-400" />
                        </span>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <Languages className="w-3.5 h-3.5" />
                        </div>
                        <span>Translation</span>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <Languages className="w-3.5 h-3.5" />
                        </div>
                        <span>Translation</span>
                      </>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={() => {
                        // Stop Sign Language if active
                        if (signLanguageRecognition.isActive) {
                          signLanguageRecognition.stopRecognition()
                        }
                        // Toggle Speech to Text
                        if (isListening) {
                          stopListening()
                        } else {
                          startListening()
                        }
                      }}
                      className={cn('flex items-center gap-2', isListening && 'bg-purple-100 dark:bg-purple-900')}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Speech to Text</span>
                      {isListening && (
                        <span className="ml-auto relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                        </span>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        // Stop Speech to Text if active
                        if (isListening) {
                          stopListening()
                        }
                        // Toggle Sign Language
                        if (signLanguageRecognition.isActive) {
                          signLanguageRecognition.stopRecognition()
                        } else {
                          signLanguageRecognition.startRecognition()
                        }
                      }}
                      className={cn(
                        'flex items-center gap-2',
                        signLanguageRecognition.isActive && 'bg-purple-100 dark:bg-purple-900'
                      )}
                    >
                      <Languages className="w-4 h-4" />
                      <span>Sign Language AI</span>
                      {signLanguageRecognition.isActive && (
                        <span className="ml-auto relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
                        </span>
                      )}
                    </DropdownMenuItem>
                    {(isListening || signLanguageRecognition.isActive) && (
                      <DropdownMenuItem
                        onClick={() => {
                          // Turn off both features
                          if (isListening) {
                            stopListening()
                          }
                          if (signLanguageRecognition.isActive) {
                            signLanguageRecognition.stopRecognition()
                          }
                        }}
                        className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <Square className="w-4 h-4" />
                        <span>Turn Off</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Select value={speechLang} onValueChange={(value) => setSpeechLang(value as 'vi-VN' | 'en-US')}>
                  <SelectTrigger className="h-8 rounded-full bg-gray-200 text-gray-800 text-sm font-medium px-3 w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="mb-2">
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Firebase Real-time Subtitle Display */}
      {hasJoinedRoom &&
        !meetingExpired &&
        roomID &&
        userInfo?.vipUser &&
        (isListening || signLanguageRecognition.isActive) && (
          <div className="fixed bottom-20 left-5 right-5 z-[997] max-w-2xl mx-auto">
            <FirebaseSubtitleDisplay meetingCode={roomID} currentUserId={userInfo?.id || ''} />
          </div>
        )}

      {hasJoinedRoom && !meetingExpired && (
        <SignLanguageDetector
          isActive={signLanguageRecognition.isActive}
          onGestureDetected={signLanguageRecognition.handleGestureDetected}
          onHandDetection={signLanguageRecognition.handleHandDetection}
        />
      )}

      {/* Sign Language Recognition Overlay */}
      {hasJoinedRoom && !meetingExpired && (
        <>
          <SignLanguageOverlay
            isActive={signLanguageRecognition.isActive}
            isConnected={signLanguageRecognition.isConnected}
            connectionStatus={signLanguageRecognition.connectionStatus}
            currentPrediction={signLanguageRecognition.currentPrediction}
            confidence={signLanguageRecognition.confidence}
            lastUpdate={signLanguageRecognition.lastUpdate}
            recentPredictions={signLanguageRecognition.recentPredictions}
            isVisible={signLanguageVisible}
            onToggleVisibility={() => setSignLanguageVisible(!signLanguageVisible)}
          />

          <SignLanguageToggleButton
            isVisible={signLanguageVisible}
            onToggle={() => setSignLanguageVisible(true)}
            isActive={signLanguageRecognition.isActive}
          />
        </>
      )}

      {meetingExpired && (
        <div className="fixed inset-0 bg-black/85 z-[1000] flex flex-col justify-center items-center text-white">
          <h2 className="text-2xl font-bold mb-4">Meeting Ended</h2>
          {meetingData && (
            <p className="mb-3 text-lg text-center max-w-md">The meeting &ldquo;{meetingData.title}&rdquo; has ended</p>
          )}
          <p className="mb-6">This meeting has reached its time limit</p>
          <button
            className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
            onClick={() => router.push('/meeting-room')}
          >
            Return to Meeting Rooms
          </button>
        </div>
      )}

      <FolderSelectionModal
        show={showFolderModal}
        folderName={folderName}
        customFolderName={customFolderName}
        setCustomFolderName={setCustomFolderName}
        onSelect={handleFolderSelect}
        onCustomSubmit={handleCustomFolderSubmit}
        onClose={() => setShowFolderModal(false)}
      />
    </>
  )
}
