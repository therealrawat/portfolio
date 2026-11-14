import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Terminal,
  Mail,
  Linkedin,
  Github,
  Award,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import { navigateTo } from '../utils/navigation';
import { PORTFOLIO_CONTEXT } from '../data/bio';

export default function AboutMe() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white relative pt-28 pb-24 px-6 md:px-16 overflow-hidden">
      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/[0.08] blur-[150px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-20 right-10 w-[450px] h-[450px] bg-violet-900/[0.05] blur-[140px] rounded-full z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation Breadcrumb / Back Action */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-violet-500/10 text-neutral-300 hover:text-white text-xs font-semibold transition-all group cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 text-violet-400" />
            <span>Back to Portfolio</span>
          </button>
        </motion.div>

        {/* Hero Title & Identity Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-4 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Biography & Systems Mindset
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-6">
            <DecryptedText
              text="ABOUT PRIYANSHU."
              speed={35}
              maxIterations={8}
              encryptedClassName="text-violet-400"
            />
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-3xl font-light leading-relaxed">
            Software Engineer with over 4 years of experience architecting distributed solutions, transitioning technical features into business outcomes, and building AI-orchestrated products with product discipline.
          </p>
        </motion.div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14"
        >
          {/* Main Story & Philosophy - 2 Columns wide */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <SpotlightCard
              spotlightColor="rgba(139, 92, 246, 0.22)"
              spotlightSize={360}
              className="p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                      <Terminal className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">Engineering with Intent</h3>
                      <p className="text-xs text-neutral-400">Product Mindset + Technical Rigor</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-widest px-2.5 py-1 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-bold">
                    4+ Years Exp
                  </span>
                </div>

                <div className="space-y-4 text-sm text-neutral-300 font-light leading-relaxed">
                  <p>
                    My approach to engineering is deeply anchored in Product Thinking. I don’t view code as merely syntax or isolated backend modules; I identify organizational bottlenecks—such as data retrieval latency, meeting debt, and manual ops fragmentation—and orchestrate intelligent agent systems that systematically eliminate them.
                  </p>
                  <p>
                    Currently at <strong className="text-white font-semibold">TestingXperts</strong>, I drive end-to-end delivery of client-facing enterprise projects while engineering AI-powered internal systems that elevate organizational speed. Whether architecting dynamic microservices for travel insurance carriers or demonstrating high-fidelity product prototypes to multinational clients, my mission is simple: ensure every line of code serves a measurable business objective.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] flex flex-wrap gap-2">
                {['PRD Methodology', 'Stateless Architecture', 'Microservices', 'AI Agents', 'Latency Optimization'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-mono px-3 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Military Leadership & AFSB Recommendation */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <SpotlightCard
              spotlightColor="rgba(139, 92, 246, 0.25)"
              spotlightSize={300}
              className="p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-violet-400 font-bold mb-2">
                  <Award className="w-3.5 h-3.5" />
                  Military Selection
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-4">
                  AFSB Recommended
                </h3>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  Recommended by the <strong className="text-white font-semibold">Air Force Selection Board</strong> for Commission into the Indian Armed Forces. Trained in situational leadership, swift spatial evaluation, and decisive execution under high-stress conditions.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08]">
                <p className="text-xs text-neutral-400 font-mono">
                  Brings discipline, accountability, and calm decisiveness to sprint cycles and architectural governance.
                </p>
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Academic Foundation */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <SpotlightCard
              spotlightColor="rgba(139, 92, 246, 0.2)"
              spotlightSize={280}
              className="p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-6">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight mb-1">
                  MCA Degree
                </h3>
                <div className="text-2xl font-black text-violet-400 tracking-tight font-mono mb-3">
                  8.93 CGPA
                </div>
                <p className="text-sm text-neutral-300 font-light leading-relaxed">
                  Master of Computer Applications. Rigorous foundations in distributed computing, data structures, relational and document stores, and software engineering architecture.
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] text-xs text-neutral-400 font-mono">
                Academic excellence coupled with practical industry deployment.
              </div>
            </SpotlightCard>
          </motion.div>

          {/* Client & Enterprise Track Record - 2 Columns wide */}
          <motion.div variants={itemVariants} className="md:col-span-2">
            <SpotlightCard
              spotlightColor="rgba(139, 92, 246, 0.2)"
              spotlightSize={340}
              className="p-8 h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">Enterprise & Client Engagements</h3>
                    <p className="text-xs text-neutral-400">Proven delivery across fintech, logistics, and healthcare</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PORTFOLIO_CONTEXT.companies_and_clients.map((company) => (
                    <div
                      key={company.name}
                      className="p-3.5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-violet-500/30 hover:bg-white/[0.04] transition-all"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white tracking-tight">{company.name}</span>
                        <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider">{company.type}</span>
                      </div>
                      <p className="text-xs text-neutral-400 font-light">{company.role}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-neutral-400">
                <span>Direct client demos, stakeholder alignment, and production deployments.</span>
                <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              </div>
            </SpotlightCard>
          </motion.div>
        </motion.div>

        {/* Operating Pillars & Core Tech */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-14"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <SpotlightCard className="p-6">
              <Cpu className="w-6 h-6 text-violet-400 mb-4" />
              <h4 className="text-base font-bold text-white tracking-tight mb-2">Systems Architecture</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                High-throughput microservices, stateless API gateways, multi-agent LLM orchestration, and resilient event pipelines built for horizontal scale.
              </p>
            </SpotlightCard>

            {/* Pillar 2 */}
            <SpotlightCard className="p-6">
              <Layers className="w-6 h-6 text-violet-400 mb-4" />
              <h4 className="text-base font-bold text-white tracking-tight mb-2">Product Discipline</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Engineering strictly with intent. Writing comprehensive PRDs, defining crisp telemetry, and verifying impact through data rather than assumptions.
              </p>
            </SpotlightCard>

            {/* Pillar 3 */}
            <SpotlightCard className="p-6">
              <Sparkles className="w-6 h-6 text-violet-400 mb-4" />
              <h4 className="text-base font-bold text-white tracking-tight mb-2">User Craft & Latency</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Obsessive attention to micro-interactions, responsive states, fluid 60fps animations, and deterministic sub-100ms UI response times.
              </p>
            </SpotlightCard>
          </div>
        </motion.div>

        {/* Connect & Direct Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-10 rounded-2xl border border-white/10 bg-[#0c0c11]/90 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold block mb-2">
                Available for Engagements
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Let&apos;s build something high-impact.
              </h3>
              <p className="text-sm text-neutral-400 font-light max-w-xl">
                Open to senior engineering roles, AI orchestration consulting, and strategic product collaborations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:priyanshurawat.business@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </a>

              <a
                href="https://linkedin.com/in/rawat-priyanshu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all"
              >
                <Linkedin className="w-4 h-4 text-violet-300" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/therealrawat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all"
              >
                <Github className="w-4 h-4 text-violet-300" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

