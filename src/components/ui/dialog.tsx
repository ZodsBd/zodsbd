"use client";
import * as React from "react";
import * as D from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Dialog = D.Root;
export const DialogTrigger = D.Trigger;
export const DialogClose = D.Close;

export function DialogContent({ className, children, title, description, side }: {
  className?: string; children: React.ReactNode; title: string; description?: string; side?: "right" | "left" | "center";
}) {
  const pos =
    side === "right" ? "right-0 top-0 h-full w-full max-w-md data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right" :
    side === "left" ? "left-0 top-0 h-full w-full max-w-sm data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left" :
    "left-1/2 top-1/2 max-h-[90vh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-y-auto data-[state=open]:zoom-in-95";
  return (
    <D.Portal>
      <D.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
      <D.Content className={cn("fixed z-50 flex flex-col bg-white shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 duration-300", pos, className)}>
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <D.Title className="font-serif text-2xl">{title}</D.Title>
            {description ? <D.Description className="mt-1 text-sm text-warm-dark">{description}</D.Description> : <D.Description className="sr-only">{title}</D.Description>}
          </div>
          <D.Close className="p-1 text-obsidian hover:text-gold" aria-label="Close"><X className="h-5 w-5" /></D.Close>
        </div>
        {children}
      </D.Content>
    </D.Portal>
  );
}
