"use client";
import * as ToastPrimitive from "@radix-ui/react-toast";

export const ToastProvider = ToastPrimitive.Provider;
export const ToastViewport = (props: any) => (
  <ToastPrimitive.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2" {...props} />
);
export const ToastRoot = (props: any) => (
  <ToastPrimitive.Root className="rounded-2xl bg-white px-4 py-3 shadow lux-gold-border" {...props} />
);
export const ToastTitle = ToastPrimitive.Title;
export const ToastDescription = ToastPrimitive.Description;


