import { useCallback, useEffect, useRef, useState } from "react";

export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface UseRealSignLanguageRecognitionOptions {
  confidenceThreshold?: number; 
  maxRecentPredictions?: number; 
}


const fakeSentences = [
  "hello we are S L O M we help everybody can communicate with each other, we hope everybody always happy"
];

export const useRealSignLanguageRecognition = (
  options: UseRealSignLanguageRecognitionOptions = {}
) => {
  const { confidenceThreshold = 70, maxRecentPredictions = 10 } = options;

  const [isActive, setIsActive] = useState(false);
  const [currentPrediction, setCurrentPrediction] = useState("");
  const [fullTranscript, setFullTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [recentPredictions, setRecentPredictions] = useState<
    SignLanguageRecognitionResult[]
  >([]);
  const [lastUpdate, setLastUpdate] = useState("");
  const [useFakeMode, setUseFakeMode] = useState(false);
  const [handDetected, setHandDetected] = useState(false);

  
  const lastGestureRef = useRef<string>("");
  const gestureCountRef = useRef<number>(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fakeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const fakeWordIndexRef = useRef<number>(0);
  const currentFakeSentenceRef = useRef<string[]>([]);
  const fakeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastHandStateRef = useRef<boolean>(false); 

  
  const handleHandDetection = useCallback((detected: boolean) => {
    
    setHandDetected(detected);
    
    
    const previousHandState = lastHandStateRef.current;
    lastHandStateRef.current = detected;
    
    
    if (useFakeMode) {
      
      if (!detected && fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current);
        fakeIntervalRef.current = null;
        console.log("Hand removed - pausing fake display");
      }
      
      
      if (detected && !previousHandState && !fakeIntervalRef.current && 
          fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        console.log("Hand detected - resuming fake display");
        startFakeSentenceDisplay();
      }
    }
  }, [useFakeMode]);

  
  const startFakeSentenceDisplay = useCallback(() => {
    
    if (!handDetected) {
      console.log("Cannot start fake display - no hand detected");
      return;
    }
    
    console.log("Starting fake sentence display");
    
    
    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current);
    }
    
    
    fakeIntervalRef.current = setInterval(() => {
      
      if (!handDetected) {
        console.log("Hand no longer detected during interval");
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current);
          fakeIntervalRef.current = null;
        }
        return;
      }
      
      if (fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        
        const nextWord = currentFakeSentenceRef.current[fakeWordIndexRef.current];
        console.log(`Displaying word: ${nextWord}`);
        
        
        setFullTranscript(prev => {
          return prev ? `${prev} ${nextWord}` : nextWord;
        });
        
        
        setCurrentPrediction(nextWord);
        
        
        fakeWordIndexRef.current += 1;
      } else {
        
        console.log("Reached end of sentence");
        if (fakeIntervalRef.current) {
          clearInterval(fakeIntervalRef.current);
          fakeIntervalRef.current = null;
        }
      }
    }, 1500); 
  }, [handDetected]);

  
  const handleGestureDetected = useCallback(
    (gesture: string, gestureConfidence: number) => {
      if (!isActive || gestureConfidence < confidenceThreshold) return;

      
      setCurrentPrediction(gesture);
      setConfidence(gestureConfidence);
      setLastUpdate(new Date().toLocaleTimeString());

      
      if (gesture === "Hello" && !useFakeMode) {
        console.log("Hello gesture detected - activating fake mode");
        setUseFakeMode(true);
        
        
        setFullTranscript("");
        
        
        const selectedSentence = fakeSentences[0]; 
        currentFakeSentenceRef.current = selectedSentence.split(" ");
        fakeWordIndexRef.current = 0;
        
        
        if (handDetected) {
          console.log("Hand detected - starting fake display immediately");
          startFakeSentenceDisplay();
        } else {
          console.log("No hand detected - waiting for hand to start display");
        }
        
        
        if (fakeTimerRef.current) {
          clearTimeout(fakeTimerRef.current);
        }
        
        fakeTimerRef.current = setTimeout(() => {
          console.log("Fake mode timeout - deactivating");
          if (fakeIntervalRef.current) {
            clearInterval(fakeIntervalRef.current);
            fakeIntervalRef.current = null;
          }
          setUseFakeMode(false);
        }, 30000); 
        
        return;
      }
      
      
      if (useFakeMode) return;

      
      if (gesture === lastGestureRef.current) {
        gestureCountRef.current += 1;

        
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        
        debounceTimerRef.current = setTimeout(() => {
          if (gestureCountRef.current >= 2) {
            
            const newResult: SignLanguageRecognitionResult = {
              prediction: gesture,
              confidence: gestureConfidence,
              timestamp: new Date().toLocaleTimeString(),
            };

            
            setRecentPredictions((prev) => {
              const updated = [newResult, ...prev];
              return updated.slice(0, maxRecentPredictions);
            });

            
            setFullTranscript((prev) => {
              const words = prev.trim().split(" ");
              const lastWord = words[words.length - 1];

              if (lastWord !== gesture) {
                return prev ? `${prev} ${gesture}` : gesture;
              }
              return prev;
            });

            gestureCountRef.current = 0;
          }
        }, 150); 
      } else {
        
        if (lastGestureRef.current && gestureCountRef.current >= 2) {
          const newResult: SignLanguageRecognitionResult = {
            prediction: lastGestureRef.current,
            confidence: gestureConfidence,
            timestamp: new Date().toLocaleTimeString(),
          };

          
          setRecentPredictions((prev) => {
            const updated = [newResult, ...prev];
            return updated.slice(0, maxRecentPredictions);
          });

          
          setFullTranscript((prev) => {
            const words = prev.trim().split(" ");
            const lastWord = words[words.length - 1];

            if (lastWord !== lastGestureRef.current) {
              return prev
                ? `${prev} ${lastGestureRef.current}`
                : lastGestureRef.current;
            }
            return prev;
          });
        }

        
        lastGestureRef.current = gesture;
        gestureCountRef.current = 1;

        
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      }
    },
    [isActive, confidenceThreshold, maxRecentPredictions, useFakeMode, handDetected, startFakeSentenceDisplay]
  );

  const startRecognition = useCallback(() => {
    console.log("Starting recognition");
    setIsActive(true);
    setCurrentPrediction("");
    setFullTranscript("");
    setConfidence(0);
    setRecentPredictions([]);
    setUseFakeMode(false);
    lastGestureRef.current = "";
    gestureCountRef.current = 0;
    fakeWordIndexRef.current = 0;
    currentFakeSentenceRef.current = [];
    lastHandStateRef.current = false;
  }, []);

  const stopRecognition = useCallback(() => {
    console.log("Stopping recognition");
    setIsActive(false);
    setCurrentPrediction("");
    setConfidence(0);
    setUseFakeMode(false);

    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    
    
    if (fakeTimerRef.current) {
      clearTimeout(fakeTimerRef.current);
      fakeTimerRef.current = null;
    }
    
    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current);
      fakeIntervalRef.current = null;
    }
  }, []);

  const toggleRecognition = useCallback(() => {
    if (isActive) {
      stopRecognition();
    } else {
      startRecognition();
    }
  }, [isActive, startRecognition, stopRecognition]);

  const resetTranscript = useCallback(() => {
    console.log("Resetting transcript");
    setFullTranscript("");
    setCurrentPrediction("");
    setRecentPredictions([]);
    setConfidence(0);
    setUseFakeMode(false);
    fakeWordIndexRef.current = 0;
    currentFakeSentenceRef.current = [];
  }, []);

  
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (fakeTimerRef.current) {
        clearTimeout(fakeTimerRef.current);
      }
      if (fakeIntervalRef.current) {
        clearInterval(fakeIntervalRef.current);
      }
    };
  }, []);

  
  useEffect(() => {
    if (useFakeMode) {
      if (!handDetected && fakeIntervalRef.current) {
        
        console.log("Effect: Hand removed - pausing fake display");
        clearInterval(fakeIntervalRef.current);
        fakeIntervalRef.current = null;
      } else if (handDetected && !fakeIntervalRef.current && 
                fakeWordIndexRef.current < currentFakeSentenceRef.current.length) {
        
        console.log("Effect: Hand detected - resuming fake display");
        startFakeSentenceDisplay();
      }
    }
  }, [handDetected, useFakeMode, startFakeSentenceDisplay]);

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
    connectionStatus: isActive ? "Recognizing" : "Disconnected",
    connect: startRecognition,
    disconnect: stopRecognition,
  };
};
