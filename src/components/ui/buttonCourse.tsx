import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/cn";

const buttonCourseVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black border-slate-200 border-2 border-b-4 active:border-b-2 hover:bg-slate-100 text-slate-500",
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 border-primary border-b-4 active:border-b-0",
        primaryOutline: "bg-white text-primary hover:bg-slate-100",
        secondary:
          "bg-green-500 text-primary-foreground hover:bg-green-500/90 border-green-600 border-b-4 active:border-b-0",
        secondaryOutline: "bg-white text-green-500 hover:bg-slate-100",
        danger:
          "bg-rose-500 text-primary-foreground hover:bg-rose-500/90 border-rose-600 border-b-4 active:border-b-0",
        dangerOutline: "bg-white text-rose-500 hover:bg-slate-100",
        super:
          "bg-[#6947A8] text-primary-foreground hover:bg-[#6947A8]/90 border-[#6947A8] border-b-4 active:border-b-0",
        superOutline: "bg-white text-[#6947A8] hover:bg-slate-100",
        ghost:
          "bg-transparent text-slate-500 border-transparent hover:bg-slate-100",
        sidebar:
          "bg-transparent text-slate-500 border-2 border-transparent hover:bg-slate-100 transition-none",
        sidebarOutline:
          "bg-sky-500/15 text-sky-500 border-2 border-sky-300 hover:bg-sky-500/20 transition-none",
        yellowGradient:
          "bg-gradient-to-b from-yellow-500 to-orange-500 text-black font-bold rounded-xl border-orange-600 shadow-none hover:opacity-90  active:border-b-0 border-b-4",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
        rounded: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonCourseVariants> {
  asChild?: boolean;
}

const ButtonCourse = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonCourseVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
ButtonCourse.displayName = "ButtonCourse";

export { ButtonCourse, buttonCourseVariants };
