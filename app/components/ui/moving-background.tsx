"use client";

import React from "react";
import { motion } from "framer-motion";

export const MovingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 opacity-80">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
        }}
        className="absolute -top-1/2 left-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, rgba(147, 51, 234, 0.15) 25%, rgba(0, 0, 0, 0) 50%)",
          willChange: "transform",
        }}
      />
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
          repeatType: "reverse",
          delay: 6,
        }}
        className="absolute -bottom-1/2 right-0 w-full h-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(147, 51, 234, 0.15) 0%, rgba(59, 130, 246, 0.15) 25%, rgba(0, 0, 0, 0) 50%)",
          willChange: "transform",
        }}
      />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
    </div>
  );
};
