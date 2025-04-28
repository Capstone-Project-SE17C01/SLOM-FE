'use client'
import { useGetMessageByIdMutation } from "../api";
import type {
  MessageBoxProps,
  MessageRequest,
  Message,
  MessageResponse
} from "../types";
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";

export function MessageBox({ messages, setMessages, userId, selectedUser }: Readonly<MessageBoxProps>) {
    const [getMessageById] = useGetMessageByIdMutation();
    const chatContainerRef = useRef<HTMLDivElement | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadFull, setIsLoadFull] = useState(false);
    const scrollPositionRef = useRef<number | null>(null);

    const getMessage = useCallback(async (otherUserName: string | undefined, pageNumber: number) => {
      let getMessages : MessageResponse = { isLoadFullPage: false, data: []};
      try {
        if(otherUserName != "" && otherUserName != null && otherUserName != undefined) {
          const data : MessageRequest = { id: userId, otherUserName: otherUserName, pageNumber: pageNumber};
          const response : MessageResponse = await getMessageById(data).unwrap();
          getMessages = response;
        }
      } catch(error) {
        console.log(error);
      }
      return getMessages;
    }, [getMessageById, userId]);

    const handleScroll = useCallback(async (theMessage: Message[], theCurrentPage: number, isLoadFull: boolean) => {
      if (chatContainerRef.current && !isLoadFull) {
        if (chatContainerRef.current.scrollTop === 0) {
          const prevScrollHeight = chatContainerRef.current.scrollHeight;

          const response = await getMessage(selectedUser?.email, theCurrentPage);
          const data = [...response.data, ...theMessage];
        
          if (response.isLoadFullPage) {
            setIsLoadFull(true);
          }
        
          setCurrentPage(theCurrentPage + 1);
          scrollPositionRef.current = prevScrollHeight;
          setMessages(data);
        }
      }
    }, [getMessage, selectedUser?.email, setMessages]);

    useEffect(() => {
      const getTheMessage = async () => {
        const data = await getMessage(selectedUser?.email, 1);
        setCurrentPage(2)
        setIsLoadFull(false);
        setMessages(data.data);
      }
      getTheMessage();
    
      // Store the current chatContainer in a variable for the cleanup function
      const chatContainer = chatContainerRef.current;
      return () => {
        if (chatContainer) {
          chatContainer.scrollTop = chatContainer.scrollHeight;
        }
      };
    }, [selectedUser, getMessage, setMessages])

    useLayoutEffect(() => {
      if(chatContainerRef.current) {
        if ((currentPage == 1 || currentPage == 2)) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        } else if(scrollPositionRef.current) {
          const newScrollHeight = chatContainerRef.current.scrollHeight;
          chatContainerRef.current.scrollTop = newScrollHeight - scrollPositionRef.current;
          scrollPositionRef.current = null; // reset after use
        }
      }
    }, [messages, currentPage]);

    useEffect(() => {
      const div = chatContainerRef.current;
      if (div) {
        const onScroll = async () => {
          await handleScroll(messages, currentPage, isLoadFull);
        };

        div.addEventListener('scroll', onScroll);
        
        return () => {
          div.removeEventListener('scroll', onScroll);
        };
      }
    }, [messages, currentPage, isLoadFull, handleScroll]);

    return (
        <div className="flex-1 overflow-y-scroll p-2.5 bg-white" ref={chatContainerRef}>
            {messages.map((message) => (
              <div key={message.id} className={"flex w-full" + (message.isSender ? " justify-end" : " justify-start")}>
                <div className={"p-2 px-4 rounded-3xl max-w-[30%] break-all mb-0.5" + (message.isSender ? " bg-[#9c2cfc] text-white" : " bg-[#f0f0f0]")}>
                  <p>{message.content}</p>
                </div>
              </div>
            ))}
        </div>
    )
}