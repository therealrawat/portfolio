import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ─── Testimonial Data ──────────────────────────────────────────────────── */

const testimonials = [
  {
    quote:
      "Priyanshu brings an exceptional blend of product thinking and engineering execution. He doesn't just build features \u2014 he solves the right problems with clarity and speed.",
    name: 'ADITYA KUMAR',
    title: 'Co-Founder & CTO at TechVenture',
    prefix: 'ADITYA SAID',
    initials: 'AK',
  },
  {
    quote:
      'Working with Priyanshu was a game-changer. He transformed our chaotic workflows into intelligent, automated systems that saved us hundreds of hours every month.',
    name: 'NEHA SHARMA',
    title: 'Head of Product at ScaleOps',
    prefix: 'NEHA SAID',
    initials: 'NS',
  },
  {
    quote:
      'His ability to understand both the technical constraints and the business impact is rare. Every product decision was backed by data and delivered with precision.',
    name: 'RAHUL MEHTA',
    title: 'VP of Engineering at CloudFirst',
    prefix: 'RAHUL SAID',
    initials: 'RM',
  },
  {
    quote:
      "Priyanshu doesn't just ship code \u2014 he ships outcomes. His AI-driven solutions were the most impactful addition to our product in years.",
    name: 'SARAH CHEN',
    title: 'Director of Innovation at NovaTech',
    prefix: 'SARAH SAID',
    initials: 'SC',
  },
];

/* ─── Animation Variants ─────────────────────────────────────────────────── */

const quoteVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.76, 0, 0.24, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.4,
      ease: [0.76, 0, 0.24, 1],
    },
  }),
};

const metaVariants = {
  enter: { y: 12, opacity: 0 },
  center: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, delay: 0.15, ease: [0.76, 0, 0.24, 1] },
  },
  exit: {
    y: -12,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Testimonials() {
  const [[activeIndex, direction], setActiveIndex] = useState([0, 0]);

  const paginate = (newDirection: number) => {
    setActiveIndex((prev) => {
      const next = prev[0] + newDirection;
      if (next < 0) return [testimonials.length - 1, newDirection];
      if (next >= testimonials.length) return [0, newDirection];
      return [next, newDirection];
    });
  };

  const current = testimonials[activeIndex];

  return (
    <section id="testimonials" className="py-32 md:py-40 px-8 md:px-20 bg-white relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full bg-black/[0.012] blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* ── Header: Large title with avatar circle ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="text-center mb-8"
        >
          {/* Title with overlapping avatar ring */}
          <div className="relative inline-block">
            {/* Avatar circle behind the "T" */}
            <div className="absolute -top-6 -left-4 md:-top-8 md:-left-6 w-20 h-20 md:w-28 md:h-28 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center overflow-hidden z-0">
              <span className="text-2xl md:text-4xl font-black text-neutral-400 select-none">
                {current.initials}
              </span>
            </div>

            <h2 className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-black tracking-tighter">
              TESTIMONIALS
            </h2>
          </div>
        </motion.div>

        {/* ── Subtitle ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="flex items-center justify-center gap-3 mb-20 md:mb-28"
        >
          {/* <div className="w-8 h-8 rounded-full border border-neutral-700 flex items-center justify-center">
            <Play className="w-3 h-3 text-neutral-400 ml-0.5" />
          </div> */}
          <span className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-neutral-500 font-bold">
            What collaborators are saying
          </span>
        </motion.div>

        {/* ── Quote Carousel ── */}
        <div className="min-h-[220px] md:min-h-[200px] relative mb-16 md:mb-20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={quoteVariants as any}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0"
            >
              {/* Prefix label */}
              <div className="flex items-start gap-4 md:gap-6 max-w-4xl mx-auto">
                <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-neutral-400 font-bold mt-3 whitespace-nowrap min-w-[100px]">
                  {current.prefix}
                </span>

                <p className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-medium text-black leading-snug tracking-tight">
                  {current.quote}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer: Avatar + Name + Nav Arrows ── */}
        <div className="flex items-center justify-between max-w-4xl mx-auto pt-8 border-t border-neutral-200">
          {/* Person info */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              variants={metaVariants as any}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex items-center gap-4"
            >
              {/* Avatar circle */}
              <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-neutral-500">
                  {current.initials}
                </span>
              </div>

              <div>
                <div className="text-[12px] font-bold text-black tracking-wider uppercase">
                  {current.name}
                </div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  {current.title}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            {/* Progress indicator */}
            
            <button
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 transition-all duration-300 hover:border-neutral-500 hover:text-black hover:bg-black/[0.03] active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 transition-all duration-300 hover:border-neutral-500 hover:text-black hover:bg-black/[0.03] active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Dot Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex([i, i > activeIndex ? 1 : -1])}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === activeIndex
                  ? 'w-8 bg-black'
                  : 'w-2 bg-neutral-300 hover:bg-neutral-500'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
