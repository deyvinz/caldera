import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full rounded-2xl border h-11 px-4 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gold-500",
          hasError ? "border-red-500" : "border-emerald-900/20",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


