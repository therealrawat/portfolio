import { motion } from 'framer-motion';
import { Brain, FileText, Code2 } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────────────────────
   BG 1 — AI Orchestration
   Neural-network graph: nodes connected by edges, data-flow lines
   Emerges from bottom-right corner
───────────────────────────────────────────────────────────────────────────── */
const AIOrchestrationBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* ── Edges (connections between neurons) ── */}
    {/* Core hub → others */}
    <line x1="160" y1="160" x2="100" y2="120" stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="210" y2="115" stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="220" y2="190" stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="130" y2="210" stroke="rgba(255,255,255,0.09)" strokeWidth="0.9" />
    <line x1="160" y1="160" x2="190" y2="240" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    <line x1="160" y1="160" x2="240" y2="155" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    {/* Peripheral connections */}
    <line x1="100" y1="120" x2="140" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="100" y1="120" x2="60" y2="160" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="210" y1="115" x2="240" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="210" y1="115" x2="240" y2="155" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="220" y1="190" x2="250" y2="220" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="130" y1="210" x2="90" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    <line x1="130" y1="210" x2="190" y2="240" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7" />
    {/* Outer ring cross-links */}
    <line x1="140" y1="80" x2="240" y2="80" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
    <line x1="60" y1="160" x2="90" y2="240" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />
    <line x1="250" y1="220" x2="190" y2="240" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" />

    {/* ── Nodes ── */}
    {/* Core hub — largest */}
    <circle cx="160" cy="160" r="6.5" fill="rgba(255,255,255,0.18)" />
    <circle cx="160" cy="160" r="11" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />

    {/* Mid-ring nodes */}
    <circle cx="100" cy="120" r="4.5" fill="rgba(255,255,255,0.13)" />
    <circle cx="100" cy="120" r="8"   fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7" />

    <circle cx="210" cy="115" r="4.5" fill="rgba(255,255,255,0.13)" />
    <circle cx="210" cy="115" r="8"   fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.7" />

    <circle cx="220" cy="190" r="4"   fill="rgba(255,255,255,0.12)" />
    <circle cx="220" cy="190" r="7.5" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />

    <circle cx="130" cy="210" r="4"   fill="rgba(255,255,255,0.12)" />
    <circle cx="130" cy="210" r="7.5" fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.7" />

    <circle cx="240" cy="155" r="3.5" fill="rgba(255,255,255,0.10)" />
    <circle cx="190" cy="240" r="3.5" fill="rgba(255,255,255,0.10)" />

    {/* Outer leaf nodes */}
    <circle cx="140" cy="80"  r="3"   fill="rgba(255,255,255,0.08)" />
    <circle cx="240" cy="80"  r="3"   fill="rgba(255,255,255,0.08)" />
    <circle cx="60"  cy="160" r="3"   fill="rgba(255,255,255,0.07)" />
    <circle cx="90"  cy="240" r="3"   fill="rgba(255,255,255,0.07)" />
    <circle cx="250" cy="220" r="3"   fill="rgba(255,255,255,0.07)" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   BG 2 — Product Strategy
   Isometric concentric diamond target rings — goal-oriented bullseye
   Emerges from bottom-right corner
───────────────────────────────────────────────────────────────────────────── */
const ProductStrategyBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* ── Concentric isometric diamond rings (target) ── */}
    {/* Ring 4 — outermost */}
    <path d="M160 80 L240 160 L160 240 L80 160 Z"
      fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    {/* Ring 3 */}
    <path d="M160 100 L220 160 L160 220 L100 160 Z"
      fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />
    {/* Ring 2 */}
    <path d="M160 120 L200 160 L160 200 L120 160 Z"
      fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
    {/* Ring 1 — innermost */}
    <path d="M160 138 L182 160 L160 182 L138 160 Z"
      fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.17)" strokeWidth="0.9" />

    {/* ── Cross-hairs / sight lines ── */}
    <line x1="160" y1="60"  x2="160" y2="250" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" strokeDasharray="4 5" />
    <line x1="60"  y1="160" x2="250" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" strokeDasharray="4 5" />

    {/* ── Bullseye dot ── */}
    <circle cx="160" cy="160" r="5.5" fill="rgba(255,255,255,0.22)" />
    <circle cx="160" cy="160" r="9"   fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.7" />

    {/* ── Strategic arrow hitting target — diagonal from top-right ── */}
    <line x1="230" y1="90" x2="168" y2="158" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" strokeLinecap="round" />
    {/* Arrowhead */}
    <path d="M168 158 L176 148 L178 162 Z" fill="rgba(255,255,255,0.22)" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────────
   BG 3 — Full-Stack Execution
   Three labeled isometric slabs: UI layer / API layer / DB layer
   Emerges from bottom-right corner
───────────────────────────────────────────────────────────────────────────── */
const FullStackBg = () => (
  <svg viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    {/* ── Database layer (bottom — widest) ── */}
    {/* Top face */}
    <path d="M80 220 L160 176 L240 220 L160 264 Z"
      fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.9" />
    {/* Left face */}
    <path d="M80 220 L80 238 L160 282 L160 264 Z"
      fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.09)" strokeWidth="0.8" />
    {/* Right face */}
    <path d="M240 220 L240 238 L160 282 L160 264 Z"
      fill="rgba(255,255,255,0.025)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" />
    {/* DB grid lines on top */}
    <line x1="110" y1="210" x2="160" y2="228" stroke="rgba(255,255,255,0.10)" strokeWidth="0.7" />
    <line x1="140" y1="195" x2="200" y2="214" stroke="rgba(255,255,255,0.07)" strokeWidth="0.6" />

    {/* ── API / Backend layer (middle) ── */}
    <path d="M95 182 L160 145 L225 182 L160 219 Z"
      fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.14)" strokeWidth="0.9" />
    <path d="M95 182 L95 200 L160 237 L160 219 Z"
      fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" strokeWidth="0.8" />
    <path d="M225 182 L225 200 L160 237 L160 219 Z"
      fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.8" />
    {/* API dots / endpoints */}
    <circle cx="130" cy="172" r="2"  fill="rgba(255,255,255,0.20)" />
    <circle cx="155" cy="162" r="2"  fill="rgba(255,255,255,0.15)" />
    <circle cx="180" cy="172" r="2"  fill="rgba(255,255,255,0.18)" />
    <line x1="132" y1="172" x2="153" y2="163" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
    <line x1="157" y1="162" x2="178" y2="172" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />

    {/* ── Frontend / UI layer (top — narrowest) ── */}
    <path d="M112 143 L160 117 L208 143 L160 169 Z"
      fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.9" />
    <path d="M112 143 L112 157 L160 183 L160 169 Z"
      fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8" />
    <path d="M208 143 L208 157 L160 183 L160 169 Z"
      fill="rgba(255,255,255,0.035)" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
    {/* UI window decorations on top face */}
    <rect x="136" y="131" width="12" height="7" rx="1"
      transform="rotate(-26 136 131)"
      fill="rgba(255,255,255,0.10)" stroke="rgba(255,255,255,0.18)" strokeWidth="0.5" />
    <rect x="158" y="122" width="8" height="5" rx="1"
      transform="rotate(-26 158 122)"
      fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.13)" strokeWidth="0.5" />

    {/* Apex dot */}
    <circle cx="160" cy="117" r="2.5" fill="rgba(255,255,255,0.25)" />
  </svg>
);

/* ─── Data ─────────────────────────────────────────────────────────────────── */

const competencies = [
  {
    icon: Brain,
    title: 'AI Orchestration',
    description:
      'Building intelligent systems that leverage LLMs and AI agents to automate complex workflows and reduce operational overhead.',
    BgIllustration: AIOrchestrationBg,
  },
  {
    icon: FileText,
    title: 'Product Strategy',
    description:
      'Crafting comprehensive Product Requirements Documents that align stakeholders, define clear success metrics, and guide execution.',
    BgIllustration: ProductStrategyBg,
  },
  {
    icon: Code2,
    title: 'Full-Stack Execution',
    description:
      'End-to-end implementation with modern frameworks. Rapid prototyping from concept to production-ready systems.',
    BgIllustration: FullStackBg,
  },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function ValueProp() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] as any },
    },
  };

  return (
    <section id="value" className="py-32 px-8 md:px-20 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Core Competencies
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            THE VALUE PROP.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900"
        >
          {competencies.map((competency, idx) => {
            const Icon = competency.icon;
            const { BgIllustration } = competency;
            return (
              <motion.div
                key={competency.title}
                variants={itemVariants}
                className="group relative bg-black p-10 min-h-[350px] flex flex-col justify-between overflow-hidden transition-colors duration-500 hover:bg-neutral-950"
              >
                {/* ── Background illustration — bottom-right corner ── */}
                <div
                  className="pointer-events-none absolute -bottom-8 -right-8 w-60 h-60 transition-opacity duration-700 opacity-80 group-hover:opacity-100"
                  aria-hidden="true"
                >
                  <BgIllustration />
                </div>

                {/* ── Foreground content ── */}
                <div className="relative z-10">
                  <div className="w-12 h-12 border border-neutral-800 flex items-center justify-center mb-10 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors duration-500" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
                    {competency.title}
                  </h3>

                  <p className="text-neutral-500 leading-relaxed text-sm max-w-[280px]">
                    {competency.description}
                  </p>
                </div>

                {/* Number watermark */}
                <div className="relative z-10 text-[40px] font-black text-white/[0.02] transition-colors group-hover:text-white/[0.04]">
                  0{idx + 1}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
