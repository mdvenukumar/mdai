"use client";

import React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

export const ParallaxScroll = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 };
  
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], ["0%", "50%"]),
    springConfig
  );

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
};

export const ParallaxText = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div className={className} style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};
