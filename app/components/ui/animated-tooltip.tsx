"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    link: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex gap-4">
      {items.map((item, idx) => (
        <a
          key={item.id}
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute -top-16 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black text-white text-sm rounded-lg"
              >
                <div className="font-semibold">{item.name}</div>
                <div className="text-xs text-gray-400">{item.designation}</div>
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full border-l-8 border-r-8 border-t-8 border-transparent border-t-black" />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:scale-110 hover:bg-blue-500 transition-all duration-200">
            {item.name[0]}
          </div>
        </a>
      ))}
    </div>
  );
};
