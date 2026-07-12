import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "soft";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-full px-7 py-3 text-sm tracking-[0.24em] uppercase transition duration-300 focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40",
        variant === "primary" && "bg-[#A8CFC0] text-[#3A3A3A] shadow-[0_18px_45px_rgba(168,207,192,0.38)] hover:-translate-y-0.5 hover:bg-[#9fc7b8]",
        variant === "soft" && "bg-white/55 text-[#3A3A3A] ring-1 ring-[#C9A96E]/25 backdrop-blur hover:bg-white/75",
        variant === "ghost" && "text-[#3A3A3A]/70 hover:text-[#3A3A3A]",
        className
      )}
      {...props}
    />
  );
}
