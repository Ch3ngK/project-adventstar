import * as React from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "secondary" | "outline";
type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-slate-950 text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800",
  secondary:
    "bg-amber-100 text-amber-950 shadow-sm hover:bg-amber-200",
  outline:
    "border border-slate-300 bg-white/80 text-slate-900 shadow-sm hover:bg-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "px-5 py-3 text-sm",
  sm: "px-4 py-2 text-xs",
  lg: "px-7 py-4 text-sm",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-full font-semibold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-60",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
