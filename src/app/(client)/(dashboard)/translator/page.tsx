'use client'
import RealTimeTranslator from "@/components/layouts/translator/real-time-translator";
import UploadVideoTranslator from "@/components/layouts/translator/upload-video-translator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function TranslatorPage() {
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const isVip = userInfo?.vipUser === true;
  useEffect(() => { 
    console.log(userInfo);
    console.log(isVip);
  }, [isVip, userInfo]);
  return (
    <div className="container mx-auto max-w-6xl px-4 py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Sign Language Translator
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Real-time translation and video analysis for sign language
        </p>
      </div>

      {isVip ? (<Tabs defaultValue="realtime" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="realtime">Real-time Translation</TabsTrigger>
          <TabsTrigger value="upload">Video Upload Translation</TabsTrigger>
        </TabsList>
        <TabsContent value="realtime" className="mt-0">
          <RealTimeTranslator />
        </TabsContent>
        <TabsContent value="upload" className="mt-0">
          <UploadVideoTranslator />
        </TabsContent>
      </Tabs>) : (
        <UploadVideoTranslator />
      )}
    </div>
  );
}
