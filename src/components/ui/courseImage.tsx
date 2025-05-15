import Image from "next/image";
import React from "react";

interface CourseImageProps {
  img: string;
  title: string;
  badge?: string;
  className?: string;
}

const CourseImage: React.FC<CourseImageProps> = ({
  img,
  title,
  badge,
  className,
}) => (
  <div
    className={`absolute h-24 w-12 bg-primary rounded-l-full overflow-hidden relative ${
      className ?? ""
    }`}
  >
    <Image src={img} alt={title} fill className="object-cover" />
    {badge && (
      <span className="absolute top-2 left-2 bg-white/80 text-gray-900 text-xs font-semibold px-2 py-0.5 rounded">
        {badge}
      </span>
    )}
  </div>
);

export default CourseImage;
