import { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useVelocity, useSpring } from 'framer-motion';
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
  const sectionRef = useRef<HTMLElement>(null);

  /* ── Scroll-linked color inversion ── */
  const { scrollYProgress, scrollY } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* ── Fluid wave: driven by scroll velocity ── */
  const scrollVelocity = useVelocity(scrollY);
  // Absolute velocity → always pushes upward regardless of scroll direction
  const rawAmplitude = useTransform(scrollVelocity, (v: number) => Math.min(Math.abs(v) / 80, 30));
  const waveAmplitude = useSpring(rawAmplitude, { stiffness: 150, damping: 12, mass: 0.6 });

  // Single centered wave bump — flat on edges, bell curve in the middle
  const wavePathD = useTransform(waveAmplitude, (amp: number) => {
    const h = 60;
    const base = 58;
    // Flat left → smooth rise → centered peak → smooth fall → flat right
    return [
      `M0,${h}`,
      `L0,${base}`,
      `L400,${base}`,
      `C550,${base} 600,${base - amp} 750,${base - amp}`,
      `C900,${base - amp} 950,${base} 1100,${base}`,
      `L1500,${base}`,
      `L1500,${h}`,
      'Z',
    ].join(' ');
  });

  // Background: white → black (snaps at ~36%)
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#ffffff', '#ffffff', '#000000']
  );

  // Primary text: black → white
  const textColor = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#000000', '#000000', '#ffffff']
  );

  // Muted text
  const mutedColor = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#a3a3a3', '#a3a3a3', '#737373']
  );

  // Borders
  const borderColor = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#d4d4d4', '#d4d4d4', '#262626']
  );

  // Avatar bg
  const avatarBg = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#f5f5f5', '#f5f5f5', '#171717']
  );

  // Dot inactive
  const dotInactive = useTransform(
    scrollYProgress,
    [0, 0.36, 0.40],
    ['#d4d4d4', '#d4d4d4', '#404040']
  );

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
    <motion.section
      ref={sectionRef}
      id="testimonials"
      className="py-32 md:py-40 px-8 md:px-20 relative"
      style={{ backgroundColor: bgColor }}
    >
      {/* ── Fluid wave top border ── */}
      <div className="absolute -top-[58px] left-0 right-0 h-[60px] pointer-events-none z-20 overflow-visible">
        <svg
          viewBox="0 0 1500 60"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          <motion.path
            d={wavePathD as any}
            style={{ fill: bgColor }}
          />
        </svg>
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
            <motion.div
              className="absolute -top-6 -left-4 md:-top-8 md:-left-6 w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center overflow-hidden z-0"
              style={{
                backgroundColor: avatarBg,
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor,
              }}
            >
              <motion.span
                className="text-2xl md:text-4xl font-black select-none"
                style={{ color: mutedColor }}
              >
                {current.initials}
              </motion.span>
            </motion.div>

            <motion.h2
              className="relative z-10 text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter"
              style={{ color: textColor }}
            >
              TESTIMONIALS
            </motion.h2>
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
          <motion.span
            className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] font-bold"
            style={{ color: mutedColor }}
          >
            What collaborators are saying
          </motion.span>
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
              {/* Prefix label + quote */}
              <div className="flex items-start gap-4 md:gap-6 max-w-4xl mx-auto">
                <motion.span
                  className="hidden md:block text-[10px] uppercase tracking-[0.3em] font-bold mt-3 whitespace-nowrap min-w-[100px]"
                  style={{ color: mutedColor }}
                >
                  {current.prefix}
                </motion.span>

                <motion.p
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-medium leading-snug tracking-tight"
                  style={{ color: textColor }}
                >
                  {current.quote}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Footer: Avatar + Name + Nav Arrows ── */}
        <motion.div
          className="flex items-center justify-between max-w-4xl mx-auto pt-8"
          style={{ borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: borderColor }}
        >
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
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  backgroundColor: avatarBg,
                  borderWidth: 1,
                  borderStyle: 'solid',
                  borderColor,
                }}
              >
                <motion.span
                  className="text-sm font-bold"
                  style={{ color: mutedColor }}
                >
                  {current.initials}
                </motion.span>
              </motion.div>

              <div>
                <motion.div
                  className="text-[12px] font-bold tracking-wider uppercase"
                  style={{ color: textColor }}
                >
                  {current.name}
                </motion.div>
                <motion.div
                  className="text-[11px] mt-0.5"
                  style={{ color: mutedColor }}
                >
                  {current.title}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => paginate(-1)}
              aria-label="Previous testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor,
                color: mutedColor,
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </motion.button>

            <motion.button
              onClick={() => paginate(1)}
              aria-label="Next testimonial"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95"
              style={{
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor,
                color: mutedColor,
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>

        {/* ── Dot Indicators ── */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveIndex([i, i > activeIndex ? 1 : -1])}
              aria-label={`Go to testimonial ${i + 1}`}
              className="h-1 rounded-full transition-all duration-500"
              style={{
                width: i === activeIndex ? 32 : 8,
                backgroundColor: i === activeIndex ? textColor : dotInactive,
              }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
