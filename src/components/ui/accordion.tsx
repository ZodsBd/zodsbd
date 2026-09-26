"use client";
import * as React from "react";
import * as A from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Accordion = A.Root;

export function AccordionItem({ value, title, children, className }: { value: string; title: string; children: React.ReactNode; className?: string }) {
  return (
    <A.Item value={value} className={cn("border-b border-border", className)}>
      <A.Header>
        <A.Trigger className="group flex w-full items-center justify-between py-5 text-left text-xs font-medium uppercase tracking-[0.18em]">
          {title}
          <Plus className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-45" />
        </A.Trigger>
      </A.Header>
      <A.Content className="overflow-hidden text-sm leading-relaxed text-warm-dark data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <div className="pb-6">{children}</div>
      </A.Content>
    </A.Item>
  );
}
