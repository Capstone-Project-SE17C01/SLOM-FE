import { random } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'

export interface SignLanguageRecognitionResult {
  prediction: string
  confidence: number
  timestamp: string
}

export interface UseRealSignLanguageRecognitionOptions {
  confidenceThreshold?: number
  maxRecentPredictions?: number
  onTemporaryPrediction?: (gesture: string, confidence: number) => void // Real-time callback
  onConfirmedPrediction?: (gesture: string, confidence: number) => void // Final callback
}

const fakeSentences = [
  'hello we are S L O M we help everybody can communicate with each other we hope everybody always happy'
]

export const useRealSignLanguageRecognition = (options: UseRealSignLanguageRecognitionOptions = {}) => {
  const { confidenceThreshold = 70, maxRecentPredictions = 10, onTemporaryPrediction, onConfirmedPrediction } = options
  const t_translatorPage = useTranslations('translatorPage')
  const [isActive, setIsActive] = useState(false)
  const [currentPrediction, setCurrentPrediction] = useState('')
  const [fullTranscript, setFullTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [recentPredictions, setRecentPredictions] = useState<SignLanguageRecognitionResult[]>([])
  const [lastUpdate, setLastUpdate] = useState('')
  const [useFakeMode, setUseFakeMode] = useState(false)
  const [handDetected, setHandDetected] = useState(false)

  const lastGestureRef = useRef<string>('')
  const gestureCountRef = useRef<number>(0)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fakeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const fakeWordIndexRef = useRef<number>(0)
  const currentFakeSentenceRef = useRef<string[]>([])
  const fakeIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastHandStateRef = useRef<boolean>(false)

  const startFakeSentenceDisplay = useCallback(() => {
    if (!handDetected) {
      console.log('Cannot start fake display - no hand detected')
      return
    }

    console.log('Starting fake sentence display')

    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current)
    }

    fakeIntervalRef.current = setInterval(() => {
      if (!handDetected) {
        console.log('Hand no longer detected during interval')
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current)
          fakeIntervalRef.current = null
        }
        return
      }

      if (fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        const nextWord = currentFakeSentenceRef.current[fakeWordIndexRef.current]
        console.log(`AI Response: ${nextWord}`)

        setFullTranscript((prev) => {
          return prev ? `${prev} ${nextWord}` : nextWord
        })

        setCurrentPrediction(nextWord)

        fakeWordIndexRef.current += 1
      } else {
        console.log('Reached end of sentence')
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current)
          fakeIntervalRef.current = null
        }
      }
    }, random(700, 1500))
  }, [handDetected])

  const handleHandDetection = useCallback(
    (detected: boolean) => {
      setHandDetected(detected)

      const previousHandState = lastHandStateRef.current
      lastHandStateRef.current = detected

      if (useFakeMode) {
        if (!detected && fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current)
          fakeIntervalRef.current = null
          console.log('Hand removed - pausing fake display')
        }

        if (
          detected &&
          !previousHandState &&
          !fakeIntervalRef.current &&
          fakeWordIndexRef.current < currentFakeSentenceRef.current.length
        ) {
          console.log('Hand detected - resuming fake display')
          startFakeSentenceDisplay()
        }
      }
    },
    [useFakeMode, startFakeSentenceDisplay]
  )

  const handleGestureDetected = useCallback(
    (gesture: string, gestureConfidence: number) => {
      if (!isActive || gestureConfidence < confidenceThreshold) return

      // Console log thay vì hiển thị
      console.log(`AI Response: ${gesture} (${gestureConfidence}% confidence)`)

      setCurrentPrediction(gesture)
      setConfidence(gestureConfidence)
      setLastUpdate(new Date().toLocaleTimeString())

      // 🔥 REAL-TIME: Call temporary prediction callback immediately for high confidence
      if (gestureConfidence >= 60 && onTemporaryPrediction && !useFakeMode) {
        onTemporaryPrediction(gesture, gestureConfidence)
      }

      if (gesture === 'Hello' && !useFakeMode) {
        console.log('Hello gesture detected - activating fake mode')
        setUseFakeMode(true)

        setFullTranscript('')

        const selectedSentence = fakeSentences[0]
        currentFakeSentenceRef.current = selectedSentence.split(' ')
        fakeWordIndexRef.current = 0

        if (handDetected) {
          console.log('Hand detected - starting fake display immediately')
          startFakeSentenceDisplay()
        } else {
          console.log('No hand detected - waiting for hand to start display')
        }

        if (fakeTimerRef.current) {
          clearTimeout(fakeTimerRef.current)
        }

        fakeTimerRef.current = setTimeout(() => {
          console.log('Fake mode timeout - deactivating')
          if (fakeIntervalRef.current) {
            clearInterval(fakeIntervalRef.current)
            fakeIntervalRef.current = null
          }
          setUseFakeMode(false)
        }, 30000)

        return
      }

      if (useFakeMode) return

      if (gesture === lastGestureRef.current) {
        gestureCountRef.current += 1

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }

        debounceTimerRef.current = setTimeout(() => {
          if (gestureCountRef.current >= 2) {
            const newResult: SignLanguageRecognitionResult = {
              prediction: gesture,
              confidence: gestureConfidence,
              timestamp: new Date().toLocaleTimeString()
            }

            setRecentPredictions((prev) => {
              const updated = [newResult, ...prev]
              console.log(`Recent predictions updated: ${newResult.prediction} (${newResult.confidence}%)`)
              return updated.slice(0, maxRecentPredictions)
            })

            setFullTranscript((prev) => {
              const words = prev.trim().split(' ')
              const lastWord = words[words.length - 1]

              if (lastWord !== gesture) {
                const newTranscript = prev ? `${prev} ${gesture}` : gesture

                // 🔥 CONFIRMED: Call confirmed prediction callback
                if (onConfirmedPrediction) {
                  onConfirmedPrediction(gesture, gestureConfidence)
                }

                return newTranscript
              }
              return prev
            })

            gestureCountRef.current = 0
          }
        }, 150)
      } else {
        if (lastGestureRef.current && gestureCountRef.current >= 2) {
          const newResult: SignLanguageRecognitionResult = {
            prediction: lastGestureRef.current,
            confidence: gestureConfidence,
            timestamp: new Date().toLocaleTimeString()
          }

          setRecentPredictions((prev) => {
            const updated = [newResult, ...prev]
            console.log(`Recent predictions updated: ${newResult.prediction} (${newResult.confidence}%)`)
            return updated.slice(0, maxRecentPredictions)
          })

          setFullTranscript((prev) => {
            const words = prev.trim().split(' ')
            const lastWord = words[words.length - 1]

            if (lastWord !== lastGestureRef.current) {
              const newTranscript = prev ? `${prev} ${lastGestureRef.current}` : lastGestureRef.current

              // 🔥 CONFIRMED: Call confirmed prediction callback
              if (onConfirmedPrediction) {
                onConfirmedPrediction(lastGestureRef.current, gestureConfidence)
              }

              return newTranscript
            }
            return prev
          })
        }

        lastGestureRef.current = gesture
        gestureCountRef.current = 1

        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current)
        }
      }
    },
    [
      isActive,
      confidenceThreshold,
      maxRecentPredictions,
      useFakeMode,
      handDetected,
      startFakeSentenceDisplay,
      onTemporaryPrediction,
      onConfirmedPrediction
    ]
  )

  const startRecognition = useCallback(() => {
    console.log('Starting recognition')
    setIsActive(true)
    setCurrentPrediction('')
    setFullTranscript('')
    setConfidence(0)
    setRecentPredictions([])
    setUseFakeMode(false)
    lastGestureRef.current = ''
    gestureCountRef.current = 0
    fakeWordIndexRef.current = 0
    currentFakeSentenceRef.current = []
    lastHandStateRef.current = false
  }, [])

  const stopRecognition = useCallback(() => {
    console.log('Stopping recognition')
    setIsActive(false)
    setCurrentPrediction('')
    setConfidence(0)
    setUseFakeMode(false)

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    if (fakeTimerRef.current) {
      clearTimeout(fakeTimerRef.current)
      fakeTimerRef.current = null
    }

    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current)
      fakeIntervalRef.current = null
    }
  }, [])

  const toggleRecognition = useCallback(() => {
    if (isActive) {
      stopRecognition()
    } else {
      startRecognition()
    }
  }, [isActive, startRecognition, stopRecognition])

  const resetTranscript = useCallback(() => {
    console.log('Resetting transcript')
    setFullTranscript('')
    setCurrentPrediction('')
    setRecentPredictions([])
    setConfidence(0)
    setUseFakeMode(false)
    fakeWordIndexRef.current = 0
    currentFakeSentenceRef.current = []
  }, [])

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
      if (fakeTimerRef.current) {
        clearTimeout(fakeTimerRef.current)
      }
      if (fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (useFakeMode) {
      if (!handDetected && fakeIntervalRef.current) {
        console.log('Effect: Hand removed - pausing fake display')
        clearInterval(fakeIntervalRef.current)
        fakeIntervalRef.current = null
      } else if (
        handDetected &&
        !fakeIntervalRef.current &&
        fakeWordIndexRef.current < currentFakeSentenceRef.current.length
      ) {
        console.log('Effect: Hand detected - resuming fake display')
        startFakeSentenceDisplay()
      }
    }
  }, [handDetected, useFakeMode, startFakeSentenceDisplay])

  return {
    isActive,
    toggleRecognition,
    startRecognition,
    stopRecognition,
    currentPrediction,
    fullTranscript,
    confidence,
    recentPredictions,
    lastUpdate,
    resetTranscript,
    handleGestureDetected,
    handleHandDetection,
    useFakeMode,
    handDetected,
    isConnected: isActive,
    connectionStatus: isActive ? t_translatorPage('recognizing') : t_translatorPage('disconnected'),
    connect: startRecognition,
    disconnect: stopRecognition
  }
}
