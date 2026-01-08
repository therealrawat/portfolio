import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { PORTFOLIO_CONTEXT, getContextForSection, type SectionContext } from '../data/bio';

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

  // Detect which section is currently in view
  useEffect(() => {
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

      // Default to home if in hero section
      if (window.scrollY < window.innerHeight) {
        setCurrentSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to bottom when new messages arrive
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
        throw new Error('Gemini API key not found. Please add VITE_GEMINI_API_KEY to your .env file.');
      }

      const sectionContext = getContextForSection(currentSection);
      const systemPrompt = `You are a helpful AI assistant representing Priyanshu Rawat's portfolio. You help recruiters and visitors understand his work, projects, and approach.

Current Context (based on the page section the user is viewing):
${sectionContext}

Portfolio Information:
${JSON.stringify(PORTFOLIO_CONTEXT, null, 2)}

Your role:
- Answer questions about Priyanshu's work, projects, and philosophy
- Provide context-aware responses based on which section the user is viewing
- If they're viewing projects, emphasize engineering details
- If they're viewing the mindset/approach section, emphasize PM philosophy
- Be conversational, professional, and helpful
- Guide the conversation toward demonstrating Priyanshu's value as a Product-Minded Engineer
- Keep responses concise but informative (2-3 sentences when possible)
- If asked about something not in the context, politely redirect to what you know about Priyanshu's work`;

      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${apiKey}`,
      //   },
      //   body: JSON.stringify({
      //     model: 'gpt-4o-mini',
      //     messages: [
      //       { role: 'system', content: systemPrompt },
      //       ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      //       { role: 'user', content: input },
      //     ],
      //     temperature: 0.7,
      //     max_tokens: 300,
      //   }),
      // });

      /* Using Gemini API */
      const ai = new GoogleGenAI({ apiKey });
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: systemPrompt,
      });
      
      const responseText = response.text || '';
      
      if (!responseText) {
        throw new Error('No response text received from API');
      }

      // const response = await fetch('https://gemini.googleapis.com/v1beta2/models/gemini-1.5-pro-chat:generateMessage', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${apiKey}`,
      //   },
      //   body: JSON.stringify({
      //     model: 'gemini-2.5-flash',
      //     messages: [
      //       { role: 'system', content: systemPrompt },
      //       ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      //       { role: 'user', content: input },
      //     ],
      //     temperature: 0.7,
      //     max_tokens: 300,
      //   }),
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.error?.message || 'Failed to get response from AI');
      // }

      const data = await response.text;
      const assistantMessage: Message = {
        role: 'assistant',
        content: data || 'Sorry, I could not generate a response.',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'Sorry, there was an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
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
      {/* Backdrop Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-500/50 flex items-center justify-center text-white hover:shadow-indigo-500/70 transition-all duration-300"
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed bottom-24 right-6 z-50 w-96 h-[600px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Assistant</h3>
                  <p className="text-xs text-indigo-100">
                    {currentSection === 'home' && 'Home'}
                    {currentSection === 'projects' && 'Viewing Projects'}
                    {currentSection === 'mindset' && 'Viewing Approach'}
                    {currentSection === 'tech' && 'Viewing Tech Stack'}
                    {currentSection === 'contact' && 'Contact Section'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-white hover:bg-white/30 rounded-lg transition-colors bg-white/10 border border-white/20"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 rounded-2xl px-4 py-2">
                    <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-2 text-center">
                Context-aware based on current section
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

