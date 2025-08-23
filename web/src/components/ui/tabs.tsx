"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsList = ({ className, ...props }: any) => (
  <TabsPrimitive.List className={cn("inline-flex gap-2 border-b border-emerald-900/20", className)} {...props} />
);
export const TabsTrigger = ({ className, ...props }: any) => (
  <TabsPrimitive.Trigger
    className={cn(
      "px-3 py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-900 data-[state=active]:text-emerald-900 text-charcoal-900/70",
      className
    )}
    {...props}
  />
);
export const TabsContent = ({ className, ...props }: any) => (
  <TabsPrimitive.Content className={cn("pt-4", className)} {...props} />
);


