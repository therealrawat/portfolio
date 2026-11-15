import { motion, type Variants } from 'framer-motion';
import { MoveUpRight } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';
import BlurText from './reactbits/BlurText';
import ShinyText from './reactbits/ShinyText';

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
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <section className="min-h-screen flex flex-col justify-center relative overflow-hidden px-6 md:px-20 pt-28 pb-16">
      {/* White Radial Spotlight Ambient Glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-white/[0.03] blur-[150px] z-0" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto w-full"
      >
        {/* Availability Badge */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-8 flex-wrap pointer-events-auto">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#070709]/90 border border-white/20 rounded-xl text-xs text-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.1)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <ShinyText text="Open to Strategic Engineering & Product Roles" speed={3.5} className="font-semibold text-xs" />
          </div>
        </motion.div>

        {/* Impact Headline with ReactBits Decrypted Text */}
        <motion.div variants={itemVariants} className="mb-8 select-none">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-white leading-[0.92] tracking-tighter">
            <div className="pointer-events-auto inline-block">
              <DecryptedText
                text="SOLVING"
                speed={35}
                maxIterations={10}
                animateOn="view"
                encryptedClassName="text-white/60"
              />
            </div>
            <br />
            <span
              className="text-transparent transition-all duration-500"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.3)',
                textShadow: '0 0 45px rgba(255,255,255,0.15)',
              }}
            >
              OPERATIONAL
            </span>{' '}
            <br />
            <div className="pointer-events-auto inline-block">
              <DecryptedText
                text="DEBT."
                speed={40}
                maxIterations={10}
                animateOn="view"
                encryptedClassName="text-white/60"
              />
            </div>
          </h1>
        </motion.div>

        {/* Narrative & CTAs */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 pt-8 border-t border-white/[0.08]">
          <motion.div
            variants={itemVariants}
            className="text-lg md:text-xl lg:text-2xl text-neutral-300 max-w-2xl leading-relaxed font-light"
          >
            <BlurText
              text="I bridge the gap between complex engineering systems and strategic product growth. Designing resilient microservices and AI-driven products that deliver measurable business value."
              delay={40}
              animateBy="words"
              direction="bottom"
              className="text-neutral-300 font-light"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 pointer-events-auto">
            {/* Primary CTA */}
            <button
              onClick={() => scrollToSection('contact')}
              className="group relative px-8 py-4 sm:px-10 sm:py-5 bg-white text-black font-bold uppercase text-xs tracking-widest overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)] rounded-xl"
            >
              <span className="relative z-10 flex items-center gap-2">
                Let's Connect
                <MoveUpRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 text-black" />
              </span>
              <div className="absolute inset-0 bg-neutral-200 translate-y-full transition-transform duration-500 group-hover:translate-y-0" />
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Monogram */}
      <div className="absolute -bottom-16 -right-10 text-[18vw] font-black text-white/[0.015] pointer-events-none select-none z-0">
        PM+ENG
      </div>
    </section>
  );
}
