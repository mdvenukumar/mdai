"use client";
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export const Spotlight = ({
  className = "",
  fill = "white",
}: {
  className?: string;
  fill?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = React.useState(0);

  const updatePosition = (e: MouseEvent) => {
    if (!divRef.current) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const updateOpacity = () => {
    setOpacity(1);
  };

  const resetOpacity = () => {
    setOpacity(0);
  };

  useEffect(() => {
    const div = divRef.current;
    if (!div) return;

    div.addEventListener("mousemove", updatePosition);
    div.addEventListener("mouseenter", updateOpacity);
    div.addEventListener("mouseleave", resetOpacity);

    return () => {
      div.removeEventListener("mousemove", updatePosition);
      div.removeEventListener("mouseenter", updateOpacity);
      div.removeEventListener("mouseleave", resetOpacity);
    };
  }, []);

  return (
    <motion.div
      ref={divRef}
      className={`relative ${className}`}
      style={{
        height: "600px",
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 transition duration-300"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}10 0%, transparent 80%)`,
          opacity,
        }}
      />
    </motion.div>
  );
};
