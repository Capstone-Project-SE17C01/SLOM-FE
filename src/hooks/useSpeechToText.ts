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
    setTranscript("");
    setIsListening(true);
    setIsTranslated(false);
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(options.subscriptionKey, options.region);
    speechConfig.speechRecognitionLanguage = options.fromLang;
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
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
      recognizer.close();
      recognizerRef.current = null;
    };
    recognizer.canceled = () => {
      setIsListening(false);
      recognizer.close();
      recognizerRef.current = null;
    };
    recognizer.startContinuousRecognitionAsync();
    recognizerRef.current = recognizer;
  };
  const stopListening = () => {
    setIsListening(false);
    recognizerRef.current?.stopContinuousRecognitionAsync(() => {
      recognizerRef.current?.close();
      recognizerRef.current = null;
    });
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
