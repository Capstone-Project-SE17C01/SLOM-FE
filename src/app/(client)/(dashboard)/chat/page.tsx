"use client";
import { useEffect, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";
import { initSignalRConnection } from "@/services/signalR/config";
import { RootState } from "@/redux/store";
import { MessageBox } from "@/components/layouts/message/user-message-box";
import { SearchUserMessage } from "@/components/layouts/message/user-bar";
import { Message, User } from "@/types/IMessage";
import { SearchUser } from "@/components/layouts/message/user-search";
import UploadImage from "@/components/layouts/message/upload-image";
import Image from "next/image";
import { cn } from "@/utils/cn";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { Input } from "@/components/ui/input";
import { useMarkIsReadMutation } from "@/api/MessageApi";
import { useMessageContext } from "@/contexts/MessageContext";

function Page() {
  const t = useTranslations("unAuthenMessage");
  const t_chatPage = useTranslations("chatPage");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [listSearchedUser, setListSearchedUser] = useState<User[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[] | undefined>([]);
  const [existImages, setExistImages] = useState<string[] | undefined>([]);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const uploadImage = async (_callback: (urls: string[]) => void): Promise<string[]> => {
    if (!files?.length) return [];
    const promises = files.map(async f =>
      await uploadImageToCloudinary(f).then(res => res.url)
    );
    const urls = await Promise.all(promises);
    _callback(urls);
    return urls;
  }
  const [users, setUsers] = useState<User[]>([])
  const [markIsRead] = useMarkIsReadMutation();
  const { setUnreadCount } = useMessageContext();

  useEffect(() => {
    initSignalRConnection({
      userInfo,
      selectedUser,
      setMessages,
      onConnectionCreated: setConnection,
      setUsers
    });
  }, [selectedUser, userInfo]);

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-[70vh] border-1 bg-[#f0f0f0] dark:bg-[#23272f] rounded">
        <p className="dark:text-white">{t("loginPrompt")}</p>
      </div>
    );
  }

  const sendMessage = async (message: string, messageFiles: File[] = []) => {
    let sentImages: string[] = []
    if (connection && (message.trim() || messageFiles.length > 0)) {
      if (messageFiles.length > 0) {
        sentImages = await uploadImage(async (res : string[]) => {
          await connection.send(
            "PostMessage",
            message,
            userInfo.email,
            selectedUser?.email,
            res,
            userInfo?.avatarUrl
          );
        })
      } else {
        const emptyString : string[] = [];
        await connection.send(
          "PostMessage",
          message,
          userInfo.email,
          selectedUser?.email,
          emptyString,
          userInfo?.avatarUrl
        );
      }
    }

    let biggest = 0;
    messages.forEach((value) => {
      if (value.id > biggest) biggest = value.id;
    });

    setMessages((prev) => [
      ...prev,
      { id: biggest + 1, content: message, isSender: true, images: sentImages },
    ]);

    if (selectedUser && message.trim()) {
      const updatedUser: User = {
        id: 1,
        name: selectedUser.name,
        image: selectedUser.image,
        lastMessage: message.trim(),
        isSender: true,
        isSeen: true,
        lastSent: "just now",
        email: selectedUser.email,
      };

      setUsers((prev) => {
        const filteredPrev = prev.filter(
          (user) => user.email !== updatedUser.email
        );

        const updatedPrev = filteredPrev.map((user) => ({
          ...user,
          id: user.id + 1,
        }));

        return [updatedUser, ...updatedPrev];
      });
    }

    setFiles([]);
    setPreviews([]);
    setExistImages([]);
  };

  const handleUserSelect = (user: User) => {
    setCurrentPage(1)
    setMessages([]);
    setSelectedUser(user);
  };

  const removeItem = (index: number, src: string) => {
    if (src.includes('cloudinary') && setExistImages != undefined) {
      setExistImages(() => existImages?.filter(val => val != src))
    } else {
      setPreviews(prev => prev != undefined ? prev.filter((_, i) => i !== index) : prev)
      setFiles(prev => prev?.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="h-[70vh] flex">
      <div className="bg-white dark:bg-[#23272f] rounded-xl w-[20vw] pl-2.5 pr-2.5 pt-2.5 mr-5 shadow-md flex flex-col border border-1">
        <div className="pr-4 h-[80px] mb-[3%]">
          <h3 className="h-[50%] text-3xl font-bold dark:text-white">{t_chatPage("chat")}</h3>

          <div className="h-[50%] relative">
            <SearchUser
              isSearch={isSearch}
              setIsSearch={setIsSearch}
              setListSearchUser={setListSearchedUser}
            />
          </div>
        </div>

        {!isSearch && (
          <SearchUserMessage
            userId={userInfo.id ?? ""}
            handleUserSelect={handleUserSelect}
            setUsers={setUsers}
            users={users}
            setUnreadCount={setUnreadCount}
          />
        )}

        {isSearch && (
          <div className="flex-1 overflow-y-scroll">
            {listSearchedUser.map((user) => (
              <Button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="hover:bg-[#f5f5f5] dark:hover:bg-[#353945] bg-white dark:bg-[#23272f] text-black dark:text-white w-full h-[8vh] shadow-none"
              >
                <div className="w-full h-full flex items-center space-x-4">
                  {/* User Profile Image */}
                  <Avatar>
                    <AvatarImage
                      src={user.image}
                      alt={`${user.name}`}
                    />
                    <AvatarFallback>{user.name}</AvatarFallback>
                  </Avatar>

                  <div className="">
                    <div className="text-lg text-gray-900 dark:text-white text-left font-bold">
                      {user.name}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {selectedUser == null || selectedUser == undefined ? (
        <div className="bg-white dark:bg-[#23272f] rounded-xl shadow-md p-6 flex items-center justify-center flex-1 border border-1">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              {t_chatPage("noUserSelected")}
            </h2>
            <p className="text-gray-500 dark:text-gray-300">
              {t_chatPage("pleaseSelectOrFindUser")}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#23272f] rounded-xl flex flex-col shadow-md flex-1 border border-1">
          <div className="h-[50px] rounded-t-xl border-b px-2 flex items-center">
            <Button className="h-[90%] hover:bg-[#f5f5f5] dark:hover:bg-[#353945] bg-white dark:bg-[#23272f] shadow-none text-black dark:text-white w-auto p-0 px-2">
              <Avatar>
                <AvatarImage
                  src={selectedUser.image}
                  alt={`${selectedUser.name}`}
                />
                <AvatarFallback>{selectedUser.name}</AvatarFallback>
              </Avatar>
              <div className=" font-bold text-lg">{selectedUser?.name}</div>
            </Button>
          </div>

          <MessageBox
            messages={messages}
            setMessages={setMessages}
            userId={userInfo.id ?? ""}
            selectedUser={selectedUser}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />

          {selectedUser && (
            <div className="flex flex-col">

              <div className="min-h-[60px] flex items-center">
              <UploadImage
                  setFiles={setFiles}
                  images={[]}
                  setExistImages={setExistImages}
                  existImage={existImages}
                  previews={previews}
                  setPreviews={setPreviews}
                />

                <div className="w-[90%]">
                  {previews != undefined && previews.length != 0 ?
                    <div className="flex w-full bg-[#f3f3f5] p-2 rounded-t-xl border border-[#ccc] border-b-0">
                      {previews.map((src, i) => (
                        <div key={src} className="relative w-24 h-24 mr-2">
                          <button
                            onClick={() => removeItem(i, src)}
                            className="absolute -top-2 -right-2 bg-white rounded-full hover:bg-gray-200 transition z-10"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                          </button>

                          <Image
                            src={src}
                            alt={`preview-${i}`}
                            fill
                            className="object-cover rounded-xl"
                          />
                        </div>
                      ))}
                    </div> : <></>
                  }

                  <Input
                    type="text"
                    placeholder={t_chatPage("message")}
                    className={cn("h-[60%] w-full p-2.5 border border-[#ccc] dark:border-[#444] m-0 bg-[#f3f3f5] dark:bg-[#353945] text-black dark:text-white",
                      previews != undefined && previews.length != 0 ? "rounded-b-xl border-t-0 mb-1" : "rounded-xl"
                    )}
                    onFocus={async () => {
                      if (selectedUser && userInfo) {
                        try {
                          await markIsRead({
                            senderEmail: selectedUser.email,
                            receiverEmail: userInfo.email
                          }).unwrap();
                          setUsers((prev) => prev.map(user => user.email === selectedUser.email ? { ...user, isSeen: true } : user));
                          setUnreadCount(prev => Math.max(0, prev - 1));
                        } catch (error) {
                          console.error('Error marking messages as read:', error);
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      const target = e.target as HTMLInputElement;
                      if (e.key === "Enter" && (target.value.trim() !== "" || files.length > 0)) {
                        sendMessage(target.value, files);
                        target.value = "";
                      }
                    }}
                  />
                </div>

                <div className="flex justify-center items-center w-[5%] mx-2">
                  <div
                    className="h-10 w-10 rounded-full hover:bg-[#f5f5f5] dark:hover:bg-[#353945] bg-white dark:bg-[#23272f] shadow-none p-0 flex justify-center items-center cursor-pointer"
                    onClick={() => {
                      const input = document.querySelector('input[placeholder="Aa"]') as HTMLInputElement;
                      if (input && (input.value.trim() !== "" || files.length > 0)) {
                        sendMessage(input.value, files);
                        input.value = "";
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6 text-black dark:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
