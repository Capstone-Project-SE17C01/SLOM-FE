import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechSynthesisOptions {
  language?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useSpeechSynthesis = ({
  language = "en-US",
  rate = 1,
  pitch = 1,
  volume = 1,
}: UseSpeechSynthesisOptions = {}) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const synth = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const lastSpokenTextRef = useRef<string>("");

  // Kiểm tra hỗ trợ và khởi tạo
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synth.current = window.speechSynthesis;
      setIsSupported(true);
      
      // Lấy danh sách voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);
        
        // Chọn voice phù hợp với ngôn ngữ
        const languageVoice = availableVoices.find(voice => voice.lang.includes(language.split('-')[0]));
        setCurrentVoice(languageVoice || availableVoices[0]);
      };
      
      // Chrome yêu cầu sự kiện voiceschanged
      if (synth.current.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }
      
      loadVoices();
      
      // Cleanup
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel();
        }
      };
    } else {
      setIsSupported(false);
      console.warn("Speech synthesis is not supported in this browser.");
    }
  }, [language]);

  // Phát âm một đoạn text
  const speak = useCallback((text: string, skipIfSame = true) => {
    if (!isSupported || !synth.current || !text) return;
    
    // Nếu text giống với text đã phát gần đây nhất và skipIfSame = true, không phát lại
    if (skipIfSame && text === lastSpokenTextRef.current) {
      return;
    }
    
    // Lưu lại text để kiểm tra trùng lặp
    lastSpokenTextRef.current = text;
    
    // Nếu đang phát, dừng lại
    if (synth.current.speaking) {
      synth.current.cancel();
    }
    
    // Tạo utterance mới
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    
    // Cấu hình
    if (currentVoice) utterance.voice = currentVoice;
    utterance.lang = language;
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    
    // Sự kiện
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onpause = () => setIsPaused(true);
    utterance.onresume = () => setIsPaused(false);
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
    };
    
    // Phát âm
    synth.current.speak(utterance);
  }, [isSupported, currentVoice, language, rate, pitch, volume]);
  
  // Dừng phát âm
  const cancel = useCallback(() => {
    if (!isSupported || !synth.current) return;
    synth.current.cancel();
    setIsSpeaking(false);
  }, [isSupported]);
  
  // Tạm dừng
  const pause = useCallback(() => {
    if (!isSupported || !synth.current) return;
    synth.current.pause();
    setIsPaused(true);
  }, [isSupported]);
  
  // Tiếp tục
  const resume = useCallback(() => {
    if (!isSupported || !synth.current) return;
    synth.current.resume();
    setIsPaused(false);
  }, [isSupported]);
  
  // Thay đổi voice
  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    currentVoice,
    speak,
    cancel,
    pause,
    resume,
    setVoice,
  };
}; 