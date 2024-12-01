"use client";

import React, { useState, useEffect, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";
import { AnimatedLogo } from "../components/ui/animated-logo";
import { 
  PencilIcon, 
  EyeIcon, 
  ArrowUturnLeftIcon, 
  ArrowUturnRightIcon,
  BoltIcon,
  DocumentTextIcon,
  ListBulletIcon,
  HashtagIcon,
  CodeBracketIcon,
  LinkIcon,
  PhotoIcon,
  TableCellsIcon,
  Bars3Icon,
  HomeIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

interface HistoryState {
  content: string;
  cursorPosition: { start: number; end: number };
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function Editor() {
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [topic, setTopic] = useState("");
  const [activeTab, setActiveTab] = useState('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Compute undo/redo capabilities
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleLogoComplete = () => {
    setShowLogo(false);
    setShowContent(true);
  };

  const undo = () => {
    if (canUndo) {
      const newIndex = historyIndex - 1;
      const previousState = history[newIndex];
      setContent(previousState.content);
      setHistoryIndex(newIndex);

      // Restore cursor position after state update
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(
            previousState.cursorPosition.start,
            previousState.cursorPosition.end
          );
        }
      }, 0);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newIndex = historyIndex + 1;
      const nextState = history[newIndex];
      setContent(nextState.content);
      setHistoryIndex(newIndex);

      // Restore cursor position after state update
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(
            nextState.cursorPosition.start,
            nextState.cursorPosition.end
          );
        }
      }, 0);
    }
  };

  const addToHistory = (newContent: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const newState: HistoryState = {
      content: newContent,
      cursorPosition: {
        start: textarea.selectionStart,
        end: textarea.selectionEnd
      }
    };

    // Remove any future history states if we're in the middle of the history
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newState]);
    setHistoryIndex(newHistory.length);
  };

  const insertText = (before: string, after?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const newText = before + selectedText + (after || before);
    const newContent = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    
    setContent(newContent);
    addToHistory(newContent);

    // Set cursor position after state update
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selectedText.length
      );
    }, 0);
  };

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'b':
            e.preventDefault();
            insertText('**', '**');
            break;
          case 'i':
            e.preventDefault();
            insertText('*', '*');
            break;
          case 'k':
            e.preventDefault();
            insertText('[', '](url)');
            break;
          case 'z':
            if (e.shiftKey) {
              e.preventDefault();
              if (canRedo) redo();
            } else {
              e.preventDefault();
              if (canUndo) undo();
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [canUndo, canRedo, history, historyIndex]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const downloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `${topic.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Downloaded markdown file!");
  };

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const data = await response.json();
      setContent(data.content);
      addToHistory(data.content);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error('Generation error:', error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showLogo && <AnimatedLogo onAnimationComplete={handleLogoComplete} />}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-[#0B1120] text-gray-300"
          >
            {/* Premium Gradient Background */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-[#0B1120]" />
              <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-blue-500/5" />
              <div className="absolute inset-0 bg-gradient-conic from-transparent via-blue-500/5 to-transparent animate-spin-slow" />
            </div>

            {/* Header */}
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="border-b border-gray-800 bg-[#0B1120]/90 backdrop-blur-sm sticky top-0 z-50"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/"
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                    >
                      <HomeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium hidden sm:block">Home</span>
                    </Link>
                    <motion.h1
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400"
                    >
                      MD AI Editor
                    </motion.h1>
                  </div>
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                  >
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 group-hover:scale-110 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </motion.svg>
                      <span className="hidden sm:block">Copy</span>
                    </button>
                    <button
                      onClick={downloadMarkdown}
                      className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
                    >
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 group-hover:scale-110 transition-transform"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </motion.svg>
                      <span className="hidden sm:block">Download</span>
                    </button>
                  </motion.div>
                </div>
              </div>
            </motion.header>

            {/* Topic Input */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="border-b border-gray-800 bg-[#0B1120]/30 backdrop-blur-sm"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleGenerate();
                        }
                      }}
                      placeholder="Enter your topic and press Enter..."
                      className="w-full bg-gray-900/50 border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    {isGenerating && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <BoltIcon className="w-5 h-5 text-blue-500" />
                        </motion.div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <BoltIcon className="w-5 h-5" />
                        </motion.div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <BoltIcon className="w-5 h-5" />
                        Generate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Toolbar */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="border-b border-gray-800 bg-[#0B1120]/20 backdrop-blur-sm"
            >
              <div className="container mx-auto">
                <Toolbar
                  onAction={insertText}
                  canUndo={canUndo}
                  canRedo={canRedo}
                  onUndo={undo}
                  onRedo={redo}
                />
              </div>
            </motion.div>

            {/* Editor Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="container mx-auto px-4 py-6"
            >
              {/* Mobile Tabs */}
              <div className="block md:hidden mb-4">
                <div className="flex rounded-lg overflow-hidden bg-gray-800/50 p-1">
                  <button
                    onClick={() => setActiveTab('edit')}
                    className={`flex-1 px-4 py-2 text-sm flex items-center justify-center gap-2 rounded-md transition-all ${
                      activeTab === 'edit' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`flex-1 px-4 py-2 text-sm flex items-center justify-center gap-2 rounded-md transition-all ${
                      activeTab === 'preview' 
                        ? 'bg-gray-700 text-white' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    <EyeIcon className="w-4 h-4" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Editor and Preview */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="grid md:grid-cols-2 gap-6"
              >
                {/* Edit Panel */}
                <div 
                  className={`flex flex-col rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/40 overflow-hidden transition-all h-[70vh] md:h-[calc(100vh-280px)] ${
                    activeTab !== 'edit' ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-800/40 backdrop-blur-sm">
                    <span className="text-sm font-medium text-gray-400">Editor</span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      addToHistory(e.target.value);
                    }}
                    placeholder="Start writing or generate content..."
                    className="flex-1 w-full h-full p-4 bg-transparent font-mono text-sm resize-none focus:outline-none text-gray-300 placeholder-gray-600"
                    spellCheck="false"
                  />
                </div>

                {/* Preview Panel */}
                <div 
                  className={`flex flex-col rounded-lg bg-gray-900/50 backdrop-blur-sm border border-gray-800/40 overflow-hidden transition-all h-[70vh] md:h-[calc(100vh-280px)] ${
                    activeTab !== 'preview' ? 'hidden md:flex' : 'flex'
                  }`}
                >
                  <div className="px-4 py-2 border-b border-gray-800/40 backdrop-blur-sm">
                    <span className="text-sm font-medium text-gray-400">Preview</span>
                  </div>
                  <div 
                    className="flex-1 overflow-auto p-4 prose prose-invert prose-pre:bg-gray-800/50 prose-pre:border prose-pre:border-gray-700/50 max-w-none [&>ul>li]:relative [&>ol>li]:relative [&>ul>li]:pl-2 [&>ol>li]:pl-2"
                  >
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({ node, inline, className, children, ...props }: CodeProps) {
                          const match = /language-(\w+)/.exec(className || '');
                          const lang = match ? match[1] : '';
                          
                          if (inline) {
                            return (
                              <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-sm" {...props}>
                                {children}
                              </code>
                            );
                          }

                          return (
                            <SyntaxHighlighter
                              style={vscDarkPlus}
                              language={lang || 'text'}
                              PreTag="div"
                              customStyle={{
                                margin: '1.5em 0',
                                borderRadius: '0.375rem',
                                background: 'rgba(17, 24, 39, 0.5)',
                              }}
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          );
                        },
                        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-white" {...props} />,
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-semibold mt-6 mb-3 text-white" {...props} />,
                        h3: ({ node, ...props }) => <h3 className="text-xl font-medium mt-4 mb-2 text-white" {...props} />,
                        p: ({ node, ...props }) => <p className="my-3 leading-relaxed" {...props} />,
                        ul: ({ node, ...props }) => (
                          <ul className="my-3 space-y-2 list-none" {...props} />
                        ),
                        ol: ({ node, ...props }) => (
                          <ol className="my-3 space-y-2 list-none" {...props} />
                        ),
                        li: ({ node, ordered, ...props }) => {
                          const className = ordered
                            ? "text-gray-300 before:absolute before:left-0 before:content-[counter(list-item)'.'] before:mr-2"
                            : "text-gray-300 before:absolute before:left-0 before:content-['•'] before:mr-2";
                          return <li className={className} {...props} />;
                        },
                        a: ({ node, ...props }) => (
                          <a 
                            className="text-blue-400 hover:text-blue-300 underline transition-colors" 
                            target="_blank"
                            rel="noopener noreferrer"
                            {...props} 
                          />
                        ),
                        blockquote: ({ node, ...props }) => (
                          <blockquote 
                            className="border-l-4 border-blue-500/50 pl-4 my-4 italic text-gray-400"
                            {...props} 
                          />
                        ),
                        hr: ({ node, ...props }) => <hr className="my-6 border-gray-700" {...props} />,
                        table: ({ node, ...props }) => (
                          <div className="overflow-x-auto my-6">
                            <table className="min-w-full divide-y divide-gray-700" {...props} />
                          </div>
                        ),
                        th: ({ node, ...props }) => (
                          <th 
                            className="px-4 py-2 bg-gray-800/50 text-left text-sm font-semibold text-gray-300"
                            {...props} 
                          />
                        ),
                        td: ({ node, ...props }) => (
                          <td 
                            className="px-4 py-2 border-t border-gray-700 text-sm"
                            {...props} 
                          />
                        ),
                      }}
                    >
                      {content || '*No content to preview*'}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

interface Tab {
  edit: string;
  preview: string;
}

const ToolbarGroup = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-0.5">
    {children}
  </div>
);

const Divider = () => (
  <div className="h-4 w-px bg-gray-700 mx-2 my-auto opacity-50" />
);

const Toolbar = ({ 
  onAction, 
  canUndo, 
  canRedo, 
  onUndo, 
  onRedo 
}: { 
  onAction: (before: string, after?: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}) => {
  const toolbarGroups = [
    {
      label: "Basic Formatting",
      tools: [
        {
          icon: <span className="font-bold">B</span>,
          label: "Bold",
          action: () => onAction("**", "**"),
          shortcut: "Ctrl+B",
          tooltip: "Make text bold (Ctrl+B)",
        },
        {
          icon: <span className="italic">I</span>,
          label: "Italic",
          action: () => onAction("*", "*"),
          shortcut: "Ctrl+I",
          tooltip: "Make text italic (Ctrl+I)",
        },
        {
          icon: <span className="line-through">S</span>,
          label: "Strikethrough",
          action: () => onAction("~~", "~~"),
          tooltip: "Strikethrough text",
        },
        {
          icon: <CodeBracketIcon className="w-4 h-4" />,
          label: "Code",
          action: () => onAction("`", "`"),
          shortcut: "Ctrl+E",
          tooltip: "Inline code (Ctrl+E)",
        },
      ],
    },
    {
      label: "Headings",
      tools: [
        {
          icon: <span className="font-bold text-lg">#</span>,
          label: "H1",
          action: () => onAction("# "),
          tooltip: "Heading 1",
        },
        {
          icon: <span className="font-bold text-lg">##</span>,
          label: "H2",
          action: () => onAction("## "),
          tooltip: "Heading 2",
        },
        {
          icon: <span className="font-bold text-lg">###</span>,
          label: "H3",
          action: () => onAction("### "),
          tooltip: "Heading 3",
        },
      ],
    },
    {
      label: "Lists",
      tools: [
        {
          icon: <ListBulletIcon className="w-4 h-4" />,
          label: "Bullet List",
          action: () => onAction("- "),
          tooltip: "Add bullet list item",
        },
        {
          icon: <Bars3Icon className="w-4 h-4" />,
          label: "Numbered List",
          action: () => onAction("1. "),
          tooltip: "Add numbered list item",
        },
        {
          icon: <span className="font-bold">[ ]</span>,
          label: "Task List",
          action: () => onAction("- [ ] "),
          tooltip: "Add task list item",
        },
      ],
    },
    {
      label: "Insert",
      tools: [
        {
          icon: <LinkIcon className="w-4 h-4" />,
          label: "Link",
          action: () => onAction("[", "](url)"),
          tooltip: "Add link [text](url)",
        },
        {
          icon: <PhotoIcon className="w-4 h-4" />,
          label: "Image",
          action: () => onAction("![alt text](", ")"),
          tooltip: "Add image ![alt](url)",
        },
        {
          icon: <TableCellsIcon className="w-4 h-4" />,
          label: "Table",
          action: () => onAction("| Header | Header |\n| --- | --- |\n| Cell | Cell |"),
          tooltip: "Insert table",
        },
      ],
    },
    {
      label: "Blocks",
      tools: [
        {
          icon: <CodeBracketIcon className="w-4 h-4" />,
          label: "Code Block",
          action: () => onAction("\n```\n", "\n```\n"),
          tooltip: "Add code block",
        },
        {
          icon: <span className="font-bold">&gt;</span>,
          label: "Blockquote",
          action: () => onAction("> "),
          tooltip: "Add blockquote",
        },
        {
          icon: <span className="font-bold">―</span>,
          label: "Horizontal Rule",
          action: () => onAction("\n---\n"),
          tooltip: "Add horizontal rule",
        },
      ],
    },
  ];

  return (
    <div className="py-1 px-2 bg-gray-800/50 border-y border-gray-700/50">
      <div className="flex flex-wrap items-center justify-center gap-1">
        {toolbarGroups.map((group, groupIndex) => (
          <Fragment key={group.label}>
            <ToolbarGroup>
              {group.tools.map((tool, toolIndex) => (
                <div key={toolIndex} className="relative group">
                  <button
                    onClick={tool.action}
                    className="p-1 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all"
                    title={tool.shortcut ? `${tool.label} (${tool.shortcut})` : tool.label}
                  >
                    {tool.icon}
                  </button>
                  <div className="absolute z-10 invisible group-hover:visible bg-gray-800 text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap -bottom-7 left-1/2 transform -translate-x-1/2">
                    {tool.tooltip}
                  </div>
                </div>
              ))}
            </ToolbarGroup>
            {groupIndex < toolbarGroups.length - 1 && <Divider />}
          </Fragment>
        ))}
        <Divider />
        <ToolbarGroup>
          <div className="flex gap-0.5">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 10h10a5 5 0 0 1 5 5v2" />
                <path d="m3 10 5-5" />
                <path d="m3 10 5 5" />
              </svg>
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-full transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10H11a5 5 0 0 0-5 5v2" />
                <path d="m21 10-5-5" />
                <path d="m21 10-5 5" />
              </svg>
            </button>
          </div>
        </ToolbarGroup>
      </div>
    </div>
  );
};
