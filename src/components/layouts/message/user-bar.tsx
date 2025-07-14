'use client'
import { Button } from "@/components/ui/button";
import { useGetUserByIdMutation } from "../../../api/MessageApi";
import type {
  User,
  SearchUserMessageProps
} from "../../../types/IMessage";
import { useEffect, useState, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SearchUserMessage(searchUserMessageProps: Readonly<SearchUserMessageProps>) {
    const [getUserById] = useGetUserByIdMutation();
    const [users, setUsers] = useState<User[]>([])

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
            setUsers(data);
        }
        fetchData();
    }, [searchUserMessageProps.userId, getUserMessage])

    return (
        <div className="flex-1 overflow-y-scroll">
            {users.map((user : User) => (
                <Button
                key={user.id}
                onClick={() => searchUserMessageProps.handleUserSelect(user)}
                className="w-full h-[8vh] shadow-none bg-white text-black hover:bg-[#f5f5f5] dark:bg-[#18181c] dark:text-white dark:hover:bg-[#23272f]"
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
                            <div className="max-w-[110px]" style={{textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.isSender ? "You: " : ""} {user.lastMessage}</div>
                            <div className="flex-1">· {user.lastSent}</div>
                        </div>
                    </div>
                </div>
                </Button>
            ))}
        </div>
    )
}