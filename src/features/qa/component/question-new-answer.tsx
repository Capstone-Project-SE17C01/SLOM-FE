import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

export default function QuestionNewAnswer() {
    const ele = {
        "thread_id": 1,
        "date_created": "2025-06-23T09:30:00Z",
        "author": {
            "author_id": 101,
            "username": "JohnDoe",
            "profile_image": "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg",
            "bio": "Web developer with 5+ years of experience in optimizing websites."
        },
        "content": "In this thread, we will discuss various techniques to enhance the performance of a website. Some of the key strategies include optimizing images, lazy loading, and minimizing HTTP requests.",
        "images": [
            "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg",
            "https://tienganhnghenoi.vn/wp-content/uploads/2023/04/cau-truc-as-as-1.jpg"
        ],
        "answers": 15
    };

    return (
        <div key={ele.thread_id} className="border-b py-4 px-4 w-full">
            <div className="flex w-full cursor-pointer">
                <div className="mr-2">
                    <Avatar>
                        <AvatarImage
                            src={ele.author.profile_image}
                            alt={`${ele.author.username}`}
                        />
                        <AvatarFallback>{ele.author.username}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="w-[93%]">
                    <div className="font-bold">
                        {ele.author.username}
                    </div>
                    <div>{ele.content}</div>
                    <div className="relative w-full overflow-x-auto">
                        <div className="flex">
                            {ele.images.map((image, index) => (
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
                </div>
            </div>
        </div>)
}