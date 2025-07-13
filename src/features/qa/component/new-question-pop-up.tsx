import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { NewQuestionPopupProps } from "../types";
import { useState } from "react";
import Image from "next/image";
import { uploadImageToCloudinary } from "@/services/cloudinary/config";
import { usePostQuestionMutation } from "../api";


export default function NewQuestionPopup({ userInfo, setIsNewQuestion }: Readonly<NewQuestionPopupProps>) {
    const [newQuestion, setNewQuestion] = useState("");
    const [newImages, setNewImages] = useState<string[]>([]);
    const [privacy, setPrivacy] = useState("All can view and answer you question");
    const [previews, setPreviews] = useState<string[]>([])
    const [files, setFiles] = useState<File[]>([])
    const [postQuestionAPI] = usePostQuestionMutation();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewQuestion(e.target.value)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)
        const urls = files.map(f => URL.createObjectURL(f))
        setFiles(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...urls])
        e.target.value = ''
    }

    const removeItem = (index: number) => {
        setPreviews(prev => prev.filter((_, i) => i !== index))
        setFiles(prev => prev?.filter((_, i) => i !== index))
    }

    const postQuestion = () => {
        if (files != undefined) {
            files?.forEach(element => {
                console.log(files)
                uploadImageToCloudinary(element).then(res => {
                    setNewImages(prev => [...prev, res.url])
                    console.log("Ethanasdff")
                    console.log(res.url)
                })

            });
        }
    }

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
                    <div className="flex flex-col items-start">
                        <div className="flex flex-wrap gap-2">
                            {previews.map((src, i) => (
                                <div key={src} className="relative w-24 h-24 border rounded">
                                    <button
                                        onClick={() => removeItem(i)}
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
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        <label
                            htmlFor="file-input"
                            className="mt-4 inline-flex items-center cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                            aria-label="Upload images"
                        >
                            {/* icon upload */}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 text-gray-600"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159 a2.25 2.25 0 0 1 3.182 0 l5.159 5.159 m-1.5-1.5 1.409-1.409 a2.25 2.25 0 0 1 3.182 0 l2.909 2.909 m-18 3.75 h16.5 a1.5 1.5 0 0 0 1.5-1.5 V6 a1.5 1.5 0 0 0-1.5-1.5 H3.75 A1.5 1.5 0 0 0 2.25 6 v12 a1.5 1.5 0 0 0 1.5 1.5 Z m10.5-11.25 h.008 v.008 h-.008 V8.25 Z m.375 0 a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0 Z" />
                            </svg>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>
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
                <button className="border px-3 py-1 rounded-xl mt-1" onClick={postQuestion}>Post</button>
            </div>
        </div>
    </div>)
}