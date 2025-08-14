import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewQuestionProps } from "@/types/IQa";
import { PlusCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/utils/cn";    
import { useTranslations } from "next-intl";

export default function NewQuestion({ userInfo, setIsNewQuestion }: Readonly<NewQuestionProps>) {
    const { isDarkMode } = useTheme();
    const t_qaPage = useTranslations("qaPage");
    return (
        <div className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center flex-1 max-w-3xl">
                <div className="mr-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={userInfo?.avatarUrl}
                            alt={`${userInfo?.username}`}
                        />
                        <AvatarFallback>{userInfo?.username}</AvatarFallback>
                    </Avatar>
                </div>
                <button 
                    className={cn(
                        "flex-1 text-left px-4 py-2.5 transition-colors rounded-full text-gray-500",
                        isDarkMode ? "bg-gray-800 hover:bg-gray-700 text-white placeholder-gray-400 border border-gray-700" : "bg-gray-50 hover:bg-gray-100 text-gray-500 placeholder-gray-400 border border-gray-300"
                    )}
                    onClick={() => setIsNewQuestion(true)}
                >
                    {t_qaPage("whatsYourQuestion")}
                </button>
            </div>
            <button 
                className="ml-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5" 
                onClick={() => setIsNewQuestion(true)}
            >
                <PlusCircle className="h-4 w-4" />
                <span>{t_qaPage("askAQuestion")}</span>
            </button>
        </div>
    );
}