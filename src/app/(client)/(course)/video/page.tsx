import EmbedVideo from "@/components/layouts/course/embed-video";

export default function VideoEmbed() {
    return (
        <div className="min-h-[calc(100vh-200px)] w-full px-4 sm:px-6 lg:px-8 py-6 bg-white dark:bg-gray-900">
            <EmbedVideo />
        </div>
    )
}