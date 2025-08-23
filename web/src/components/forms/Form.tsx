"use client";
import * as React from "react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";

export function Form<T>({
  onSubmit,
  children,
  defaultValues,
  validator,
}: {
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode | ((api: any) => React.ReactNode);
  defaultValues: T;
  validator?: ReturnType<typeof zodValidator>;
}) {
  const form = useForm({
    defaultValues: defaultValues as any,
    onSubmit: async ({ value }: any) => {
      await onSubmit(value as T);
    },
    validator: validator as any,
  } as any);

  const content = typeof children === "function" ? (children as any)(form) : children;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void (form as any).handleSubmit();
      }}
    >
      {content}
    </form>
  );
}


