import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2 } from 'lucide-react';
import { PORTFOLIO_CONTEXT, getContextForSection, type SectionContext } from '../data/bio';
import logo from '../assets/pr-light.svg';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Warm the GenAI bundle as soon as the panel opens so the first send feels instant.
  useEffect(() => {
    if (!isOpen) return;
    void import('@google/genai');
  }, [isOpen]);

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
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key not found.');
      }

      const sectionContext = getContextForSection(currentSection);
      const systemPrompt = `You are a helpful AI assistant representing Priyanshu Rawat's portfolio. You help recruiters and visitors understand his work, projects, and approach.

Current Context (based on the page section the user is viewing):
${sectionContext}

Portfolio Information:
${JSON.stringify(PORTFOLIO_CONTEXT, null, 2)}

Your role:
- Answer questions about Priyanshu's work, projects, and philosophy
- Be conversational, professional, and helpful
- Guide the conversation toward demonstrating Priyanshu's value as a Product-Minded Engineer
- Keep responses concise but informative (2-3 sentences when possible)`;

      const prompt = `${systemPrompt}\n\nUser Question: ${userMessage.content}`;
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const responseText = response.text || '';
      if (!responseText) throw new Error('No response received');

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseText,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant Error:', error);
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

      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 flex items-center justify-center transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? (
          <X className="w-8 h-8 text-white" />
        ) : (
          <img src={logo} alt="AI Assistant" className="w-12 h-12 object-contain" />
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-28 right-8 z-50 w-[90vw] md:w-[400px] h-[600px] bg-black border border-white/10 shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 border border-white/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">AI ASSISTANT</h3>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">
                    {currentSection}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${message.role === 'user'
                      ? 'bg-white text-black font-medium'
                      : 'bg-neutral-900 text-neutral-300 border border-neutral-800'
                      }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-900 border border-neutral-800 px-4 py-3">
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-white/10 bg-black">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="ASK ME ANYTHING..."
                  className="flex-1 bg-neutral-950 border border-neutral-900 px-4 py-3 text-white placeholder-neutral-700 focus:outline-none focus:border-white transition-colors text-[10px] uppercase tracking-widest font-bold"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 bg-white flex items-center justify-center text-black disabled:opacity-20 transition-opacity"
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

