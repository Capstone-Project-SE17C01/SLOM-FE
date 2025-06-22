import { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface UseSpeechToTextResult {
  transcript: string;
  isListening: boolean;
  startListening: (language?: string) => void;
  stopListening: () => void;
  resetTranscript: () => void;
  isSupported: boolean;
}

export const useSpeechToText = (): UseSpeechToTextResult => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setIsListening(listening);
  }, [listening]);

  const startListening = (language: string = 'vi-VN') => {
    if (browserSupportsSpeechRecognition) {
      SpeechRecognition.startListening({
        continuous: true,
        language: language
      });
    }
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: browserSupportsSpeechRecognition
  };
};