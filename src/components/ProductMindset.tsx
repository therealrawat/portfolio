import { motion } from 'framer-motion';

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 2  Discovery — magnifier slowly scans back and forth over the doc
───────────────────────────────────────────────────────────────────────────── */
const DiscoveryIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g opacity="0.85">
      {/* Shadow */}
      <ellipse cx="100" cy="158" rx="52" ry="10" fill="rgba(255,255,255,0.03)" />
      {/* Document layer 3 (bottom) */}
      <path d="M52 130 L100 108 L148 130 L100 152 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      {/* Document layer 2 */}
      <path d="M52 116 L100 94 L148 116 L100 138 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.17)" strokeWidth="0.8" />
      {/* Document layer 1 (top) */}
      <path d="M52 102 L100 80 L148 102 L100 124 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
      <path d="M52 102 L52 116 L100 138 L100 124 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <path d="M148 102 L148 116 L100 138 L100 124 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />
      {/* Doc lines */}
      <line x1="72" y1="97" x2="110" y2="111" stroke="rgba(255,255,255,0.22)" strokeWidth="0.7" />
      <line x1="72" y1="103" x2="108" y2="116" stroke="rgba(255,255,255,0.12)" strokeWidth="0.7" />
    </g>

    {/* Magnifier — scans left ↔ right */}
    <motion.g
      animate={{ x: [-18, 18, -18] }}
      transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
    >
      <circle cx="114" cy="62" r="19" stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" fill="rgba(255,255,255,0.04)" />
      {/* Inner glint */}
      <circle cx="108" cy="56" r="4" fill="rgba(255,255,255,0.06)" />
      {/* Handle */}
      <motion.line
        x1="128" y1="76" x2="142" y2="90"
        stroke="rgba(255,255,255,0.45)" strokeWidth="2" strokeLinecap="round"
      />
    </motion.g>

    {/* Scan line that sweeps across doc, in sync */}
    <motion.line
      x1="62" y1="102" x2="100" y2="84"
      stroke="rgba(255,255,255,0.18)"
      strokeWidth="1"
      strokeDasharray="4 4"
      animate={{ x1: [62, 115, 62], x2: [100, 138, 100] }}
      transition={{ duration: 3.5, ease: 'easeInOut', repeat: Infinity }}
    />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 3  PRD — text lines draw in one by one, then reset
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
        {/* Box */}
        <path d="M55 120 L100 96 L145 120 L100 144 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.17)" strokeWidth="0.8" />
        <path d="M55 120 L55 80 L100 56 L100 96 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.19)" strokeWidth="0.8" />
        <path d="M145 120 L145 80 L100 56 L100 96 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
        <path d="M55 80 L100 56 L145 80 L100 104 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.24)" strokeWidth="0.8" />
        {/* Small doc on top */}
        <path d="M75 68 L100 55 L125 68 L100 81 Z" fill="rgba(255,255,255,0.09)" stroke="rgba(255,255,255,0.27)" strokeWidth="0.8" />
      </g>

      {/* Animated draw-in lines */}
      {lineData.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x1} y2={l.y1}   /* start collapsed */
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="0.9"
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
   FIG. 4  Architecture — prisms rise up staggered from below
───────────────────────────────────────────────────────────────────────────── */
const prismVariants = (delay: number) => ({
  animate: {
    y: [14, 0, 14],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 2.8,
      delay,
      ease: 'easeInOut' as const,
      repeat: Infinity,
    },
  },
});

const ArchitectureIllustration = () => (
  <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <ellipse cx="100" cy="155" rx="55" ry="10" fill="rgba(255,255,255,0.03)" />

    {/* Left prism */}
    <motion.g animate={prismVariants(0.3).animate}>
      <path d="M55 118 L76 106 L76 84 L55 96 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
      <path d="M76 106 L97 118 L97 96 L76 84 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
      <path d="M55 96 L76 84 L97 96 L76 108 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.8" />
    </motion.g>

    {/* Center prism (tallest, leads) */}
    <motion.g animate={prismVariants(0).animate}>
      <path d="M75 132 L100 118 L100 72 L75 86 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" />
      <path d="M100 118 L125 132 L125 86 L100 72 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      <path d="M75 86 L100 72 L125 86 L100 100 Z" fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.8" />
    </motion.g>

    {/* Right prism */}
    <motion.g animate={prismVariants(0.6).animate}>
      <path d="M103 118 L124 106 L124 84 L103 96 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      <path d="M124 106 L145 118 L145 96 L124 84 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />
      <path d="M103 96 L124 84 L145 96 L124 108 Z" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.20)" strokeWidth="0.8" />
    </motion.g>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 5  Build — staircase steps light up sequentially (progress pulse)
───────────────────────────────────────────────────────────────────────────── */
const BuildIllustration = () => {
  const steps = [0, 1, 2, 3, 4, 5, 6];

  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="100" cy="157" rx="53" ry="9" fill="rgba(255,255,255,0.03)" />

      {steps.map((i) => {
        const x = 50 + i * 15;
        const topY = 140 - i * 14;
        const bottomY = 148;
        return (
          <motion.g
            key={i}
            animate={{
              opacity: [0.25, 1, 0.25],
            }}
            transition={{
              duration: 2.4,
              delay: i * 0.18,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            {/* Front face */}
            <path
              d={`M${x} ${bottomY} L${x} ${topY} L${x + 15} ${topY - 7} L${x + 15} ${bottomY - 7} Z`}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="0.8"
            />
            {/* Top face */}
            <path
              d={`M${x} ${topY} L${x + 15} ${topY - 7} L${x + 30} ${topY - 14} L${x + 15} ${topY - 7} Z`}
              fill="rgba(255,255,255,0.09)"
              stroke="rgba(255,255,255,0.24)"
              strokeWidth="0.8"
            />
          </motion.g>
        );
      })}
    </svg>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   FIG. 6  Iteration — layers ripple upward like a wave, arrow bobs
───────────────────────────────────────────────────────────────────────────── */
const IterationIllustration = () => {
  const layers = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <svg viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <ellipse cx="100" cy="156" rx="52" ry="9" fill="rgba(255,255,255,0.03)" />

      {layers.map((i) => {
        const y = 148 - i * 10;
        return (
          <motion.g
            key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 2.2,
              delay: i * 0.12,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          >
            <path
              d={`M55 ${y} L100 ${y - 18} L145 ${y} L100 ${y + 18} Z`}
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="0.7"
            />
            <path
              d={`M55 ${y} L55 ${y + 3} L100 ${y + 21} L100 ${y + 18} Z`}
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="0.5"
            />
          </motion.g>
        );
      })}

      {/* Bouncing arrow on top */}
      <motion.path
        d="M88 46 L100 38 L112 46"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 1.4, ease: 'easeInOut', repeat: Infinity }}
      />
    </svg>
  );
};

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const phases = [
  {
    Illustration: DiscoveryIllustration,
    title: 'Discovery',
    fig: 'FIG. 2',
    description: "Deep user research, problem validation, and competitive analysis to ensure we're solving the right problem.",
  },
  {
    Illustration: PRDIllustration,
    title: 'PRD',
    fig: 'FIG. 3',
    description: 'Comprehensive Product Requirements Document with clear success metrics, user stories, and technical specifications.',
  },
  {
    Illustration: ArchitectureIllustration,
    title: 'Architecture',
    fig: 'FIG. 4',
    description: 'System design, technology selection, and infrastructure planning for scalability and maintainability.',
  },
  {
    Illustration: BuildIllustration,
    title: 'Build',
    fig: 'FIG. 5',
    description: 'Agile development with continuous integration, code reviews, and rapid prototyping to validate assumptions.',
  },
  {
    Illustration: IterationIllustration,
    title: 'Iteration',
    fig: 'FIG. 6',
    description: 'Data-driven improvements based on user feedback, analytics, and performance metrics to optimise product-market fit.',
  },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function ProductMindset() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] as any },
    },
  };

  return (
    <section id="mindset" className="py-32 px-8 md:px-20 bg-black relative overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[300px] rounded-full bg-white/[0.015] blur-[120px]" />
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
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Product Lifecycle
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            MY APPROACH.
          </h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-neutral-900 border border-neutral-900"
        >
          {phases.map((phase) => {
            const { Illustration } = phase;
            return (
              <motion.div
                key={phase.title}
                variants={cardVariants}
                className="group relative bg-black flex flex-col transition-colors duration-500 hover:bg-[#0a0a0a]"
              >
                {/* Fig label */}
                <div className="px-6 pt-6 pb-1">
                  <span className="text-[9px] uppercase tracking-[0.35em] text-neutral-600 font-semibold">
                    {phase.title}
                  </span>
                </div>

                {/* Illustration */}
                <div className="px-4 py-4 flex items-center justify-center h-44">
                  <motion.div
                    className="w-40 h-36"
                    whileHover={{ y: -5, scale: 1.05 }}
                    transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                  >
                    <Illustration />
                  </motion.div>
                </div>

                {/* Divider */}
                <div className="mx-6 h-px bg-neutral-800/60" />

                {/* Text */}
                <div className="px-6 py-7 flex flex-col gap-3">
                  <h3 className="text-[15px] font-bold text-white tracking-tight">
                    {phase.title}
                  </h3>
                  <p className="text-neutral-500 text-[13px] leading-relaxed">
                    {phase.description}
                  </p>
                </div>

                {/* Bottom accent on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-px bg-white/0 group-hover:bg-white/[0.08] transition-colors duration-500" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
