import { motion } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
    },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-8 md:px-20 pt-20">
      {/* Structural Lines */}
      <div className="absolute top-0 left-20 w-[1px] h-full bg-white/[0.03] hidden md:block" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-white/[0.03] hidden md:block" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        <motion.div
           variants={itemVariants}
          className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-12 font-medium"
        >
          <span className="w-12 h-[1px] bg-neutral-800" />
          Product Manager & Engineer
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl sm:text-7xl md:text-9xl font-black text-white mb-10 leading-[0.9] tracking-tighter"
        >
          SOLVING <br />
          <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>OPERATIONAL</span> <br />
          DEBT.
        </motion.h1>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-10 border-t border-neutral-900">
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-neutral-400 max-w-2xl leading-relaxed"
          >
            I bridge the gap between complex engineering systems and strategic product growth. 
            Designing AI-driven products that actually work.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-6"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative px-10 py-5 bg-white text-black font-bold uppercase text-xs tracking-widest overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Work
                <MoveUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
              <div className="absolute inset-0 bg-neutral-200 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
            </button>
            
            <button
              onClick={() => scrollToSection('experience')}
              className="group px-10 py-5 border border-neutral-800 text-white font-bold uppercase text-xs tracking-widest hover:border-white transition-colors duration-500"
            >
              Contact
            </button>
          </motion.div>
        </div>

        <motion.div
          variants={itemVariants}
          className="mt-24 flex items-center gap-10 text-[10px] uppercase tracking-widest text-neutral-600 font-bold"
        >
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span>Currently building at therealrawat</span>
          </div>
          <span className="hidden sm:block opacity-30">|</span>
          <span className="hidden sm:block">Scroll to explore</span>
        </motion.div>
      </motion.div>

      {/* Background Decorative Element */}
      <div className="absolute -bottom-20 -right-20 text-[20vw] font-black text-white/[0.02] pointer-events-none select-none">
        PM+ENG
      </div>
    </section>
  );
}

