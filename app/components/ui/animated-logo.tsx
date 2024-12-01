"use client";

import { motion } from "framer-motion";

export const AnimatedLogo = ({ onAnimationComplete }: { onAnimationComplete?: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2.5 }}
      onAnimationComplete={onAnimationComplete}
      className="fixed inset-0 flex items-center justify-center bg-[#0B1120] z-50"
    >
      <div className="relative">
        {/* Animated gradient circles */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute -inset-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl"
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.15 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="absolute -inset-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl"
        />
        
        {/* MD AI Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative"
        >
          <motion.h1 
            className="text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            MD AI
          </motion.h1>
        </motion.div>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1 + i * 0.2,
                repeat: 2,
                repeatType: "reverse",
              }}
              className="w-2 h-2 rounded-full bg-blue-400"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};
