import { useRef, useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
export interface UseSpeechToTextOptions {
  subscriptionKey: string;
  region: string;
  translatorKey: string;
  fromLang: "vi-VN" | "en-US";
  toLang: "vi" | "en";
}
export function useSpeechToText(options: UseSpeechToTextOptions) {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  const recognizerRef = useRef<SpeechSDK.SpeechRecognizer | null>(null);
  
  const startListening = () => {
    if (isListening) return;
    
    try {
      // Đảm bảo dừng và dọn dẹp recognizer cũ nếu còn tồn tại
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stopContinuousRecognitionAsync();
          recognizerRef.current.close();
          recognizerRef.current = null;
        } catch (err) {
          console.warn("Error cleaning up previous recognizer:", err);
        }
      }
      
      // Reset state
      setTranscript("");
      setIsTranslated(false);
      
      // Khởi tạo cấu hình
      const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(options.subscriptionKey, options.region);
      speechConfig.speechRecognitionLanguage = options.fromLang;
      
      // Kiểm tra quyền truy cập microphone trước khi khởi tạo
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
          const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
          
          // Đặt các event handlers
          recognizer.recognizing = (_s, e) => {
            // Only show original text for UI feedback, don't mark as translated
            setTranscript(e.result.text);
            setIsTranslated(false);
          };
          
          recognizer.recognized = async (_s, e) => {
            if (e.result.text) {
              const translated = await translateText(
                e.result.text,
                options.fromLang,
                options.toLang,
                options.translatorKey,
                options.region
              );
              setTranscript(translated);
              setIsTranslated(true); // Mark as translated for Firebase push
            }
          };
          
          recognizer.sessionStopped = () => {
            setIsListening(false);
            if (recognizerRef.current) {
              recognizerRef.current.close();
              recognizerRef.current = null;
            }
          };
          
          recognizer.canceled = (s, e) => {
            console.log(`CANCELED: Reason=${e.reason}`);
            if (e.reason === SpeechSDK.CancellationReason.Error) {
              console.error(`ERROR: ${e.errorCode} - ${e.errorDetails}`);
            }
            setIsListening(false);
            if (recognizerRef.current) {
              recognizerRef.current.close();
              recognizerRef.current = null;
            }
          };
          
          // Lưu tham chiếu trước khi bắt đầu nhận diện
          recognizerRef.current = recognizer;
          
          // Bắt đầu nhận diện và cập nhật state sau khi đã bắt đầu thành công
          recognizer.startContinuousRecognitionAsync(
            () => {
              console.log("Speech recognition started successfully");
              setIsListening(true);
            },
            (err) => {
              console.error("Error starting speech recognition:", err);
              setIsListening(false);
              if (recognizerRef.current) {
                recognizerRef.current.close();
                recognizerRef.current = null;
              }
            }
          );
        })
        .catch(err => {
          console.error("Microphone access denied or not available:", err);
          setIsListening(false);
        });
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      setIsListening(false);
    }
  };
  
  const stopListening = () => {
    if (!isListening || !recognizerRef.current) return;
    
    setIsListening(false);
    try {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          console.log("Speech recognition stopped successfully");
          if (recognizerRef.current) {
            recognizerRef.current.close();
            recognizerRef.current = null;
          }
        },
        (err) => {
          console.error("Error stopping speech recognition:", err);
          if (recognizerRef.current) {
            recognizerRef.current.close();
            recognizerRef.current = null;
          }
        }
      );
    } catch (error) {
      console.error("Error during stopListening:", error);
      if (recognizerRef.current) {
        try {
          recognizerRef.current.close();
        } catch (e) {
          console.warn("Error closing recognizer:", e);
        }
        recognizerRef.current = null;
      }
    }
  };
  
  return {
    transcript,
    isListening,
    isTranslated,
    startListening,
    stopListening,
    resetTranscript: () => {
      setTranscript("");
      setIsTranslated(false);
    },
  };
}

async function translateText(
  text: string,
  from: string,
  to: string,
  key: string,
  region: string
): Promise<string> {
  const endpoint = "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0"
    + `&from=${from.split("-")[0]}&to=${to}`;
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Ocp-Apim-Subscription-Region": region,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([{ Text: text }]),
  });
  const data = await res.json();
  return data?.[0]?.translations?.[0]?.text || text;
}
