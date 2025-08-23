"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type AnyFieldApi = { state?: { meta?: { errors?: unknown[] } } } & Record<string, unknown>;

export function Field({
  label,
  field,
  children,
  description,
}: {
  label: string;
  field: AnyFieldApi;
  children: React.ReactNode;
  description?: string;
}) {
  const error = (field as AnyFieldApi)?.state?.meta?.errors?.[0] as string | undefined;
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-charcoal-900">{label}</label>
      <div className={cn(error && "[&_*]:border-red-500")}>{children}</div>
      {description && !error && (
        <p className="text-xs text-charcoal-900/70">{description}</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}


