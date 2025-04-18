'use client'
import { Button } from "@/components/ui/button";
import { useGetUserByIdMutation } from "../api";
import type {
  User,
  SearchUserMessageProps
} from "../types";
import { useEffect, useState } from "react";

export function SearchUserMessage(searchUserMessageProps: Readonly<SearchUserMessageProps>) {
    const [getUserById] = useGetUserByIdMutation();
    const [users, setUsers] = useState<User[]>([])

    const getUserMessage = async (userId: string) => {
        const userList : User[] = []
        try {
            const response = await getUserById(userId).unwrap();
            response.forEach((element: any) => {
                userList.push({name: element.userName, image: element.avatar, isSeen: element.isSeen, id: element.userName, lastMessage: element.lastMessage, isSender: element.isSender, lastSent: element.lastSent, email: element.userEmail})
            });
        } catch (error) {
            console.error(error)
        }
        return userList
    };

    useEffect(() => {
        const fetchData = async() => {
            const data = await getUserMessage(searchUserMessageProps.userId);
            setUsers(data);
        }
        fetchData();
    }, [])

    return (
        <div style={{ overflowY: 'scroll' }} className="flex-1 ">
            {users.map((user : User) => (
                <Button
                key={user.id}
                onClick={() => searchUserMessageProps.handleUserSelect(user)}
                className="hover:bg-[#f5f5f5] bg-white text-black w-full h-[8vh] shadow-none"
                >
                <div className="w-full h-full flex items-center space-x-4">
                    <img src={user.image} alt="User Profile" className="h-[90%] rounded-full" />

                    <div className="flex-1">
                        <div className="text-lg  text-gray-900 text-left font-bold">{user.name}</div>
                        <div className="text-sm text-gray-600 text-left flex">
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