"use client";
import * as React from "react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = SheetPrimitive.Root;
export const SheetTrigger = SheetPrimitive.Trigger;

export function SheetContent({ side = "right", className, children, ...props }: any) {
  const sideClass = side === "left" ? "left-0" : "right-0";
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 bg-black/40" />
      <SheetPrimitive.Content
        className={cn(
          "fixed top-0 h-full w-80 bg-white shadow-xl p-6", sideClass, className
        )}
        {...props}
      >
        <SheetPrimitive.Close className="absolute right-3 top-3 rounded-full p-1 hover:bg-emerald-900/10">
          <X className="h-4 w-4" />
        </SheetPrimitive.Close>
        {children}
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  );
}


