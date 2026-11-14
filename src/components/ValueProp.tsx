import { motion, type Variants } from 'framer-motion';
import { Brain, FileText, Code2 } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';

/* ─────────────────────────────────────────────────────────────────────────────
   BG 1 — AI Orchestration
   Neural-network graph with electric violet interactive nodes
───────────────────────────────────────────────────────────────────────────── */
const AIOrchestrationBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* Edges */}
    <line x1="160" y1="160" x2="100" y2="120" stroke="rgba(139,92,246,0.2)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="210" y2="115" stroke="rgba(139,92,246,0.2)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="220" y2="190" stroke="rgba(139,92,246,0.2)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="130" y2="210" stroke="rgba(139,92,246,0.2)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="190" y2="240" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    <line x1="160" y1="160" x2="240" y2="155" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    <line x1="100" y1="120" x2="140" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="100" y1="120" x2="60" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="210" y1="115" x2="240" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="210" y1="115" x2="240" y2="155" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="220" y1="190" x2="250" y2="220" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="130" y1="210" x2="90" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="130" y1="210" x2="190" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />

    {/* Nodes */}
    <circle cx="160" cy="160" r="6.5" fill="#8B5CF6" />
    <circle cx="160" cy="160" r="12" fill="rgba(139,92,246,0.15)" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />

    <circle cx="100" cy="120" r="4.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="210" cy="115" r="4.5" fill="rgba(255,255,255,0.25)" />
    <circle cx="220" cy="190" r="4" fill="rgba(139,92,246,0.5)" />
    <circle cx="130" cy="210" r="4" fill="rgba(139,92,246,0.5)" />

    <circle cx="240" cy="155" r="3.5" fill="rgba(255,255,255,0.12)" />
    <circle cx="190" cy="240" r="3.5" fill="rgba(255,255,255,0.12)" />
    <circle cx="140" cy="80" r="3" fill="rgba(255,255,255,0.08)" />
    <circle cx="60" cy="160" r="3" fill="rgba(255,255,255,0.08)" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   BG 2 — Product Strategy
   Concentric target rings with violet focal point
───────────────────────────────────────────────────────────────────────────── */
const ProductStrategyBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <path d="M160 80 L240 160 L160 240 L80 160 Z" fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
    <path d="M160 100 L220 160 L160 220 L100 160 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
    <path d="M160 120 L200 160 L160 200 L120 160 Z" fill="rgba(139,92,246,0.04)" stroke="rgba(139,92,246,0.25)" strokeWidth="0.8" />
    <path d="M160 138 L182 160 L160 182 L138 160 Z" fill="rgba(139,92,246,0.1)" stroke="rgba(139,92,246,0.4)" strokeWidth="1" />

    <line x1="160" y1="60" x2="160" y2="250" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="4 5" />
    <line x1="60" y1="160" x2="250" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" strokeDasharray="4 5" />

    <circle cx="160" cy="160" r="5" fill="#8B5CF6" />
    <circle cx="160" cy="160" r="9" fill="rgba(139,92,246,0.2)" stroke="rgba(139,92,246,0.5)" strokeWidth="0.8" />

    <line x1="230" y1="90" x2="168" y2="158" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M168 158 L176 148 L178 162 Z" fill="#FFFFFF" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   BG 3 — Full-Stack Execution
   Isometric architectural stack
───────────────────────────────────────────────────────────────────────────── */
const FullStackBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* UI Slab */}
    <g transform="translate(130, 95)">
      <path d="M0 -18 L48 8 L0 34 L-48 8 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
      <path d="M-48 8 L0 34 L0 41 L-48 15 Z" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
      <path d="M48 8 L0 34 L0 41 L48 15 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
    </g>

    {/* API Slab (Violet Accent) */}
    <g transform="translate(130, 140)">
      <path d="M0 -18 L48 8 L0 34 L-48 8 Z" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
      <path d="M-48 8 L0 34 L0 41 L-48 15 Z" fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.2)" strokeWidth="0.8" />
      <path d="M48 8 L0 34 L0 41 L48 15 Z" fill="rgba(139,92,246,0.03)" stroke="rgba(139,92,246,0.15)" strokeWidth="0.8" />
    </g>

    {/* DB Slab */}
    <g transform="translate(130, 185)">
      <path d="M0 -18 L48 8 L0 34 L-48 8 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.8" />
      <path d="M-48 8 L0 34 L0 41 L-48 15 Z" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <path d="M48 8 L0 34 L0 41 L48 15 Z" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
    </g>
  </svg>
);

const competencies = [
  {
    icon: Brain,
    title: 'AI Orchestration',
    description:
      'Building intelligent systems that leverage LLMs and AI agents to automate complex workflows and eliminate operational debt.',
    BgIllustration: AIOrchestrationBg,
  },
  {
    icon: FileText,
    title: 'Product Strategy',
    description:
      'Crafting structured Product Requirements Documents that align stakeholders, define crisp success metrics, and drive speed-to-market.',
    BgIllustration: ProductStrategyBg,
  },
  {
    icon: Code2,
    title: 'Full-Stack Execution',
    description:
      'High-throughput microservices and sleek frontends. Rapid prototyping from concept to resilient production systems.',
    BgIllustration: FullStackBg,
  },
];

export default function ValueProp() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as const },
    },
  };

  return (
    <section id="about" className="py-32 px-8 md:px-20 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Core Competencies
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            <DecryptedText text="THE VALUE PROP." speed={40} maxIterations={8} encryptedClassName="text-violet-400" />
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {competencies.map((competency, idx) => {
            const Icon = competency.icon;
            const { BgIllustration } = competency;
            return (
              <motion.div key={competency.title} variants={itemVariants} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.2)"
                  spotlightSize={320}
                  className="p-10 min-h-[380px] flex flex-col justify-between group h-full"
                >
                  {/* Background illustration */}
                  <div
                    className="pointer-events-none absolute -bottom-8 -right-8 w-60 h-60 transition-opacity duration-700 opacity-60 group-hover:opacity-90"
                    aria-hidden="true"
                  >
                    <BgIllustration />
                  </div>

                  {/* Foreground content */}
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center mb-8 group-hover:border-violet-400/80 group-hover:bg-violet-500/15 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-500">
                      <Icon className="w-5 h-5 text-neutral-300 group-hover:text-violet-300 transition-colors duration-500" />
                    </div>

                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight group-hover:text-white transition-colors">
                      {competency.title}
                    </h3>

                    <p className="text-neutral-400 leading-relaxed text-sm max-w-[280px]">
                      {competency.description}
                    </p>
                  </div>

                  {/* Watermark */}
                  <div className="relative z-10 text-[36px] font-black text-white/[0.04] transition-colors group-hover:text-violet-400/20 font-mono">
                    0{idx + 1}
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
