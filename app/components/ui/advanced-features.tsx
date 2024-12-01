"use client";

import React from "react";
import { BoltIcon, DocumentTextIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { cn } from "@/app/utils/cn";

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  className 
}: { 
  icon: any; 
  title: string; 
  description: string;
  className?: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: "-1deg" }}
      className={cn(
        "relative group",
        className
      )}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative h-full bg-gray-900 border border-gray-800/50 backdrop-blur-xl rounded-xl p-8 transition-all duration-300 hover:border-purple-500/50">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl blur-lg opacity-0 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative w-16 h-16 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Icon className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              {title}
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export function AdvancedFeatures() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#0B1120]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 animate-pulse"></div>
        <div className="absolute h-full w-full bg-[radial-gradient(circle_500px_at_50%_200px,#3b82f6,transparent)]"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
                Powered by Advanced AI
              </span>
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full mb-8"
            />
          </div>

          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <FeatureCard
                icon={BoltIcon}
                title="Mixtral 8x7B"
                description="Powered by one of the most capable open-source language models, offering high-quality content generation with deep understanding of context."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <FeatureCard
                icon={DocumentTextIcon}
                title="Real-time Markdown"
                description="Live preview with syntax highlighting, supporting GFM (GitHub Flavored Markdown) for tables, code blocks, and more."
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <FeatureCard
                icon={ArrowDownTrayIcon}
                title="Quick Export"
                description="Instantly download your content as Markdown files or copy to clipboard with a single click for seamless workflow integration."
              />
            </motion.div>
          </div>

          {/* Interactive Elements */}
          <div className="absolute -left-40 -bottom-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
          <div className="absolute -right-40 -bottom-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute left-20 -top-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>
      </div>
    </section>
  );
}
