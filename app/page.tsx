/*  */"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Spotlight } from "./components/ui/spotlight";
import { TypewriterEffect } from "./components/ui/typewriter-effect";
import { BackgroundGradient } from "./components/ui/background-gradient";
import { HoverEffect } from "./components/ui/hover-effect";
import { AnimatedTooltip } from "./components/ui/animated-tooltip";
import { PencilIcon, EyeIcon, ArrowDownTrayIcon, CommandLineIcon, BoltIcon, DocumentTextIcon, CodeBracketIcon } from "@heroicons/react/24/outline";
import { cn } from "./utils/cn";

const features = [
  {
    title: "AI Writing",
    description: "Enhance your writing with AI-powered suggestions, completions, and real-time improvements.",
    icon: <PencilIcon className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Live Preview",
    description: "See your markdown rendered instantly with support for code highlighting and math equations.",
    icon: <EyeIcon className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Export Options",
    description: "Export to PDF, HTML, and other formats with customizable themes and formatting options.",
    icon: <ArrowDownTrayIcon className="h-6 w-6 text-purple-400" />,
  },
  {
    title: "Smart Features",
    description: "Advanced keyboard shortcuts, file management, and collaborative editing capabilities.",
    icon: <CommandLineIcon className="h-6 w-6 text-purple-400" />,
  },
];

const credits = [
  {
    name: "Durga Venu Kumar Mutyala",
    role: "Full Stack Developer",
    image: "https://avatars.githubusercontent.com/u/45123514",
    linkedin: "https://linkedin.com/in/venukumarmd",
    email: "onlymdvk@gmail.com",
    bio: "Passionate about building modern web applications with cutting-edge technologies"
  },
];

const words = [
  {
    text: "Transform",
    className: "text-purple-400",
  },
  {
    text: "your",
    className: "text-white",
  },
  {
    text: "writing",
    className: "text-white",
  },
  {
    text: "with",
    className: "text-white",
  },
  {
    text: "AI.",
    className: "text-purple-400",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black to-transparent h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-purple-600 to-purple-400 p-[1px]">
                <div className="h-full w-full rounded-lg bg-black flex items-center justify-center">
                  <span className="font-bold text-base bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">MD</span>
                </div>
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">MD AI</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <button 
                onClick={() => router.push('/editor')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg"
              >
                Try Editor Now →
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex items-center justify-center relative px-4 pt-16 pb-20">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="purple"
        />
        
        <div className="text-center space-y-6 relative z-10 max-w-4xl mx-auto">
          <TypewriterEffect words={words} className="text-4xl md:text-6xl font-bold text-white" />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Experience the future of markdown editing with our AI-powered editor. 
            Craft beautiful documents with ease.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button 
              onClick={() => router.push('/editor')} 
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 text-white font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black shadow-lg inline-flex items-center gap-2"
            >
              Launch Editor
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full px-4 py-20 bg-gradient-to-b from-transparent to-purple-500/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 text-white">
            Powerful Features
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            Experience the next generation of markdown editing with our powerful AI-driven features,
            designed to enhance your writing workflow and boost productivity.
          </p>
          <HoverEffect 
            items={features.map(feature => ({
              title: feature.title,
              description: feature.description,
              icon: feature.icon
            }))}
            className="bg-dot-white/[0.2]"
          />
        </div>
      </div>

      {/* Why Choose Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="py-16 relative overflow-hidden"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500">
            Powered by Advanced AI
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/40">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <BoltIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Mixtral 8x7B</h3>
              <p className="text-gray-400">
                Powered by one of the most capable open-source language models, offering high-quality content generation with deep understanding of context.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/40">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Real-time Markdown</h3>
              <p className="text-gray-400">
                Live preview with syntax highlighting, supporting GFM (GitHub Flavored Markdown) for tables, code blocks, and more.
              </p>
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/40">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <ArrowDownTrayIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Quick Export</h3>
              <p className="text-gray-400">
                Instantly download your content as Markdown files or copy to clipboard with a single click for seamless workflow integration.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Credits Section */}
      <div className="w-full px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-bold text-white mb-8">Meet the Creator</h2>
            <div className="group flex items-center gap-6 p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:bg-white/10 max-w-2xl">
              <AnimatedTooltip
                items={credits.map(credit => ({
                  id: 1,
                  name: credit.name,
                  designation: credit.role,
                  image: credit.image,
                }))}
              />
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">{credits[0].name}</h3>
                <p className="text-gray-400 text-sm mb-2">{credits[0].role}</p>
                <p className="text-gray-400 text-sm mb-4">{credits[0].bio}</p>
                <div className="flex gap-4">
                  <a 
                    href={credits[0].linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-purple-400 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a 
                    href={`mailto:${credits[0].email}`}
                    className="text-white/80 hover:text-purple-400 transition-all duration-200 transform hover:scale-110"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
