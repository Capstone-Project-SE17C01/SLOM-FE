import RealTimeTranslator from "@/components/layouts/translator/real-time-translator";
import UploadVideoTranslator from "@/components/layouts/translator/upload-video-translator";

export default function TranslatorPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign Language Translator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time translation and video analysis for sign language
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RealTimeTranslator />
        <UploadVideoTranslator />
      </div>
    </div>
  );
}
