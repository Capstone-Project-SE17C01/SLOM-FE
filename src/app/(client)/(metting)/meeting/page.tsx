'use client'
import * as React from 'react'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { useRecording } from '@/hooks/useRecording'
import { useRealSignLanguageRecognition } from '@/hooks/useRealSignLanguageRecognition'
import SignLanguageDetector from '@/components/SignLanguageDetector/SignLanguageDetector'
import { useEffect } from 'react'
import { useSpeechToText } from '@/hooks/useSpeechToText'
import { useFirebaseTest } from '@/hooks/useFirebaseTest'
import { Mic, Square, Languages, MessageCircle } from 'lucide-react'
import { generateZegoToken } from '@/services/zego/config'
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt'
import { SignLanguageOverlay, SignLanguageToggleButton } from '@/components/ui/signLanguageOverlay'
import { cn } from '@/utils/cn'
import { RootState } from '@/redux/store'
import { useAddRecordingMutation, useGetMeetingQuery, useLeaveMeetingMutation } from '@/api/MeetingApi'
import { FolderSelectionModal } from '@/components/layouts/meeting/folder-selection-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export default function MeetingPage() {
  const router = useRouter()
  const { userInfo } = useSelector((state: RootState) => state.auth)

  // Meeting states
  const [roomID, setRoomID] = React.useState('')
  const [hasJoinedRoom, setHasJoinedRoom] = React.useState(false)
  const [meetingExpired, setMeetingExpired] = React.useState(false)
  const [signLanguageVisible, setSignLanguageVisible] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  // Speech-to-text states
  const [speechLang, setSpeechLang] = React.useState<'vi-VN' | 'en-US'>('vi-VN')
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

  // Real AI Sign Language Recognition hook
  const signLanguageRecognition = useRealSignLanguageRecognition({
    confidenceThreshold: 70, // Only accept gestures with >70% confidence
    maxRecentPredictions: 20 // Keep last 20 predictions
  })

  // Firebase Test hook
  const firebaseTest = useFirebaseTest()

  // Auto show overlay when sign language recognition is activated
  React.useEffect(() => {
    if (signLanguageRecognition.isActive && !signLanguageVisible) {
      setSignLanguageVisible(true)
    }
  }, [signLanguageRecognition.isActive, signLanguageVisible])

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

  React.useEffect(() => {
    return () => {
      if (isListening) stopListening()
      resetTranscript()
      if (roomID && userInfo?.id) {
        leaveMeeting({ id: roomID, request: { userId: userInfo.id } })
      }
    }
  }, [leaveMeeting, roomID, userInfo, isListening, stopListening, resetTranscript])

  const joinZegoRoom = React.useCallback(
    async (element: HTMLDivElement) => {
      if (!element || !roomID || !userInfo?.id) return
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
          }
        })
      } catch (error) {
        console.error('Failed to join meeting:', error)
      }
    },
    [roomID, userInfo, isListening, stopListening, resetTranscript]
  )

  useEffect(() => {
    if (containerRef.current && roomID && userInfo?.id && !hasJoinedRoom) {
      joinZegoRoom(containerRef.current)
    }
  }, [roomID, userInfo?.id, joinZegoRoom, hasJoinedRoom])

  return (
    <>
      <div className="myCallContainer" ref={containerRef} style={{ height: '100vh', width: '100vw' }} />

      {/* Firebase Test Panel - Fixed position */}
      {roomID && (
        <div className="fixed top-4 left-4 z-[1000] bg-black/90 text-white p-4 rounded-lg max-w-sm">
          <h3 className="text-sm font-bold mb-3">🔥 Firebase Test Panel</h3>

          {/* Connection Status */}
          <div className="mb-3">
            <div className="flex items-center gap-2">
              <span className={cn('w-3 h-3 rounded-full', firebaseTest.isConnected ? 'bg-green-500' : 'bg-red-500')} />
              <span className="text-xs">{firebaseTest.isConnected ? 'Connected' : 'Disconnected'}</span>
              {firebaseTest.isLoading && <span className="text-xs text-yellow-400">Loading...</span>}
            </div>

            {firebaseTest.error && <div className="text-xs text-red-400 mt-1">Error: {firebaseTest.error}</div>}

            <div className="text-xs text-gray-400 mt-1">
              Last update: {new Date(firebaseTest.lastUpdate).toLocaleTimeString()}
            </div>
          </div>

          {/* Test Buttons */}
          <div className="space-y-2">
            <button
              onClick={firebaseTest.testConnection}
              disabled={firebaseTest.isLoading}
              className="w-full text-xs px-2 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
            >
              🧪 Test Connection
            </button>

            <button
              onClick={firebaseTest.readAllDatabase}
              disabled={firebaseTest.isLoading}
              className="w-full text-xs px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
            >
              📖 Read All DB
            </button>

            <button
              onClick={firebaseTest.createTestData}
              disabled={firebaseTest.isLoading}
              className="w-full text-xs px-2 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
            >
              🏗️ Create Test Data
            </button>

            <button
              onClick={() => {
                const unsubscribe = firebaseTest.startRealTimeListener()
                // Store unsubscribe function for later cleanup
                setTimeout(() => {
                  console.log('🔇 Auto-stopping listener after 30 seconds')
                  unsubscribe()
                }, 30000)
              }}
              disabled={firebaseTest.isLoading}
              className="w-full text-xs px-2 py-1 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded"
            >
              🎧 Start Listener (30s)
            </button>
          </div>

          {/* Data Preview */}
          {firebaseTest.allData && (
            <div className="mt-3 p-2 bg-gray-800 rounded text-xs">
              <div className="text-yellow-400 mb-1">📊 Live Data:</div>
              <div className="max-h-20 overflow-y-auto text-gray-300">
                {JSON.stringify(firebaseTest.allData, null, 1).substring(0, 200)}...
              </div>
            </div>
          )}
        </div>
      )}

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

              {/* Combined Speech to Text and Sign Language AI button */}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  onClick={() => {
                    if (isListening || signLanguageRecognition.isActive) {
                      // Stop both if either is active
                      if (isListening) stopListening()
                      if (signLanguageRecognition.isActive) signLanguageRecognition.stopRecognition()
                    } else {
                      // Start both
                      startListening()
                      signLanguageRecognition.startRecognition()
                    }
                  }}
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
                </button>

                <Select
                  value={speechLang}
                  onValueChange={(value) => setSpeechLang(value as 'vi-VN' | 'en-US')}
                >
                  <SelectTrigger className="h-8 rounded-full bg-gray-200 text-gray-800 text-sm font-medium px-3 w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="mb-2">
                    <SelectItem value="vi-VN">Tiếng Việt</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}

      {/* Combined Transcript Display */}
      {hasJoinedRoom &&
        !meetingExpired &&
        roomID &&
        userInfo?.vipUser &&
        (transcript || (signLanguageRecognition.isActive && signLanguageRecognition.fullTranscript)) && (
          <div className="fixed bottom-20 left-5 right-5 z-[997] max-w-2xl mx-auto">
            <div className="bg-black/80 text-white p-4 rounded-lg backdrop-blur-sm">
              {/* Tabs for switching between transcripts */}
              <div className="flex items-center gap-2 mb-3 border-b border-gray-700 pb-2">
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <Languages className="w-4 h-4" />
                  <span className="text-sm font-medium">Translation</span>
                </div>

                {/* Status indicators */}
                <div className="flex items-center gap-2 ml-auto">
                  {isListening && (
                    <div className="flex items-center gap-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                      </span>
                      <span className="text-xs text-blue-400">Speech</span>
                    </div>
                  )}

                  {signLanguageRecognition.isActive && (
                    <div className="flex items-center gap-1 ml-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                      </span>
                      <span className="text-xs text-green-400">Sign</span>
                    </div>
                  )}

                  {signLanguageRecognition.useFakeMode && (
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded ml-2">AI Enhanced Mode</span>
                  )}
                </div>
              </div>

              {/* Speech to Text Transcript */}
              {transcript && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-3 h-3 text-blue-400" />
                    <span className="text-xs font-medium text-blue-400">Speech to Text</span>
                  </div>
                  <p className="text-sm leading-relaxed">{transcript}</p>
                </div>
              )}

              {/* Sign Language Transcript */}
              {signLanguageRecognition.isActive && signLanguageRecognition.fullTranscript && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Languages className="w-3 h-3 text-green-400" />
                    <span className="text-xs font-medium text-green-400">Sign Language</span>
                  </div>
                  <p className="text-sm leading-relaxed">{signLanguageRecognition.fullTranscript}</p>
                </div>
              )}
            </div>
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
