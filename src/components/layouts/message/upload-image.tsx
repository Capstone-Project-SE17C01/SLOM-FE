
import { useEffect } from "react";
import { MessageUploadImageDTO } from "@/types/IMessage";

export default function UploadImage({ setFiles, images, setExistImages, existImage, setPreviews }: Readonly<MessageUploadImageDTO>) {

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            console.log("Falswe")
            return
        }
        console.log(e.target.files)
        const files = Array.from(e.target.files)
        const urls = files.map(f => URL.createObjectURL(f))
        setFiles(prev => [...prev, ...files]);
        setPreviews(prev => prev != undefined ? [...prev, ...urls] : [...urls])
        e.target.value = ''
    }

    useEffect(() => {
        setPreviews(images);
        if(setExistImages != undefined)
            setExistImages(images)
        console.log(existImage)
    }, [])

    return (
        <div className="flex flex-col items-start">
            <div className="flex flex-wrap gap-2">
                
            </div>

            <label
                htmlFor="file-input"
                className="mx-2 inline-flex items-center cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                aria-label="Upload images"
            >
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
    )
}