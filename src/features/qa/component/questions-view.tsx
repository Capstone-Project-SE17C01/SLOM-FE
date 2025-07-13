import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { QuestionViewProps } from "../types";

export default function QuestionView({ setIsResponseQuestion, setIsSpecifiedPage }: Readonly<QuestionViewProps>) {
    const fakeData = [
        {
            "thread_id": 1,
            "date_created": "2025-06-23T09:30:00Z",
            "author": {
                "author_id": 101,
                "username": "JohnDoe",
                "profile_image": "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg"
            },
            "content": "In this thread, we will discuss various techniques to enhance the performance of a website. Some of the key strategies include optimizing images, lazy loading, and minimizing HTTP requests.",
            "images": [
                "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg",
                "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg"
            ],
            "comments": 1
        },
        {
            "thread_id": 2,
            "title": "Best practices for API security",
            "date_created": "2025-06-22T14:20:00Z",
            "author": {
                "author_id": 104,
                "username": "TechExpert",
                "profile_image": "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg"
            },
            "content": "API security is critical for ensuring the safety of user data. In this thread, we’ll explore best practices like using OAuth, securing endpoints, and input validation.",
            "images": [
                "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg",
                "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg",
                "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg"
            ],
            "comments": 1
        }
    ];

    // const data = 

    return (<div>
        {fakeData.map((element) => {
            return (
                <div key={element.thread_id} className="border-b py-4 px-4 w-full">
                    <div role="button" onClick={() => setIsSpecifiedPage(true)} className="flex w-full cursor-pointer" tabIndex={0}>
                        <div className="mr-2">
                            <Avatar>
                                <AvatarImage
                                    src={element.author.profile_image}
                                    alt={`${element.author.username}`}
                                />
                                <AvatarFallback>{element.author.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="w-[93%]">
                            <div className="font-bold">
                                {element.author.username}
                            </div>
                            <div>{element.content}</div>
                            <div className="relative w-full overflow-x-auto">
                                <div className="flex">
                                    {element.images.map((image, index) => (
                                        <div key={index} className="min-w-[45%] mr-2">
                                            <Image
                                                src={image}
                                                alt={`image-${index}`}
                                                height={0}
                                                width={0}
                                                objectFit="contain"
                                                className="w-full mr-1 rounded-xl"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="mt-1 flex hover:bg-gray-200 px-3 py-1 rounded-full" onClick={(e) => {
                                e.stopPropagation()
                                setIsResponseQuestion(true)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
                                </svg>
                                {element.comments}
                            </button>
                        </div>
                    </div>
                </div>
            )
        })}
    </div>)
}