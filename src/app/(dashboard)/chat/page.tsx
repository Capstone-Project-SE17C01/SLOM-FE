"use client";
import { useEffect, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";
import { SearchUser } from "@/features/message/components/user-search";
import type { Message, User } from "@/features/message/types";
import { SearchUserMessage } from "@/features/message/components/user-bar";
import { MessageBox } from "@/features/message/components/user-message-box";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { initSignalRConnection } from "@/features/message/signalR";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslations } from "next-intl";

function Page() {
  const t = useTranslations("unAuthenMessage");
  const [selectedUser, setSelectedUser] = useState<User>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isSearch, setIsSearch] = useState(false);
  const [listSearchedUser, setListSearchedUser] = useState<User[]>([]);

  const { userInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    initSignalRConnection({
      userInfo,
      selectedUser,
      setMessages,
      onConnectionCreated: setConnection,
    });
  }, [selectedUser, userInfo]);

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center h-[70vh] border-1 bg-[#f0f0f0] rounded">
        <p>{t("loginPrompt")}</p>
      </div>
    );
  }

  // send message
  const sendMessage = async (message: string) => {
    if (connection && message.trim()) {
      await connection.send(
        "PostMessage",
        message,
        userInfo.email,
        selectedUser?.email
      );
    }
    let biggest = 0;
    messages.forEach((value) => {
      if (value.id > biggest) biggest = value.id;
    });

    setMessages((prev) => [
      ...prev,
      { id: biggest + 1, content: message, isSender: true },
    ]);
  };

  const handleUserSelect = (user: User) => {
    setMessages([]);
    setSelectedUser(user);
  };

  return (
    <div className="h-[70vh] flex">
      {/* User list on the left */}
      <div className="bg-white rounded-xl w-[20vw] pl-2.5 pr-2.5 pt-2.5 mr-5 shadow-md flex flex-col border border-1">
        <div className="pr-4 h-[80px] mb-[3%]">
          <h3 className="h-[50%] text-3xl font-bold">Chat</h3>

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
          />
        )}

        {isSearch && (
          <div className="flex-1 overflow-y-scroll">
            {listSearchedUser.map((user) => (
              <Button
                key={user.id}
                onClick={() => handleUserSelect(user)}
                className="hover:bg-[#f5f5f5] bg-white text-black w-full h-[8vh] shadow-none"
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

                  {/* User Name and Last Message */}
                  <div className="">
                    <div className="text-lg  text-gray-900 text-left font-bold">
                      {user.name}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Chat area on the right */}
      {selectedUser == null || selectedUser == undefined ? (
        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center flex-1 border border-1">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No User Selected
            </h2>
            <p className="text-gray-500">
              Please select or find a user to view their details.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl flex flex-col shadow-md flex-1 border border-1">
          <div className="h-[50px] rounded-t-xl border-b px-2 flex items-center">
            <Button className="h-[90%] hover:bg-[#f5f5f5] bg-white shadow-none text-black w-auto p-0 px-2">
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
          />

          {/* Input to send messages */}
          {selectedUser && (
            <div className="h-[60px] flex items-center">
              <div className="w-[5%] flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Aa"
                className="h-[60%] rounded-full w-[90%] p-2.5 border border-[#ccc] m-0 bg-[#f3f3f5]"
                onKeyDown={(e) => {
                  const target = e.target as HTMLInputElement; // Type assertion here
                  if (e.key === "Enter" && target.value.trim() !== "") {
                    sendMessage(target.value); // Use the value from the input field
                    target.value = ""; // Clear input after sending
                  }
                }}
              />

              <div className="h-full flex justify-center items-center w-[5%]">
                <div className="h-[85%] w-[85%] rounded-full hover:bg-[#f5f5f5] bg-white shadow-none p-0 flex justify-center items-center cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6 text-black"
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
          )}
        </div>
      )}
    </div>
  );
}

export default Page;
