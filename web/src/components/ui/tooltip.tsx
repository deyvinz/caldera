"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;
export const TooltipContent = (props: any) => (
  <TooltipPrimitive.Content sideOffset={6} className="rounded-md bg-charcoal-900 text-white text-xs px-2 py-1 shadow">
    {props.children}
  </TooltipPrimitive.Content>
);


