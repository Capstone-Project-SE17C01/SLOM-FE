import { cn } from "@/utils/cn";
import * as React from "react";
import Image from "next/image";

const CardCourseWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "hover:bg-primary/10 max-w-[800px] relative rounded-2xl border border-slate-200 border-b-4 border-gray-300 bg-[#f7f8fa] shadow-sm overflow-hidden min-h-[120px] flex flex-col justify-between",
      className
    )}
    {...props}
  />
));
CardCourseWrapper.displayName = "CardCourseWrapper";

const CardHeaderCourse = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 pt-3 pb-1 flex items-start", className)}
    {...props}
  />
));
CardHeaderCourse.displayName = "CardHeaderCourse";

const CardTitleModule = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h5 className={cn("text-xs font-bold text-black", className)}>{children}</h5>
);

const CardContentColWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col justify-end pr-4 pb-2", className)}
    {...props}
  />
));
CardContentColWrapper.displayName = "CardContentColWrapper";

const CardContentRowWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-between gap-[100px] pb-4 w-full",
      className
    )}
    {...props}
  />
));
CardContentRowWrapper.displayName = "CardContentRowWrapper";

const CardTitleLesson = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-black", className)} {...props} />
));
CardTitleLesson.displayName = "CardTitleLesson";

import { ButtonCourse } from "./buttonCourse";
import CourseImage from "./courseImage";
const CardButtonRight = ({
  children,
  ...props
}: React.ComponentProps<typeof ButtonCourse>) => (
  <ButtonCourse variant="primary" className="text-base mr-4" {...props}>
    {children}
  </ButtonCourse>
);

const CardImageCourse = ({
  src,
  alt,
  badge,
  className,
}: {
  src: string;
  alt: string;
  badge?: string;
  className?: string;
}) => (
  <div className={cn("absolute right-0 top-1/2 -translate-y-1/2", className)}>
    <CourseImage img={src} title={alt} badge={badge} />
  </div>
);

const CardFooterCourse = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-4 pb-3 pt-0 flex flex-col justify-end", className)}
    {...props}
  />
));
CardFooterCourse.displayName = "CardFooterCourse";

const ProgressBarCourse = ({ progress }: { progress: number }) => (
  <div className="w-full h-1 bg-white rounded-full overflow-hidden">
    <div className="h-full bg-gray-400" style={{ width: `${progress}%` }} />
  </div>
);

const CardTitleLessonFooter = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "absolute left-4 bottom-3 text-base font-semibold text-black",
      className
    )}
  >
    {children}
  </span>
);

// CardWrap: bọc lesson card, nhận className, onClick, children
const CardWrap = ({
  children,
  className,
  onClick,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { onClick?: () => void }) => (
  <div
    className={cn(
      "relative bg-gray-100 rounded-xl min-w-[210px] h-[120px] flex flex-col justify-end shadow-sm border-b-4 border-yellow-400 overflow-hidden cursor-pointer hover:shadow-lg transition",
      className
    )}
    onClick={onClick}
    {...props}
  >
    {children}
  </div>
);

// CardImageCircle: ảnh tròn, nửa nổi bên phải lesson card
const CardImageCircle = ({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn("absolute top-1/2", className)}
    style={{
      right: "-50px",
      transform: "translateY(-50%)",
      width: "100px",
      height: "100px",
      borderRadius: "9999px",
      overflow: "hidden",
      background: "#fff",
      ...style,
    }}
  >
    <Image
      src={src}
      alt={alt}
      width={100}
      height={100}
      quality={100}
      className="object-cover w-full h-full"
      style={{ objectPosition: "center" }}
    />
  </div>
);

// CardTitle: title bài học, đúng style
const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="relative z-10 p-3 pr-24">
    <span
      className={cn("font-semibold text-sm block whitespace-normal", className)}
    >
      {children}
    </span>
  </div>
);

// CardLesson: lesson card gộp, props title, image, onClick, className
const CardLesson = ({
  title,
  image,
  onClick,
  className,
}: {
  title: string;
  image: string;
  onClick?: () => void;
  className?: string;
}) => (
  <div
    className={cn(
      " relative bg-gray-100 rounded-xl min-w-[210px] h-[120px] flex flex-col justify-end shadow-sm border-b-4 border-primary overflow-hidden cursor-pointer hover:bg-primary hover:text-white transition",
      className
    )}
    onClick={onClick}
  >
    {/* Ảnh hình tròn, chỉ lộ nửa trái, nằm cạnh phải */}
    <div
      className="absolute top-1/2"
      style={{
        right: "-50px",
        transform: "translateY(-50%)",
        width: "100px",
        height: "100px",
        borderRadius: "9999px",
        overflow: "hidden",
        clipPath: "inset(0 50% 0 0)",
      }}
    >
      <Image
        src={image}
        alt={title}
        width={100}
        height={100}
        quality={100}
        className="object-cover w-full h-full"
        style={{ objectPosition: "left center" }}
      />
    </div>
    <div className="relative z-10 p-3 pr-24">
      <span className="font-semibold text-sm block whitespace-normal">
        {title}
      </span>
    </div>
  </div>
);

// CardReview: Box review, props title, infoIcon, children, className
const CardReview = ({
  title,
  infoIcon,
  children,
  className,
}: {
  title: React.ReactNode;
  infoIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("rounded-2xl p-6 bg-primary/10", className)}>
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-bold">{title}</div>
      {infoIcon && <div>{infoIcon}</div>}
    </div>
    {children}
  </div>
);

export {
  CardCourseWrapper,
  CardHeaderCourse,
  CardContentColWrapper,
  CardImageCourse,
  CardFooterCourse,
  CardTitleModule,
  CardTitleLesson,
  CardButtonRight,
  ProgressBarCourse,
  CardTitleLessonFooter,
  CardContentRowWrapper,
  CardWrap,
  CardImageCircle,
  CardTitle,
  CardLesson,
  CardReview,
};
