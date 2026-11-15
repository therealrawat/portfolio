import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, RotateCcw, Copy, Check, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_CONTEXT, getContextForSection, type SectionContext } from '../data/bio';
import StickerPeel from './reactbits/StickerPeel';
import logo from '../assets/pr-light.svg';

/* ─── AI Assistant Tooltip Component ───────────────────────────────────── */

function AssistantTooltip({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.85, x: 10 }}
          className="fixed bottom-12 right-28 z-50 px-3.5 py-1.5 bg-[#09090f]/95 backdrop-blur-md border border-violet-500/40 text-white text-[11px] font-mono tracking-wider shadow-[0_4px_20px_rgba(139,92,246,0.25)] rounded-full pointer-events-none flex items-center gap-2"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
          </span>
          <span>Ask me anything</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Copy Button for Assistant Message ────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-1 text-neutral-500 hover:text-neutral-200 transition-colors rounded hover:bg-white/10"
      title={copied ? "Copied!" : "Copy message"}
      aria-label="Copy response"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

/* ─── Formatted Message Component ──────────────────────────────────────── */

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const tokenRegex = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[.,!?]?)/g;
  const parts = content.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        // Bold text **text**
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          const text = part.slice(2, -2);
          return (
            <strong key={i} className={isUser ? "font-bold text-white" : "font-bold text-white"}>
              {text}
            </strong>
          );
        }

        // Inline code `code`
        if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
          const code = part.slice(1, -1);
          return (
            <code
              key={i}
              className={isUser
                ? "font-mono text-xs px-1.5 py-0.5 rounded bg-black/20 text-white font-medium"
                : "font-mono text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-violet-300 font-medium"
              }
            >
              {code}
            </code>
          );
        }

        // Markdown link [label](url)
        const mdMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (mdMatch) {
          const [, label, url] = mdMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={isUser
                ? "underline font-bold text-white hover:text-neutral-200 transition-colors"
                : "text-violet-300 hover:text-violet-200 underline font-semibold transition-colors"
              }
            >
              {label}
            </a>
          );
        }

        // Raw URL
        if (/^https?:\/\//.test(part)) {
          let url = part;
          let punct = '';
          const punctMatch = url.match(/[.,!?]+$/);
          if (punctMatch) {
            punct = punctMatch[0];
            url = url.slice(0, -punct.length);
          }
          return (
            <span key={i}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={isUser
                  ? "underline font-bold text-white hover:text-neutral-200 transition-colors"
                  : "text-violet-300 hover:text-violet-200 underline font-semibold transition-colors"
                }
              >
                {url}
              </a>
              {punct}
            </span>
          );
        }

        // Email address
        if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(part)) {
          let email = part;
          let punct = '';
          const punctMatch = email.match(/[.,!?]+$/);
          if (punctMatch) {
            punct = punctMatch[0];
            email = email.slice(0, -punct.length);
          }
          return (
            <span key={i}>
              <a
                href={`mailto:${email}`}
                className={isUser
                  ? "underline font-bold text-white hover:text-neutral-200 transition-colors"
                  : "text-violet-300 hover:text-violet-200 underline font-semibold transition-colors"
                }
              >
                {email}
              </a>
              {punct}
            </span>
          );
        }

        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── Suggested Quick Prompts ─────────────────────────────────────────── */

const QUICK_PROMPTS = [
  { label: 'Immoral Combat', prompt: 'Tell me about the Immoral Combat WebGL game and its architecture.' },
  { label: 'Core Tech Stack', prompt: "What is Priyanshu's core engineering tech stack?" },
  { label: 'lowwhiskey', prompt: 'What is lowwhiskey?' },
  { label: 'Contact & Hire', prompt: 'How do I reach out to Priyanshu for hiring or client work?' },
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Priyanshu's AI assistant. Ask me anything about his projects (like Immoral Combat or SyncScripts), engineering stack, product strategy, or how to get in touch!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState<SectionContext>('home');
  const [showTooltip, setShowTooltip] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShowTooltip(false);
      return;
    }
    const timer = setTimeout(() => {
      setShowTooltip(true);
      const hideTimer = setTimeout(() => setShowTooltip(false), 5000);
      return () => clearTimeout(hideTimer);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-ai-assistant', handleOpen);
    return () => window.removeEventListener('open-ai-assistant', handleOpen);
  }, []);

  useEffect(() => {
    let raf = 0;
    const handleScroll = () => {
      const sections = [
        { id: 'projects', element: document.getElementById('projects') },
        { id: 'tech', element: document.getElementById('tech') },
        { id: 'contact', element: document.getElementById('contact') },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        if (section.element) {
          const { offsetTop, offsetHeight } = section.element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section.id as SectionContext);
            return;
          }
        }
      }

      if (window.scrollY < window.innerHeight) {
        setCurrentSection('home');
      }
    };

    const onScroll = () => {
      if (raf !== 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        handleScroll();
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: "Conversation reset. Feel free to ask another question about Priyanshu's work, experience, or collaborations."
      }
    ]);
  };

  const sendMessage = async (overridePrompt?: string) => {
    const promptToSend = (overridePrompt ?? input).trim();
    if (!promptToSend || isLoading) return;

    const userMessage: Message = { role: 'user', content: promptToSend };
    setMessages(prev => [...prev, userMessage]);
    if (!overridePrompt) setInput('');
    setIsLoading(true);

    try {
      const sectionContext = getContextForSection(currentSection);
      const systemPrompt = `You are a helpful and welcoming AI assistant representing Priyanshu Rawat's portfolio. You help recruiters, hiring managers, potential clients, and visitors understand his work, projects, engineering approach, and facilitate connecting with him.

Current Context (based on the page section the user is viewing):
${sectionContext}

Portfolio Information:
${JSON.stringify(PORTFOLIO_CONTEXT, null, 2)}

Official Contact Details:
- Emails: priyanshurawat.business@gmail.com, therealrawat@gmail.com
- LinkedIn: https://linkedin.com/in/rawat-priyanshu
- Instagram: https://instagram.com/lowwhiskey (@lowwhiskey)
- GitHub: https://github.com/therealrawat

Your Role & Contact Policy:
- Answer questions about Priyanshu's work, projects, background, and product engineering philosophy.
- CONTACT REQUESTS: When a user asks how to contact Priyanshu, asks for his email, LinkedIn, Instagram, or social profiles, or asks about hiring him, collaborating, or getting in touch, NEVER discourage them or refuse to share details. Enthusiastically provide his contact details:
  * Emails: priyanshurawat.business@gmail.com or therealrawat@gmail.com
  * LinkedIn: https://linkedin.com/in/rawat-priyanshu
  * Instagram: https://instagram.com/lowwhiskey (@lowwhiskey)
  Encourage potential clients and hiring managers to reach out directly through email, LinkedIn, or Instagram.
- Be conversational, professional, encouraging, and helpful.
- Guide the conversation toward demonstrating Priyanshu's value as a Product-Minded Engineer who bridges technical execution and business value.
- Keep responses concise, clear, and informative (2-4 sentences when possible).`;

      const prompt = `${systemPrompt}\n\nUser Question: ${userMessage.content}`;
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        if (response.status === 503) {
          throw new Error("The AI is currently under high demand. Please try again in a few seconds.");
        }
        throw new Error(`Connection error (${response.status})`);
      }

      const data: { text?: string; error?: string } = await response.json();
      const responseText = data.text || '';
      if (!responseText) throw new Error('No response received');

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: unknown) {
      console.error('AI Assistant Error:', error);
      const errorMessage = error instanceof Error ? error.message : "I'm having trouble connecting. Please try again later.";
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <AssistantTooltip show={!isOpen && showTooltip} />

      {isOpen ? (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsOpen(false)}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-[0_0_28px_rgba(139,92,246,0.55)] border border-white/20 transition-all cursor-pointer"
          aria-label="Close AI Assistant"
        >
          <X className="w-6 h-6" />
        </motion.button>
      ) : (
        <div className="fixed bottom-6 right-6 z-50 w-24 h-24 flex items-center justify-center pointer-events-none">
          <StickerPeel
            imageSrc={logo}
            width={72}
            finish="holo"
            peelBackHoverPct={32}
            peelBackActivePct={48}
            curlRadius={14}
            backColor="#8B5CF6"
            lightingIntensity={0.65}
            shadowIntensity={0.6}
            followPointer={true}
            draggable={false}
            onClick={() => setIsOpen(true)}
            className="pointer-events-auto"
          />
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 35, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-24 right-4 sm:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[610px] max-h-[82vh] bg-[#08080d]/95 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(139,92,246,0.18)] flex flex-col overflow-hidden rounded-2xl"
          >
            {/* Top ambient lighting & edge glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 bg-violet-600/15 rounded-full blur-[70px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-48 h-48 bg-violet-900/10 rounded-full blur-[60px]" />
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between relative z-10 bg-[#08080d]/70 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 border border-violet-500/30 bg-violet-500/10 rounded-xl flex items-center justify-center shrink-0 p-2">
                  <img
                    src={logo}
                    alt="Priyanshu Rawat"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-[#08080d]"></span>
                  </span>
                </div>
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">
                    Priyanshu Intelligence
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-flex items-center text-[9px] font-mono font-semibold text-violet-300 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                      Live • {currentSection}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetChat}
                  className="p-2 text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors rounded-lg cursor-pointer"
                  title="Reset conversation"
                  aria-label="Reset conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-neutral-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition-colors rounded-lg cursor-pointer"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 scrollbar-hide relative z-10">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] text-[13px] leading-relaxed break-words rounded-2xl relative group ${isUser
                          ? 'bg-gradient-to-r from-violet-600 to-violet-500 text-white font-medium px-4 py-2.5 rounded-tr-xs shadow-[0_4px_16px_rgba(139,92,246,0.3)]'
                          : 'bg-white/[0.04] text-neutral-200 border border-white/[0.08] backdrop-blur-md px-4 py-3 rounded-tl-xs shadow-sm'
                        }`}
                    >
                      {!isUser && (
                        <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-white/[0.06] text-[10px] font-mono text-violet-400/90 font-medium">
                          <span className="flex items-center gap-1.5 uppercase tracking-wider text-violet-300">
                            <img src={logo} alt="Priyanshu Rawat" className="w-3.5 h-3.5 object-contain opacity-90" />
                            Priyanshu AI
                          </span>
                          <CopyButton text={message.content} />
                        </div>
                      )}
                      <div>
                        <FormattedMessage content={message.content} isUser={isUser} />
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Quick Prompts shown when conversation is fresh */}
              {messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="pt-2"
                >
                  <p className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 mb-2.5 px-0.5">
                    Suggested Questions
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {QUICK_PROMPTS.map((qp) => (
                      <button
                        key={qp.label}
                        type="button"
                        onClick={() => sendMessage(qp.prompt)}
                        className="text-left p-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-500/40 hover:bg-violet-500/10 transition-all group flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-xs text-neutral-300 group-hover:text-white font-medium pr-1">
                          {qp.label}
                        </span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Typing / Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.04] border border-white/[0.08] backdrop-blur-md px-4 py-3 rounded-2xl rounded-tl-xs flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
                    </div>
                    <span className="text-[11px] font-mono text-neutral-400">Synthesizing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3.5 sm:p-4 border-t border-white/[0.08] bg-[#08080d]/90 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-xl px-3 py-1.5 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20 focus-within:bg-white/[0.05] transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about projects, stack, hiring..."
                  className="flex-1 bg-transparent text-xs sm:text-[13px] text-white placeholder-neutral-500 focus:outline-none py-1.5 font-light"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-20 disabled:hover:bg-violet-600 text-white flex items-center justify-center transition-all shadow-[0_0_12px_rgba(139,92,246,0.35)] shrink-0 cursor-pointer"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 px-1 text-[9px] font-mono text-neutral-500">
                <span className="flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-violet-400/60" />
                  Portfolio Intelligence
                </span>
                <span>Enter ↵</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
