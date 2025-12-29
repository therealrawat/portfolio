import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-white"
        >
          Priyanshu Rawat
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="hidden md:flex items-center gap-8"
        >
          <button
            onClick={() => scrollToSection('projects')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('mindset')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Approach
          </button>
          <button
            onClick={() => scrollToSection('tech')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            Stack
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors text-sm font-medium"
          >
            Contact
          </button>
        </motion.div>
      </div>
    </motion.nav>
  );
}
