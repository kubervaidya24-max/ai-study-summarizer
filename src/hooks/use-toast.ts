"use client";

import * as React from "react";

export type ToastVariant = "default" | "success" | "destructive" | "warning";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

type ToastListener = (toasts: ToastMessage[]) => void;

let toasts: ToastMessage[] = [];
const listeners = new Set<ToastListener>();

function notify() {
  listeners.forEach((listener) => listener([...toasts]));
}

export function toast(props: Omit<ToastMessage, "id">) {
  const id = `toast_${Math.random().toString(36).substring(2, 9)}`;
  const newToast: ToastMessage = {
    ...props,
    id,
    duration: props.duration ?? 4000,
  };

  toasts = [...toasts, newToast];
  notify();

  if (newToast.duration && newToast.duration > 0) {
    setTimeout(() => {
      toasts = toasts.filter((t) => t.id !== id);
      notify();
    }, newToast.duration);
  }

  return id;
}

export function dismissToast(id: string) {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function useToast() {
  const [activeToasts, setActiveToasts] = React.useState<ToastMessage[]>(toasts);

  React.useEffect(() => {
    listeners.add(setActiveToasts);
    return () => {
      listeners.delete(setActiveToasts);
    };
  }, []);

  return {
    toasts: activeToasts,
    toast,
    dismiss: dismissToast,
  };
}
