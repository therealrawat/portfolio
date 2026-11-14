import { motion, type Variants } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';

export default function Hero() {

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 md:px-20 pt-24 pb-16">
      {/* Structural Lines */}
      <div className="absolute top-0 left-20 w-[1px] h-full bg-white/[0.03] hidden md:block" />
      <div className="absolute top-0 right-20 w-[1px] h-full bg-white/[0.03] hidden md:block" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        {/* Availability Badge */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8 flex-wrap">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/[0.04] border border-white/10 rounded-full text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">Open to Strategic Engineering & Product Roles</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-semibold">
            <span className="w-8 h-[1px] bg-neutral-800" />
            MCA • 8.93 CGPA • AFSB Rec.
          </div>
        </motion.div>

        {/* Impact Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-[0.92] tracking-tighter"
        >
          SOLVING <br />
          <span
            className="text-transparent"
            style={{
              WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
              textShadow: '0 0 40px rgba(255,255,255,0.05)',
            }}
          >
            OPERATIONAL
          </span>{' '}
          <br />
          DEBT.
        </motion.h1>

        {/* Narrative & CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-8 border-t border-white/[0.08]">
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-neutral-400 max-w-2xl leading-relaxed font-light"
          >
            I bridge the gap between complex engineering systems and strategic product growth.
            Designing resilient microservices and AI-driven products that deliver measurable business value.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
            {/* Primary CTA */}
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-bold uppercase text-xs tracking-widest overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Work
                <MoveUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </span>
              <div className="absolute inset-0 bg-neutral-200 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
            </button>

            {/* Contact Anchor */}
            <button
              onClick={() => scrollToSection('experience')}
              className="px-6 py-4 sm:px-8 sm:py-5 border border-white/10 text-neutral-400 hover:text-white font-bold uppercase text-xs tracking-widest hover:border-white transition-colors duration-500"
            >
              Trajectory
            </button>
          </motion.div>
        </div>

        {/* Footer Meta */}
        <motion.div
          variants={itemVariants}
          className="mt-16 flex items-center gap-8 text-[10px] uppercase tracking-widest text-neutral-500 font-semibold flex-wrap"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span>Senior Product Engineer @ TestingXperts</span>
          </div>
          <span className="opacity-25 hidden sm:inline">•</span>
          <span className="hidden sm:inline">Discovery → PRD → Architecture → Build → Scale</span>
        </motion.div>
      </motion.div>

      {/* Background Decorative Monogram */}
      <div className="absolute -bottom-16 -right-10 text-[18vw] font-black text-white/[0.015] pointer-events-none select-none">
        PM+ENG
      </div>
    </section>
  );
}
