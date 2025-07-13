import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { NewQuestionPopupProps, PostQuestionRequestDTO } from "../types";
import { useState } from "react";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostQuestionMutation } from "../api";
import UploadImage from "./upload-image";


export default function NewQuestionPopup({ userInfo, setIsNewQuestion }: Readonly<NewQuestionPopupProps>) {
    const [newQuestion, setNewQuestion] = useState("");
    const [privacy, setPrivacy] = useState("All can view and answer you question");
    const [files, setFiles] = useState<File[]>([])
    const [postQuestionAPI] = usePostQuestionMutation();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewQuestion(e.target.value)
    }

    const uploadImage = async (): Promise<string[]> => {
        if (!files?.length) return [];
        const promises = files.map(f =>
            uploadImageToCloudinary(f).then(res => res.url)
        );
        const urls = await Promise.all(promises);
        return urls;
    }

    const postQuestion = async () => {
        const request: PostQuestionRequestDTO = {
            creatorId: userInfo?.id,
            content: newQuestion,
            privacy: privacy,
        };

        if (!files?.length) {
            await postQuestionAPI(request);
            setIsNewQuestion(false);
            return;
        }

        const resUrls = await uploadImage();
        console.log(resUrls);
        request.images = resUrls;
        await postQuestionAPI(request);
        setIsNewQuestion(false);
    };


    return (<div>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"></div>
        <div className="fixed inset-x-0 top-1/4 z-50 mx-auto w-[48%] p-6 bg-white rounded-lg shadow-lg">
            <div className="pb-3 mb-1 flex w-full justify-between border-b">
                <button onClick={() => setIsNewQuestion(false)}>Cancel</button>
                <div className="font-bold">New thread</div>
                <div></div>
            </div>
            <div className="flex">
                <div className="mt-1 mr-2">
                    <Avatar>
                        <AvatarImage
                            src={userInfo?.avatarUrl}
                            alt={`${userInfo?.username}`}
                        />
                        <AvatarFallback>{userInfo?.username}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="w-[90%]">
                    <div className="font-semibold text-base">{userInfo?.username}</div>
                    <textarea
                        onChange={handleChange}
                        placeholder="What's new"
                        className="w-full border-none rounded focus:outline-none ring-0 focus:ring-0 text-sm"
                    />
                    <UploadImage setFiles={setFiles}/>
                </div>
            </div>
            <div className="w-full flex justify-between mt-5">
                <div className="absolute">
                    <Listbox value={privacy} onChange={setPrivacy}>
                        <ListboxButton className="rounded-xl bg-white px-4 py-2 text-black/50">
                            {privacy}
                        </ListboxButton>
                        <ListboxOptions className=" mt-1 bg-white rounded-xl shadow-lg">
                            <ListboxOption value="All can view and answer you question" className="px-4 py-2">
                                All
                            </ListboxOption>
                            <ListboxOption value="Only admin can view and answer" className="px-4 py-2">
                                Admin
                            </ListboxOption>
                        </ListboxOptions>
                    </Listbox>
                </div>
                <div></div>
                <button className="border px-3 py-1 rounded-xl mt-1" onClick={async () => {await postQuestion()}}>Post</button>
            </div>
        </div>
    </div>)
}