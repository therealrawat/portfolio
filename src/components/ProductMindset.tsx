import { motion, type Variants } from 'framer-motion';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 2  Discovery — magnifier slowly scans back and forth over the doc
───────────────────────────────────────────────────────────────────────────── */
const DiscoveryIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g opacity="0.85">
      <ellipse cx="100" cy="158" rx="52" ry="10" fill="rgba(255,255,255,0.03)" />
      <path d="M52 130 L100 108 L148 130 L100 152 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      <path d="M52 116 L100 94 L148 116 L100 138 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.17)" strokeWidth="0.8" />
      <path d="M52 102 L100 80 L148 102 L100 124 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
      <path d="M52 102 L52 116 L100 138 L100 124 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <path d="M148 102 L148 116 L100 138 L100 124 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />
      <line x1="72" y1="97" x2="110" y2="111" stroke="rgba(139,92,246,0.5)" strokeWidth="0.8" />
      <line x1="72" y1="103" x2="108" y2="116" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" />
    </g>

    {/* Magnifier */}
    <motion.g
      animate={{ x: [-18, 18, -18] }}
      transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
    >
      <circle cx="114" cy="62" r="19" stroke="#8B5CF6" strokeWidth="1.5" fill="rgba(139,92,246,0.06)" />
      <circle cx="108" cy="56" r="4" fill="rgba(255,255,255,0.15)" />
      <motion.line
        x1="128" y1="76" x2="142" y2="90"
        stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round"
      />
    </motion.g>

    <motion.line
      x1="62" y1="102" x2="100" y2="84"
      stroke="rgba(139,92,246,0.4)"
      strokeWidth="1"
      strokeDasharray="4 4"
      animate={{ x1: [62, 115, 62], x2: [100, 138, 100] }}
      transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 3  PRD — animated draw-in lines
───────────────────────────────────────────────────────────────────────────── */
const PRDIllustration = () => {
  const lineData = [
    { x1: 70, y1: 74, x2: 108, y2: 88, delay: 0 },
    { x1: 70, y1: 80, x2: 106, y2: 93, delay: 0.4 },
    { x1: 70, y1: 86, x2: 98, y2: 98, delay: 0.8 },
  ];

  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <g opacity="0.85">
        <ellipse cx="100" cy="155" rx="50" ry="9" fill="rgba(255,255,255,0.03)" />
        <path d="M55 120 L100 96 L145 120 L100 144 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.17)" strokeWidth="0.8" />
        <path d="M55 120 L55 80 L100 56 L100 96 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.19)" strokeWidth="0.8" />
        <path d="M145 120 L145 80 L100 56 L100 96 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <path d="M55 80 L100 56 L145 80 L100 104 Z" fill="rgba(139,92,246,0.06)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
        <path d="M75 68 L100 55 L125 68 L100 81 Z" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.27)" strokeWidth="0.8" />
      </g>

      {lineData.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x1} y2={l.y1}
          stroke={i === 1 ? '#8B5CF6' : 'rgba(255,255,255,0.4)'}
          strokeWidth="1"
          strokeLinecap="round"
          animate={{
            x2: [l.x1, l.x2, l.x2, l.x1],
            y2: [l.y1, l.y2, l.y2, l.y1],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3.6,
            delay: l.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
        />
      ))}
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 4  Architecture — dynamic server nodes
───────────────────────────────────────────────────────────────────────────── */
const ArchitectureIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g opacity="0.85">
      <ellipse cx="100" cy="155" rx="55" ry="10" fill="rgba(255,255,255,0.03)" />
      {/* Node 1 */}
      <rect x="40" y="90" width="36" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
      {/* Node 2 (Center / Violet) */}
      <rect x="82" y="65" width="36" height="40" rx="6" fill="rgba(139,92,246,0.08)" stroke="#8B5CF6" strokeWidth="1" />
      {/* Node 3 */}
      <rect x="124" y="90" width="36" height="40" rx="6" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />

      {/* Connection wires */}
      <line x1="76" y1="105" x2="82" y2="85" stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />
      <line x1="118" y1="85" x2="124" y2="105" stroke="rgba(139,92,246,0.4)" strokeWidth="0.8" strokeDasharray="3 3" />

      {/* Flashing Activity LEDs */}
      <circle cx="58" cy="102" r="2" fill="rgba(255,255,255,0.4)" />
      <circle cx="100" cy="77" r="2.5" fill="#8B5CF6" />
      <circle cx="142" cy="102" r="2" fill="rgba(255,255,255,0.4)" />
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 5  Build — Code brackets & gears
───────────────────────────────────────────────────────────────────────────── */
const BuildIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g opacity="0.85">
      <ellipse cx="100" cy="155" rx="50" ry="9" fill="rgba(255,255,255,0.03)" />
      <path d="M50 70 L80 40 L80 120 L50 90 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />
      <path d="M150 70 L120 40 L120 120 L150 90 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.16)" strokeWidth="0.8" />

      {/* Code syntax tags */}
      <path d="M72 80 L88 64 M72 80 L88 96" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M128 80 L112 64 M128 80 L112 96" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="104" y1="62" x2="96" y2="98" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 6  Iteration — circular feedback loop
───────────────────────────────────────────────────────────────────────────── */
const IterationIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g opacity="0.85">
      <ellipse cx="100" cy="155" rx="50" ry="9" fill="rgba(255,255,255,0.03)" />
      <circle cx="100" cy="80" r="38" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="5 5" />
      <motion.circle
        cx="100"
        cy="80"
        r="38"
        stroke="#8B5CF6"
        strokeWidth="1.5"
        strokeDasharray="20 180"
        animate={{ rotate: 360 }}
        transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
        style={{ transformOrigin: '100px 80px' }}
      />
      <circle cx="100" cy="80" r="16" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.3)" strokeWidth="0.8" />
      <circle cx="100" cy="80" r="4" fill="#FFFFFF" />
    </g>
  </svg>
);

const phases = [
  {
    title: 'Discovery',
    description: 'Deconstruct complex user friction into granular operational root causes with data metrics.',
    Illustration: DiscoveryIllustration,
  },
  {
    title: 'PRD Drafting',
    description: 'Transform insights into rigorous product specs with acceptance criteria and edge cases.',
    Illustration: PRDIllustration,
  },
  {
    title: 'Architecture',
    description: 'Engineer decoupled, observable microservices and AI agent flows with fault-tolerant pipelines.',
    Illustration: ArchitectureIllustration,
  },
  {
    title: 'Build & Ship',
    description: 'Iterative, high-velocity engineering with strict typing, clean design tokens, and CI/CD.',
    Illustration: BuildIllustration,
  },
  {
    title: 'Iteration',
    description: 'Continuous telemetry analysis, user feedback loops, and measurable business performance.',
    Illustration: IterationIllustration,
  },
];

export default function ProductMindset() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants: Variants = {
    hidden: { y: 24, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <section id="mindset" className="py-32 px-8 md:px-20 bg-[#070709] relative overflow-hidden">
      {/* Ambient Electric Violet glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full bg-violet-600/[0.04] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Product Lifecycle
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            <DecryptedText text="MY APPROACH." speed={40} maxIterations={8} encryptedClassName="text-violet-400" />
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {phases.map((phase) => {
            const { Illustration } = phase;
            return (
              <motion.div key={phase.title} variants={cardVariants} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.16)"
                  spotlightSize={250}
                  className="flex flex-col justify-between group h-full p-6"
                >
                  <div>
                    {/* Fig label */}
                    <div className="pb-1">
                      <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-400 font-semibold group-hover:text-violet-300 transition-colors">
                        {phase.title}
                      </span>
                    </div>

                    {/* Illustration */}
                    <div className="py-4 flex items-center justify-center h-40">
                      <motion.div
                        className="w-36 h-32"
                        whileHover={{ y: -4, scale: 1.04 }}
                        transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <Illustration />
                      </motion.div>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-2">
                    <h3 className="text-[15px] font-bold text-white tracking-tight group-hover:text-violet-200 transition-colors">
                      {phase.title}
                    </h3>
                    <p className="text-neutral-400 text-[12px] leading-relaxed">
                      {phase.description}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
