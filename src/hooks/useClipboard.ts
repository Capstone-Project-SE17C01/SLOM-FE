import { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';

export const useClipboard = () => {
  const t_meetingPage = useTranslations("meetingPage");
  const [isCopying, setIsCopying] = useState(false);
  const copyToClipboard = async (text: string) => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(text);
      toast.success(t_meetingPage("copiedToClipboard"), {
        icon: React.createElement(Check, {
          className: "h-4 w-4 text-green-500 copy-success"
        }),
        description: t_meetingPage("shareLinkWithOthersToJoinYourMeeting"),
        duration: 2000,
      });
    } catch (error) {
      console.error("Failed to copy text: ", error);
    } finally {
      setIsCopying(false);
    }
  };
  return {
    copyToClipboard,
    isCopying,
  };
};

