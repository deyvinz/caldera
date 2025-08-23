import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={cn(
          "block w-full rounded-2xl border px-4 py-3 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500",
          hasError ? "border-red-500" : "border-emerald-900/20",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";


