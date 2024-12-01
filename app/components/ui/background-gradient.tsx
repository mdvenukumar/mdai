"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradient = ({
  children,
  className = "",
  containerClassName = "",
  animate = true,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  animate?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !animate) return;

    const listener = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width;
      const y = (e.clientY - top) / height;

      container.style.setProperty("--x", x.toString());
      container.style.setProperty("--y", y.toString());
    };

    container.addEventListener("mousemove", listener);
    return () => container.removeEventListener("mousemove", listener);
  }, [animate]);

  return (
    <div
      className={cn(
        "relative w-full rounded-xl",
        containerClassName
      )}
      ref={containerRef}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-[inherit] z-[1] opacity-0 group-hover:opacity-100 transition duration-500",
          "bg-[radial-gradient(circle_at_var(--x,_50%)_var(--y,_50%),rgba(59,130,246,0.15),transparent_40%)]",
          className
        )}
      />
      <div className={cn("relative z-[2]", className)}>{children}</div>
    </div>
  );
};
