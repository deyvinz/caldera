"use client";
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectValue = SelectPrimitive.Value;
export const SelectItem = ({ className, ...props }: any) => (
  <SelectPrimitive.Item className={cn("px-3 py-2 text-sm data-[highlighted]:bg-emerald-900/10 rounded-md outline-none", className)} {...props} />
);

export function SelectTrigger({ className, children, ...props }: any) {
  return (
    <SelectPrimitive.Trigger
      className={cn(
        "inline-flex items-center justify-between rounded-2xl border border-emerald-900/20 bg-white px-3 h-11 text-sm w-full",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-60" />
    </SelectPrimitive.Trigger>
  );
}

export function SelectContent({ className, children, ...props }: any) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content className={cn("z-50 rounded-2xl bg-white p-2 shadow" , className)} {...props}>
        <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}


