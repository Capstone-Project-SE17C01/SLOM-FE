// src/components/ui/VideoSquare.tsx
export default function VideoSquare({ videoUrl }: { videoUrl: string }) {
  return (
    <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-lg bg-black flex items-center justify-center">
      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        style={{ objectFit: "cover", objectPosition: "center" }}
      ></iframe>
    </div>
  );
}
