import { useState } from 'react';
import { toast } from 'sonner';
import { Check } from 'lucide-react';
import React from 'react';

export const useClipboard = () => {
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      setIsCopying(true);
      await navigator.clipboard.writeText(text);
      toast.success(successMessage || "Copied to clipboard", {
        icon: React.createElement(Check, { 
          className: "h-4 w-4 text-green-500 copy-success" 
        }),
        description: "Share this link with others to join your meeting.",
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
