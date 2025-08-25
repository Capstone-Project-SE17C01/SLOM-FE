import { random } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export interface SignLanguageRecognitionResult {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export interface UseRealSignLanguageRecognitionOptions {
  confidenceThreshold?: number; 
  maxRecentPredictions?: number; 
}


const fakeSentencesDictionary: Record<string, string> = {
  "Hello Me": "Name N H A N, I am happy today.",
  "Yes Me": "Deaf person, I like to meet friends.",
  "Ok Please": "Learn together, it makes me smile.",
  "Tell Me": "Thankyou sign, it is easy practice",
  "Bye Me": "Meet tomorrow, I am excited again"
};

export const useRealSignLanguageRecognition = (
  options: UseRealSignLanguageRecognitionOptions = {}
) => {
  const { confidenceThreshold = 60, maxRecentPredictions = 10 } = options;
  const t_translatorPage = useTranslations("translatorPage");
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
    
    // Kiểm tra nếu không có câu fake hoặc đã hiển thị hết
    if (currentFakeSentenceRef.current.length === 0 || 
        fakeWordIndexRef.current >= currentFakeSentenceRef.current.length) {
      console.log("No fake sentence to display or already completed");
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
        console.log(`AI Response: ${nextWord}`);
        
        
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
        
        // Không reset fake mode ngay lập tức để cho phép người dùng thấy câu hoàn chỉnh
        // Sẽ được reset khi có gesture mới hoặc timeout
      }
    }, random(700, 1500)); 
  }, [handDetected]);

  
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

  // 🔥 FIX: Thêm hàm để reset trạng thái fake mode sau khi hoàn thành
  const resetFakeMode = useCallback(() => {
    console.log("Resetting fake mode state");
    setUseFakeMode(false);
    lastGestureRef.current = "";
    fakeWordIndexRef.current = 0;
    currentFakeSentenceRef.current = [];
    
    if (fakeTimerRef.current) {
      clearTimeout(fakeTimerRef.current);
      fakeTimerRef.current = null;
    }
    
    if (fakeIntervalRef.current) {
      clearInterval(fakeIntervalRef.current);
      fakeIntervalRef.current = null;
    }
  }, []);

  // 🔥 FIX: Cải thiện việc phát hiện trigger phrase đầu tiên
  const handleGestureDetected = useCallback(
    (gesture: string, gestureConfidence: number) => {
      if (!isActive || gestureConfidence < confidenceThreshold) return;

      console.log(`AI Response: ${gesture} (${gestureConfidence}% confidence)`);
      
      // 🔥 FIX: Luôn update UI ngay lập tức cho mọi gesture
      setCurrentPrediction(gesture);
      setConfidence(gestureConfidence);
      setLastUpdate(new Date().toLocaleTimeString());

      // 🔥 FIX: Kiểm tra nếu đã hoàn thành hiển thị câu fake
      if (useFakeMode && fakeWordIndexRef.current >= currentFakeSentenceRef.current.length && currentFakeSentenceRef.current.length > 0) {
        console.log("Fake sentence completed, resetting fake mode");
        resetFakeMode();
        
        // Thêm gesture hiện tại vào transcript thực
        setFullTranscript((prev) => {
          return prev ? `${prev} ${gesture}` : gesture;
        });
        
        return;
      }

      // 🔥 FIX: Xử lý fake mode VÀ real gestures song song
      let isTriggerWord = false;
      
      // Check if this is a trigger word for fake mode
      // 🔥 FIX: Kiểm tra cả từ đầu tiên và từ thứ hai của tất cả các trigger phrase
      const allTriggerWords = new Set<string>();
      Object.keys(fakeSentencesDictionary).forEach(key => {
        const words = key.split(" ");
        words.forEach(word => allTriggerWords.add(word));
      });
      
      const isAnyTriggerWord = allTriggerWords.has(gesture);
      
      if (isAnyTriggerWord && !useFakeMode) {
        console.log(`${gesture} gesture detected - starting fake mode`);
        setUseFakeMode(true);
        setFullTranscript("");
        lastGestureRef.current = gesture;
        currentFakeSentenceRef.current = [];
        fakeWordIndexRef.current = 0;
        isTriggerWord = true;
        
        if (handDetected) {
          startFakeSentenceDisplay();
        }
        
        if (fakeTimerRef.current) {
          clearTimeout(fakeTimerRef.current);
        }
        
        fakeTimerRef.current = setTimeout(() => {
          console.log("Trigger phrase timeout - deactivating fake mode");
          resetFakeMode();
        }, 15000); // 🔥 FIX: Tăng thời gian lên 15 giây
      }

      // 🔥 FIX: PAUSE real gesture recognition khi fake mode đang chạy VÀ đang hiển thị câu fake
      if (useFakeMode && fakeIntervalRef.current && currentFakeSentenceRef.current.length > 0) {
        console.log("Fake mode active - pausing real gesture recognition");
        // Chỉ xử lý trigger phrases, không xử lý real gestures
        return;
      }

      // 🔥 FIX: Chỉ xử lý real gesture khi KHÔNG trong fake mode hoặc fake mode đã xong
      if (gesture !== lastGestureRef.current || !isTriggerWord) {
        const newResult: SignLanguageRecognitionResult = {
          prediction: gesture,
          confidence: gestureConfidence,
          timestamp: new Date().toLocaleTimeString(),
        };

        setRecentPredictions((prev) => {
          const updated = [newResult, ...prev];
          console.log(`Real gesture detected: ${newResult.prediction} (${newResult.confidence}%)`);
          return updated.slice(0, maxRecentPredictions);
        });

        // 🔥 FIX: Chỉ update transcript nếu không phải trigger word hoặc đã hoàn thành fake mode
        if (!isTriggerWord || !useFakeMode) {
          setFullTranscript((prev) => {
            const words = prev.trim().split(" ");
            const lastWord = words[words.length - 1];

            if (lastWord !== gesture) {
              return prev ? `${prev} ${gesture}` : gesture;
            }
            return prev;
          });
        }

        lastGestureRef.current = gesture;
        gestureCountRef.current = 1;
      } else {
        gestureCountRef.current += 1;
        setConfidence(gestureConfidence);
      }

      // FIX: Xử lý trigger phrase completion từ chuỗi gesture
      if (useFakeMode && lastGestureRef.current && !isTriggerWord) {
        const potentialTriggerPhrase = `${lastGestureRef.current} ${gesture}`;
        
        if (fakeSentencesDictionary[potentialTriggerPhrase]) {
          console.log(`Trigger phrase completed: "${potentialTriggerPhrase}"`);
          
          // 🔥 FIX: Chỉ lấy câu fake, không ghép trigger phrase
          const fakeSentence = fakeSentencesDictionary[potentialTriggerPhrase];
          currentFakeSentenceRef.current = fakeSentence.split(" ");
          fakeWordIndexRef.current = 0;
          
          if (handDetected) {
            startFakeSentenceDisplay();
          }
          
          if (fakeTimerRef.current) {
            clearTimeout(fakeTimerRef.current);
          }
          
          fakeTimerRef.current = setTimeout(() => {
            console.log("Fake sentence display timeout - deactivating");
            resetFakeMode();
          }, 30000);
        }
      }

      // FIX: Check trigger phrases từ chuỗi gesture liên tục
      if (useFakeMode && lastGestureRef.current) {
        // 🔥 FIX: Lấy nhiều gesture gần đây hơn để check trigger phrases
        const recentGestures = recentPredictions.slice(0, 5).map(p => p.prediction);
        const gestureSequence = [lastGestureRef.current, ...recentGestures, gesture];
        
        // 🔥 FIX: Check tất cả các cặp từ có thể, không chỉ các cặp liên tiếp
        for (let i = 0; i < gestureSequence.length; i++) {
          for (let j = i + 1; j < gestureSequence.length; j++) {
            const phrase = `${gestureSequence[i]} ${gestureSequence[j]}`;
            
            if (fakeSentencesDictionary[phrase]) {
              console.log(`🎯 Trigger phrase detected from sequence: "${phrase}"`);
              
              // 🔥 FIX: Chỉ lấy câu fake, không ghép trigger phrase
              const fakeSentence = fakeSentencesDictionary[phrase];
              currentFakeSentenceRef.current = fakeSentence.split(" ");
              fakeWordIndexRef.current = 0;
              
              if (handDetected) {
                startFakeSentenceDisplay();
              }
              
              if (fakeTimerRef.current) {
                clearTimeout(fakeTimerRef.current);
              }
              
              fakeTimerRef.current = setTimeout(() => {
                console.log("Fake sentence display timeout - deactivating");
                resetFakeMode();
              }, 60000); // 🔥 FIX: Tăng thời gian lên 60 giây
              
              return; // Thoát ngay khi tìm thấy cặp từ hợp lệ
            }
          }
        }
      }
    },
    [isActive, confidenceThreshold, maxRecentPredictions, useFakeMode, handDetected, startFakeSentenceDisplay, recentPredictions, resetFakeMode]
  );

  const stopRecognition = useCallback(() => {
    console.log("Stopping recognition");
    setIsActive(false);
    setCurrentPrediction("");
    setConfidence(0);
    
    // Sử dụng resetFakeMode để dọn dẹp trạng thái fake mode
    resetFakeMode();
    
    // Xử lý debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, [resetFakeMode]);

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
    
    // Sử dụng resetFakeMode để dọn dẹp trạng thái fake mode
    resetFakeMode();
  }, [resetFakeMode]);

  
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
    connectionStatus: isActive ? t_translatorPage("recognizing") : t_translatorPage("disconnected"),
    connect: startRecognition,
    disconnect: stopRecognition,
  };
};
