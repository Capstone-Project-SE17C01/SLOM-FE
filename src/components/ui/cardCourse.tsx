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
      "group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl min-w-[240px] h-[140px] flex flex-col justify-end shadow-lg hover:shadow-xl border border-gray-200 border-b-4 border-primary overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1",
      className
    )}
    onClick={onClick}
  >
    {/* Background decoration */}
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full transform translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-500"></div>
    
    {/* Enhanced image with modern styling */}
    <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-8 group-hover:translate-x-6 transition-transform duration-300">
      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow duration-300 border-2 border-white">
        <Image
          src={image}
          alt={title}
          width={80}
          height={80}
          quality={100}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
        />
      </div>
    </div>
    
    {/* Content with enhanced styling */}
    <div className="relative z-10 p-4 pr-20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-primary rounded-full group-hover:animate-pulse"></div>
        <span className="text-xs text-primary font-medium">Lesson</span>
      </div>
      <h3 className="font-bold text-sm text-gray-900 group-hover:text-primary transition-colors duration-300 leading-tight">
        {title}
      </h3>
      
      {/* Hover indicator */}
      <div className="absolute bottom-2 right-4 w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg className="w-3 h-3 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
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
