import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import logo from '../assets/pr-light.svg';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'completed'>('idle');

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleDownload = () => {
    setDownloadState('loading');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = 'https://drive.google.com/uc?export=download&id=1kUrtfQCpxHjxxPDoP4tRE257u_-abUWf';
      link.download = 'Priyanshu_Rawat_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadState('completed');
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-4 bg-black/80 backdrop-blur-md border-b border-white/5'
          : 'py-8 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-20 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2.5 group"
        >
          <img 
            src={logo} 
            alt="Priyanshu Rawat Logo" 
            className="h-[1.1rem] w-auto opacity-90 transition-transform duration-500 group-hover:scale-110" 
          />
          <span className="text-xl font-black tracking-tighter text-white leading-none">
            PR.
          </span>
        </button>

        <div className="flex items-center gap-12">
          <div className="hidden md:flex items-center gap-10">
            {['projects', 'mindset', 'tech'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors font-bold"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            onClick={handleDownload}
            disabled={downloadState === 'loading'}
            className={`group flex items-center gap-3 px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 border ${
              downloadState === 'completed'
                ? 'bg-white text-black border-white'
                : 'border-white/10 text-white hover:bg-white hover:text-black hover:border-white'
            }`}
          >
            {downloadState === 'loading' ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : downloadState === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            )}
            <span>{downloadState === 'loading' ? 'Opening...' : 'Resume'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] bg-white origin-left z-[60]"
        style={{ scaleX: scrollProgress / 100 }}
      />
    </motion.nav>
  );
}