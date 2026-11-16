import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, ArrowUpRight, Menu, X, Sparkles } from 'lucide-react';
import logo from '../assets/pr-light.svg';
import { navigateTo, getCurrentRoute, type PageRoute } from '../utils/navigation';
import { getCursorActive, toggleCursorActive } from '../utils/cursorState';

const LinkedinFilledIcon = ({ className = 'w-3.5 h-3.5' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
    />
  </svg>
);

interface NavItem {
  label: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: 'About Me', id: 'about' },
  { label: 'Projects', id: 'projects' },
  { label: 'Review', id: 'testimonials' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [downloadState, setDownloadState] = useState<'idle' | 'loading' | 'completed'>('idle');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getCurrentRoute);
  const [cursorActive, setCursorActiveState] = useState<boolean>(getCursorActive);

  useEffect(() => {
    const handleCursorSync = () => {
      setCursorActiveState(getCursorActive());
    };
    window.addEventListener('ghost-cursor-changed', handleCursorSync);
    return () => window.removeEventListener('ghost-cursor-changed', handleCursorSync);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(scrolled);
    };

    const syncRoute = () => {
      setCurrentRoute(getCurrentRoute());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('popstate', syncRoute);
    window.addEventListener('app-route-change', syncRoute);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('app-route-change', syncRoute);
    };
  }, []);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);

    if (id === 'about') {
      if (currentRoute === 'about') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTo('about');
      }
      return;
    }

    if (id === 'projects') {
      if (currentRoute === 'projects') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigateTo('projects');
      }
      return;
    }

    if (id === 'testimonials') {
      if (currentRoute !== 'home') {
        navigateTo('home', 'testimonials');
      } else {
        const element = document.getElementById('testimonials');
        element?.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
  };

  const handleLogoClick = () => {
    if (currentRoute !== 'home') {
      navigateTo('home');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    <>
      {/* Scroll Progress Bar at very top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-violet-600 via-violet-400 to-white origin-left z-[70] shadow-[0_0_12px_rgba(139,92,246,0.8)] pointer-events-none"
        style={{ scaleX: scrollProgress / 100 }}
      />

      {/* Floating Header Container */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'pt-3 md:pt-4 px-4' : 'pt-0 px-0'
          }`}
      >
        <motion.div
          layout
          transition={{
            type: 'spring',
            stiffness: 280,
            damping: 28,
          }}
          className={`pointer-events-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled || currentRoute === 'about'
              ? 'w-full max-w-4xl py-2 px-3 sm:px-4 bg-[#0c0c11]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/80'
              : 'w-full max-w-7xl py-5 px-6 md:px-12 bg-transparent border border-transparent'
            }`}
        >
          {/* Left: Brand + Slash + Nav Links */}
          <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
            {/* Brand Logo */}
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-2 group shrink-0 cursor-pointer"
              aria-label="Home"
            >
              <div className="relative flex items-center justify-center">
                <img
                  src={logo}
                  alt="Priyanshu Rawat Logo"
                  className="h-4 sm:h-[1.15rem] w-auto opacity-95 transition-transform duration-300 group-hover:scale-110"
                />
                <span className="absolute -inset-1 rounded-full bg-violet-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <span className="text-sm sm:text-base font-black tracking-tight text-white leading-none whitespace-nowrap">
                Priyanshu<span className="text-violet-400">.</span>
              </span>
            </button>

            {/* Subtle Divider Slash */}
            <span className="text-neutral-700 text-sm font-light select-none hidden sm:inline">/</span>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 sm:gap-1.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const isActive =
                  (currentRoute === 'about' && item.id === 'about') ||
                  (currentRoute === 'projects' && item.id === 'projects');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${isActive
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                        : 'text-neutral-300 hover:text-white hover:bg-white/[0.04]'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Ghost Cursor Toggle Button */}
            {/* <button
              onClick={() => toggleCursorActive()}
              title={cursorActive ? 'Disable cursor smoke trail' : 'Enable cursor smoke trail'}
              aria-label="Toggle cursor effect"
              className={`hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-medium transition-all shadow-sm shrink-0 cursor-pointer ${
                cursorActive
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                  : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 transition-colors ${cursorActive ? 'text-violet-400' : 'text-neutral-500'}`} />
              <span className="hidden lg:inline text-[11px] font-mono">{cursorActive ? 'Trail: ON' : 'Trail: OFF'}</span>
            </button> */}

            {/* LinkedIn Profile Button */}
            <a
              href="https://linkedin.com/in/rawat-priyanshu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="hidden sm:inline-flex items-center justify-center gap-2 h-9 px-3.5 sm:px-4 rounded-xl border border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.08] text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-sm shrink-0"
            >
              <LinkedinFilledIcon className="w-3.5 h-3.5 text-neutral-300" />
              <span>LinkedIn</span>
            </a>

            {/* Electric Violet CTA (ReactBits style) */}
            <button
              onClick={handleDownload}
              disabled={downloadState === 'loading'}
              className="inline-flex items-center justify-center gap-2 h-9 px-3.5 sm:px-4 rounded-xl text-xs font-medium text-white bg-violet-600 hover:bg-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
            >
              {downloadState === 'loading' ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : downloadState === 'completed' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              ) : (
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              )}
              <span>{downloadState === 'loading' ? 'Opening...' : 'Resume'}</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden w-8 h-8 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-neutral-300 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-[94%] max-w-sm mt-2 p-3 bg-[#0c0c11]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black flex flex-col gap-1 md:hidden"
            >
              {navItems.map((item) => {
                const isActive =
                  (currentRoute === 'about' && item.id === 'about') ||
                  (currentRoute === 'projects' && item.id === 'projects');
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors ${isActive
                        ? 'bg-violet-500/20 text-violet-200 border border-violet-500/30'
                        : 'text-neutral-300 hover:text-white hover:bg-violet-500/10'
                      }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              <div className="pt-2 mt-1 border-t border-white/[0.08] flex items-center justify-between px-2">
                <a
                  href="https://linkedin.com/in/rawat-priyanshu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white py-1"
                >
                  <LinkedinFilledIcon className="w-3.5 h-3.5" />
                  <span>LinkedIn Profile</span>
                </a>

                <button
                  onClick={() => toggleCursorActive()}
                  className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white py-1"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${cursorActive ? 'text-violet-400' : 'text-neutral-500'}`} />
                  <span className="font-mono text-[10px]">{cursorActive ? 'Trail: ON' : 'Trail: OFF'}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
