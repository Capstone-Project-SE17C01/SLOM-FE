'use client'
import { Button } from "@/components/ui/button";
import { useGetUserByIdMutation } from "../../../api/MessageApi";
import type {
  User,
  SearchUserMessageProps
} from "../../../types/IMessage";
import { useEffect, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SearchUserMessage(searchUserMessageProps: Readonly<SearchUserMessageProps>) {
    const [getUserById] = useGetUserByIdMutation();

    const getUserMessage = useCallback(async (userId: string) => {
        const userList : User[] = []
        try {
            const response = await getUserById(userId).unwrap();
            response.forEach((element: { userName: string, avatar: string, isSeen: boolean, lastMessage: string, isSender: boolean, lastSent: string, userEmail: string }) => {
                userList.push({
                  name: element.userName, 
                  image: element.avatar, 
                  isSeen: element.isSeen, 
                  id: 0, // Use a numeric ID first and then update it
                  lastMessage: element.lastMessage, 
                  isSender: element.isSender, 
                  lastSent: element.lastSent, 
                  email: element.userEmail
                })
            });
            // Assign numeric IDs to the users
            userList.forEach((user, index) => {
              user.id = index + 1;
            });
        } catch (error) {
            console.error(error)
        }
        return userList
    }, [getUserById]);

    useEffect(() => {
        const fetchData = async() => {
            const data = await getUserMessage(searchUserMessageProps.userId);
            searchUserMessageProps.setUsers(data);
        }
        fetchData();
    }, [searchUserMessageProps.userId, getUserMessage])

    return (
        <div className="flex-1 overflow-y-scroll">
            {searchUserMessageProps.users?.map((user : User) => (
                <Button
                key={user.id}
                onClick={() => {
                    const updatedUsers = searchUserMessageProps.users.map(u => 
                        u.id === user.id ? { ...u, isSeen: true } : u
                    );
                    searchUserMessageProps.setUsers(updatedUsers);
                    searchUserMessageProps.setUnreadCount(prev => Math.max(0, prev - 1));
                    searchUserMessageProps.handleUserSelect({ ...user, isSeen: true });
                }}
                className="w-full h-[8vh] shadow-none bg-white text-black hover:bg-[#f5f5f5] dark:bg-[#18181c] dark:text-white dark:hover:bg-[#23272f] pr-0 flex items-center justify-center"
                >
                <div className="w-full h-full flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage
                            src={user.image}
                            alt={`${user.name}`}
                        />
                        <AvatarFallback>{user.name}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="text-lg text-gray-900 dark:text-white text-left font-bold">{user.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-200 text-left flex">
                            <div className={"max-w-[110px]" + (user.isSeen ? "" : " font-bold text-black")} style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.isSender ? "You: " : ""} {user.lastMessage}</div>
                            <></>
                            <div className="flex-1"> &nbsp;· {user.lastSent}</div>
                        </div>
                    </div>

                    {
                        !user.isSeen && (
                            <div className="w-4 h-4 !ml-0 flex items-center justify-center">
                                <div className="w-[60%] h-[60%] bg-blue-500 rounded-full"></div>
                            </div>
                        )
                    }
                </div>
                </Button>
            ))}
        </div>
    )
}