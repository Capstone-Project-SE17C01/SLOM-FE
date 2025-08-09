'use client'
import { useGetMessageByIdMutation } from "../../../api/MessageApi";
import type {
  MessageBoxProps,
  MessageRequest,
  Message,
  MessageResponse
} from "../../../types/IMessage";
import { useCallback, useEffect, useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";

export function MessageBox({ messages, setMessages, userId, selectedUser, currentPage, setCurrentPage }: Readonly<MessageBoxProps>) {
  const [getMessageById] = useGetMessageByIdMutation();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const [isLoadFull, setIsLoadFull] = useState(false);
  const scrollPositionRef = useRef<number | null>(null);

  const getMessage = useCallback(async (otherUserName: string | undefined, pageNumber: number) => {
    let getMessages: MessageResponse = { isLoadFullPage: false, data: [] };
    try {
      if (otherUserName != "" && otherUserName != null && otherUserName != undefined) {
        const data: MessageRequest = { id: userId, otherUserName: otherUserName, pageNumber: pageNumber };
        const response: MessageResponse = await getMessageById(data).unwrap();
        getMessages = response;
      }
    } catch (error) {
      console.error(error);
    }
    console.log(getMessages)
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
  }, [getMessage, selectedUser?.email, setMessages, setCurrentPage]);

  useEffect(() => {
    const getTheMessage = async () => {
      const data = await getMessage(selectedUser?.email, 1);
      setCurrentPage(2)
      setIsLoadFull(false);
      setMessages(data.data);
      console.log(data)
    }
    getTheMessage();

    const chatContainer = chatContainerRef.current;
    return () => {
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    };
  }, [selectedUser, getMessage, setMessages, setCurrentPage])

  useLayoutEffect(() => {
    if (chatContainerRef.current) {
      if ((currentPage == 1 || currentPage == 2)) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      } else if (scrollPositionRef.current) {
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
    <div className="flex-1 overflow-y-scroll p-2.5 bg-white dark:bg-[#18181b]" ref={chatContainerRef}>
      {messages.map((message) => (
        <div key={message.id}>
          {message.content && message.content.trim() !== "" && (
            <div className={"flex w-full" + (message.isSender ? " justify-end" : " justify-start")}>
              <div className={
                "p-2 px-4 rounded-3xl max-w-[30%] break-all mb-0.5" +
                (message.isSender
                  ? " bg-[#9c2cfc] dark:bg-[#7c1fc2] text-white"
                  : " bg-[#f0f0f0] dark:bg-[#27272a]")
              }>
                <p>{message.content}</p>
              </div>
            </div>
          )}
          {message.images != undefined && message.images?.length > 0 ? <div className={"flex w-full" + (message.isSender ? " justify-end" : " justify-start")}>
            <div className={`${message.images && message.images.length === 1 && message.isSender ? "flex justify-end" : ""} grid ${message.images && message.images.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-2 max-w-[400px] mb-0.5`}>
              {message.images.map(img => 
                <div key={img} className={`relative ${message.images && message.images.length === 1 && message.isSender ? "w-[200px]" : ""}`}>
                  <Image
                      src={img}
                      alt={`image`}
                      width={200} 
                      height={150}
                      className="object-cover rounded-2xl w-full h-32"
                  />
                </div>
              )}
            </div>
          </div>
            : <></>}
        </div>

      ))}
    </div>
  )
}