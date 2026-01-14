import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, CheckCircle2, Loader2 } from 'lucide-react';

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  // State to manage the download button UI
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'completed'>('idle');

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

  // Resume Download Logic
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
      // Reset back to download icon after 3 seconds
      setTimeout(() => setDownloadState('idle'), 3000);
    }, 1000);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
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

          {/* Added Resume Download Button */}
          <button
            onClick={handleDownload}
            disabled={downloadState === 'loading'}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium border ${downloadState === 'completed'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                : 'border-slate-700 text-slate-300 hover:border-indigo-500 hover:text-white'
              }`}
          >
            {downloadState === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : downloadState === 'completed' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span>{downloadState === 'loading' ? 'Opening...' : 'Resume'}</span>
          </button>
        </motion.div>
      </div>
    </motion.nav>
  );
}