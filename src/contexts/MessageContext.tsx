"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface MessageContextType {
  unreadCount: number;
  setUnreadCount: (count: number | ((prev: number) => number)) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};

interface MessageProviderProps {
  children: ReactNode;
}

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  return (
    <MessageContext.Provider value={{ unreadCount, setUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};
