import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Download, Sparkles, Terminal, ArrowUpRight } from 'lucide-react';
import type { StationData } from '../../data/stationsData';
import { sfx } from '../../utils/audio';

interface StationModalProps {
  station: StationData | null;
  onClose: () => void;
  onOpenAI?: () => void;
}

export default function StationModal({ station, onClose, onOpenAI }: StationModalProps) {
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!station) return null;

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    sfx.playInteract();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
        {/* Backdrop click to dismiss */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl max-h-[92dvh] overflow-y-auto bg-neutral-950/95 border border-white/10 rounded-2xl p-4 sm:p-6 shadow-2xl text-white scrollbar-thin scrollbar-thumb-white/20"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 sm:pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: station.color }}
                />
                <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-mono">
                  Corporate HQ :: {station.category.toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight text-white">{station.content.title}</h2>
              <p className="text-xs sm:text-sm text-neutral-400 mt-1">{station.content.subtitle}</p>
            </div>

            <button
              onClick={() => {
                sfx.playInteract();
                onClose();
              }}
              className="p-2 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="py-3 sm:py-5 text-xs sm:text-base text-neutral-300 leading-relaxed">
            {station.content.description}
          </div>

          {/* Highlights */}
          {station.content.highlights && (
            <div className="my-2 sm:my-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold block mb-2">
                Impact, Metrics &amp; Highlights
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {station.content.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 sm:p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-xs text-neutral-300"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" style={{ color: station.color }} />
                    <span className="leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Action: Transmission / Contact */}
          {station.category === 'contact' && (
            <div className="mt-6 p-4 bg-white/[0.04] border border-white/10 rounded-xl space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block font-mono">Direct Email &amp; Scheduling</span>
                  <span className="text-sm font-semibold text-white">priyanshurawat.business@gmail.com</span>
                </div>
                <button
                  onClick={() => handleCopyEmail('priyanshurawat.business@gmail.com')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                </button>
              </div>

              {onOpenAI && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAI();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 border border-white/10 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  <Terminal className="w-4 h-4 text-orange-400" />
                  <span>Launch AI Assistant Co-Pilot</span>
                </button>
              )}
            </div>
          )}

          {/* Links Section */}
          {station.content.links && station.content.links.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
              {station.content.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sfx.playInteract()}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 ${
                    link.primary
                      ? 'bg-white text-black hover:bg-neutral-200 shadow-lg'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.url.includes('download') ? (
                    <Download className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  )}
                </a>
              ))}
            </div>
          )}

          {/* Footer controls hint */}
          <div className="mt-6 text-center">
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono">
              [ ESC or Click Outside to Return to 3D Office ]
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
