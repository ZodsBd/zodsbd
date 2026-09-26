import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-obsidian text-white hover:bg-black/85",
        gold: "bg-gold text-obsidian hover:bg-[#b8931f]",
        outline: "border border-obsidian bg-transparent text-obsidian hover:bg-obsidian hover:text-white",
        ghost: "hover:bg-ivory text-obsidian",
        link: "underline-offset-4 hover:underline text-obsidian normal-case tracking-normal",
        destructive: "bg-rose-700 text-white hover:bg-rose-800",
        subtle: "bg-ivory text-obsidian hover:bg-[#EFE9DF] normal-case tracking-normal text-sm",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-9 px-4",
        lg: "h-14 px-10",
        icon: "h-10 w-10 tracking-normal",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />;
});
Button.displayName = "Button";
