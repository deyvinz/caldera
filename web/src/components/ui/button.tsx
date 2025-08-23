"use client";
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-5",
  {
    variants: {
      variant: {
        primary: "bg-emerald-900 text-white hover:opacity-95 shadow-[var(--shadow-luxury)]",
        outline: "border border-emerald-900 text-emerald-900 bg-transparent hover:bg-emerald-900/5",
        ghost: "text-emerald-900 hover:bg-emerald-900/10",
      },
      loading: {
        true: "cursor-wait opacity-80",
        false: "",
      },
    },
    defaultVariants: { variant: "primary", loading: false },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, loading, children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, loading, className }))} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";


