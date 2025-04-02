"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 gap-2 items-center justify-center rounded-md bg-transparent p-1 pl-4 pb-0 text-muted-foreground",
      className,
    )}
    {...props}
  />
));

TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex py-1.5 relative group gap-2 items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground h-full data-[state=active]:rounded-none data-[state=active]:rounded-tl-xl data-[state=active]:rounded-tr-xl data-[state=active]:shadow-sm ",
      "before:size-4 before:transition-shadow before:absolute before:left-0 before:bottom-0 before:shadow-[6px_6px_0_-4px_bg-transparent] before:rounded-full data-[state=active]:before:shadow-[6px_6px_0_-4px_hsl(var(--background))] before:-translate-x-full before:transparent",
      "after:size-4 after:transition-shadow after:absolute after:right-0 after:bottom-0 after:rounded-full after:shadow-[-6px_6px_0_-4px_bg-transparent] data-[state=active]:after:shadow-[-6px_6px_0_-4px_hsl(var(--background))] after:translate-x-full after:transparent",
      className,
    )}
    {...props}
  >
    <span
      className="transition-colors duration-300 px-4 py-1.5 group-data-[state=inactive]:rounded-lg group-data-[state=inactive]:hover:bg-background/20"
      id={props.id}
    >
      {props.children}
    </span>
  </TabsPrimitive.Trigger>
));

TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
