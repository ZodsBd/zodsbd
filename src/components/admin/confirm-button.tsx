"use client";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { ActionResult } from "@/actions/content";

/** Runs a server action with optional confirm + toast feedback. */
export function ActionButton({ action, confirmText, success, children, ...props }: ButtonProps & { action: () => Promise<ActionResult | void>; confirmText?: string; success?: string }) {
  const [pending, start] = useTransition();
  return (
    <Button type="button" disabled={pending || props.disabled} {...props} onClick={() => {
      if (confirmText && !confirm(confirmText)) return;
      start(async () => {
        const r = await action();
        if (r && !r.ok) toast.error(r.error); else if (success) toast.success(success);
      });
    }}>{children}</Button>
  );
}
