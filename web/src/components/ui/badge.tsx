import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-gold-500 text-gold-500 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
        className
      )}
      {...props}
    />
  );
}


