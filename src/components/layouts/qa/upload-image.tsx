import Image from "next/image";
import { useEffect, useState } from "react";
import { UploadImageDTO } from "@/types/IQa";

export default function UploadImage({ setFiles, images, setExistImages, existImage }: Readonly<UploadImageDTO>) {
    const [previews, setPreviews] = useState<string[] | undefined>([])

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

    const removeItem = (index: number, src: string) => {
        if (src.includes('cloudinary') && setExistImages != undefined) {
            setExistImages(() => existImage?.filter(val => val != src))
        } else {
            setPreviews(prev => prev != undefined ? prev.filter((_, i) => i !== index) : prev)
            setFiles(prev => prev?.filter((_, i) => i !== index))
        }
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
                {previews != undefined ? previews.map((src, i) => (
                    <div key={src} className="relative w-24 h-24 border rounded">
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
                            className="object-cover"
                        />
                    </div>
                )) : <></>}
            </div>

            <label
                htmlFor="file-input"
                className="mt-4 inline-flex items-center cursor-pointer p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
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