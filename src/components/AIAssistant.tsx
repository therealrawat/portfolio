import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { PORTFOLIO_CONTEXT, getContextForSection, type SectionContext } from '../data/bio';
import StickerPeel from './reactbits/StickerPeel';
import logo from '../assets/pr-light.svg';

/* ─── AI Assistant Tooltip Component ───────────────────────────────────── */

function AssistantTooltip({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 10 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 10 }}
          className="fixed bottom-12 right-28 z-50 px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl rounded-lg pointer-events-none"
        >
          Hi! Ask me anything
          <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FormattedMessage({ content, isUser }: { content: string; isUser: boolean }) {
  const tokenRegex = /(\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s)]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}[.,!?]?)/g;
  const parts = content.split(tokenRegex);

  return (
    <>
      {parts.map((part, i) => {
        if (!part) return null;

        const mdMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (mdMatch) {
          const [, label, url] = mdMatch;
          return (
            <a
              key={i}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={isUser ? "underline font-bold" : "text-white underline hover:text-neutral-400 font-bold transition-colors"}
            >
              {label}
            </a>
          );
        }

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
                className={isUser ? "underline font-bold" : "text-white underline hover:text-neutral-400 font-bold transition-colors"}
              >
                {url}
              </a>
              {punct}
            </span>
          );
        }

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
                className={isUser ? "underline font-bold" : "text-white underline hover:text-neutral-400 font-bold transition-colors"}
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm your AI assistant. I can help answer questions about Priyanshu's work, projects, and approach. What would you like to know?"
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
        { id: 'mindset', element: document.getElementById('mindset') },
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
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
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
        // Handle the 503/429 errors we discussed
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(false)}
          className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.6)] transition-all cursor-pointer"
          aria-label="Close AI Assistant"
        >
          <X className="w-7 h-7" />
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
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-28 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] bg-[#070709] border border-violet-500/30 shadow-[0_0_40px_rgba(139,92,246,0.15)] flex flex-col overflow-hidden rounded-2xl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-violet-500/30 bg-violet-500/10 rounded-xl flex items-center justify-center">
                  <Bot className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">AI ASSISTANT</h3>
                  <p className="text-[10px] text-violet-400/80 uppercase tracking-widest font-bold">
                    {currentSection}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors rounded-lg"
                aria-label="Close AI Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 scrollbar-hide">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words rounded-xl ${message.role === 'user'
                      ? 'bg-white text-black font-medium'
                      : 'bg-white/[0.04] text-neutral-200 border border-white/10'
                      }`}
                  >
                    <FormattedMessage content={message.content} isUser={message.role === 'user'} />
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.04] border border-white/10 px-4 py-3 rounded-xl">
                    <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-white/10 bg-[#070709]">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ASK ME ANYTHING..."
                  className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-colors text-[10px] uppercase tracking-widest font-bold"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-white hover:bg-violet-400 rounded-xl flex items-center justify-center text-black disabled:opacity-20 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

