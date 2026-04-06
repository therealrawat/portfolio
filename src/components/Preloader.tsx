import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setComplete(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: '-100%',
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
        >
          <div className="relative overflow-hidden px-8">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-baseline gap-4"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white">
                PRIYANSHU.
              </h1>
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                className="h-1 w-12 md:w-20 bg-white origin-left"
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="mt-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-medium"
            >
              <span>Portfolio {new Date().getFullYear()}</span>
              <span>Loading Experience</span>
            </motion.div>
          </div>

          {/* Decorative bars for premium feel */}
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-10 left-10 w-[1px] h-20 bg-neutral-800"
          />
          <motion.div 
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 1.6, duration: 0.5 }}
            className="absolute top-10 right-10 w-[1px] h-20 bg-neutral-800"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
