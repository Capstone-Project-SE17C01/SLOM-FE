'use client'
import { Button } from "@/components/ui/button";
import { useGetProfileByNameMutation } from "../../../api/MessageApi";
import type {
  SearchUserProps,
  User
} from "../../../types/IMessage";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";
import { useTranslations } from "next-intl";
  
export function SearchUser({ isSearch, setIsSearch, setListSearchUser }: Readonly<SearchUserProps>) {
    const [getProfileByName] = useGetProfileByNameMutation();
    const { userInfo } = useSelector((state: RootState) => state.auth);
    const { isDarkMode } = useTheme();
    const t_chatPage = useTranslations("chatPage");
    const findUser = async (userInput: string) => {
      try {
        const response = await getProfileByName({ currentUserEmail: userInfo?.email, input: userInput }).unwrap();
        const userList: User[] = []
        let count = 1;
        setListSearchUser([]);
        response.forEach((element: { userName: string, userAvatar: string, userEmail: string }) => {
          userList.push({name: element.userName, image: element.userAvatar, isSeen: true, id: count, lastMessage: "", isSender: true, lastSent: "", email: element.userEmail})
          count++;
        });
        setListSearchUser(userList)
      } catch (error) {
        console.error(error);
      }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (value.length > 0) {
        findUser(value);
      } else {
        setListSearchUser([]);
      }
    };

    return(
        <div className="flex h-full">
            <Button className={"hover:bg-[#f5f5f5] bg-white text-black rounded-full h-full mr-2 w-[10%] shadow-none " + (isSearch ? "" : "hidden")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 w-full">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>
            </Button>
            <input type="text" name="" id="" onChange={handleChange} onBlur={() => {setTimeout(function(){setIsSearch(false)},300);}} onFocus={() => setIsSearch(true)} 
            placeholder={t_chatPage("search")} className={cn("bg-[#f4f4f4]  h-full rounded-full pl-9 " + (isSearch ? " flex-1" : " w-[100%]"), isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-800")}/>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={"size-5 absolute top-1/2 text-[#888889] transform -translate-y-1/2" + (isSearch ? " left-12" : " left-2")}>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
        </div>
    )
}