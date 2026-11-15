import { motion } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  Terminal,
  Mail,
  Cpu,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileText,
} from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import Lanyard from './reactbits/Lanyard';
import { PORTFOLIO_CONTEXT } from '../data/bio';

const LinkedinFilledIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
    />
  </svg>
);

const GithubIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  </svg>
);

export default function AboutMe() {
  const chapters = [
    {
      num: '01',
      title: 'The Crucible of Composure',
      badge: 'AIR FORCE SELECTION BOARD (1 AFSB)',
      tagline: 'Clearing AFCAT & The 5-Day Commission Selection Process',
      icon: ShieldCheck,
      content: [
        'Before designing distributed microservices or writing production code, my mindset was tempered through an intense 5-day assessment at the Air Force Selection Board (1 AFSB), following success in the national AFCAT exam.',
        'The selection process systematically evaluates leadership under ambiguity, rapid cognitive analysis, and psychological composure while facing physical and situational friction. Candidates are placed in complex, unscripted group dilemmas where panic is fatal to mission success.',
        'In software engineering, production incidents occur, cloud regions face outages, and release timelines compress. That military testing ground taught me the core asset I bring to technical teams: unflinching calm, situational awareness, and radical ownership. When systems break at scale, I do not panic—I analyze, isolate, and lead the path to resolution.',
      ],
      highlights: [
        'Cognitive agility under acute operational friction',
        'Radical accountability & zero-excuse teamwork',
        'Decisive problem breakdown in ambiguous scenarios',
      ],
    },
    {
      num: '02',
      title: 'Computational Foundations',
      badge: 'ACADEMIC RIGOR • 8.93 CGPA',
      tagline: 'Master of Computer Applications — Reasoning from First Principles',
      icon: GraduationCap,
      content: [
        'Intuition without computational foundations breeds fragile architectures. During my Master of Computer Applications (MCA), which I completed with an 8.93 CGPA, I immersed myself in the core mechanics of computer systems.',
        'I studied distributed database internals (indexing trees, WAL protocols, ACID vs BASE tradeoffs), memory management, concurrency primitives, and algorithmic complexity. Rather than viewing frameworks as black boxes, I learned to trace how high-level code compiles down to operating system threads and network packets.',
        'This deep academic grounding enables me to foresee bottlenecks before they materialize—understanding exactly why an API gateway stalls under high concurrency, how database connection pools saturate, and how to optimize memory footprints.',
      ],
      highlights: [
        '8.93 CGPA in Master of Computer Applications',
        'Deep foundations in distributed data stores & concurrency',
        'Algorithmic complexity analysis & performance profiling',
      ],
    },
    {
      num: '03',
      title: 'The Enterprise Battleground',
      badge: '4+ YEARS PRODUCTION TRACK RECORD',
      tagline: 'High-Throughput Fintech, Supply Chain Logistics, and Healthcare Systems',
      icon: Briefcase,
      content: [
        'Over the past 4+ years, I transitioned theoretical knowledge into enterprise reality, engineering systems where downtime, data corruption, or slow response times carry direct financial and operational consequences.',
        'At TestingXperts and smartData Enterprises, I spearheaded development across mission-critical domains: building idempotent remittance pipelines for Intermex, resolving catalog sync bottlenecks for wholesale logistics giant S&S Activewear, and delivering HIPAA-compliant EHR interfaces for Premium Health US.',
        'Beyond writing code, I routinely conducted direct client demonstrations, translated high-level business stakeholder requirements into technical specifications, and mentored cross-functional engineering pods.',
      ],
      highlights: [
        '4+ years architecting full-stack & distributed solutions',
        'Cross-border fintech, high-volume logistics, and EHR healthcare',
        'Direct stakeholder demos & client-facing technical leadership',
      ],
    },
    {
      num: '04',
      title: 'Engineering With Intent',
      badge: 'PRODUCT MINDSET & AI ORCHESTRATION',
      tagline: 'Eliminating Meeting Debt, PRD Paralysis, and Manual Ops Toil',
      icon: Cpu,
      content: [
        'A senior engineer’s real value is measured not by lines of code produced, but by organizational friction permanently eliminated. I approach software through a disciplined framework: Discovery → PRD → Architecture → Build → Scale.',
        'Observing that engineering and product teams lose up to 40% of their velocity to meeting overhead, manual requirement writing, and fragmented documentation, I architected targeted AI solutions powered by Gemini and LLMs.',
        'From SyncScripts (which converts hours of meeting transcripts into structured action matrices without retaining sensitive data) to our Intelligent PRD Generator and automated Agent Orchestration platforms, every system I build is engineered with one goal: delivering measurable business outcomes.',
      ],
      highlights: [
        'Discovery → PRD → Architecture → Build → Scale methodology',
        'Stateless AI architectures preserving customer data privacy',
        'Agentic automation eliminating sprint overhead and developer fatigue',
      ],
    },
  ];

  const operatingPrinciples = [
    {
      title: 'Outcome Over Syntax',
      desc: 'Code is a tool, not the trophy. Every feature, microservice, and refactor must defend a tangible business metric or user objective.',
      icon: Terminal,
    },
    {
      title: 'Simplicity Over Cleverness',
      desc: 'Accidental complexity kills velocity. I prefer deterministic, readable, and debuggable systems that any engineer can reason about at 2 AM.',
      icon: Layers,
    },
    {
      title: 'Speed as a Feature',
      desc: 'Sub-100ms response times and fluid 60 FPS interactions respect user attention. Latency is treated as a critical bug.',
      icon: Zap,
    },
    {
      title: 'Radical Ownership',
      desc: 'No silos and no finger-pointing. If a system fails or an initiative stalls, I take personal responsibility to diagnose the root cause and resolve it.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-white relative pt-28 pb-24 px-6 md:px-12 lg:px-16 overflow-hidden selection:bg-violet-600/35 selection:text-white">
      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-600/[0.07] blur-[160px] rounded-full z-0" />
      <div className="pointer-events-none absolute top-[900px] right-0 w-[550px] h-[550px] bg-violet-900/[0.05] blur-[160px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-40 left-10 w-[600px] h-[600px] bg-violet-800/[0.04] blur-[180px] rounded-full z-0" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* HERO SECTION: Just the Lanyard Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full h-[580px] sm:h-[650px] relative flex items-center justify-center mb-16"
        >
          <Lanyard
            frontImage="/card-front.jpeg"
            backImage="/card-back.png"
            strapImage="/strap.png"
            cardColor="#ffffff"
            finish="matte"
            metal="silver"
            orientation="portrait"
            size={0.72}
            strapLength={0.42}
            breeze={0.35}
            elasticity={0.48}
            damping={0.45}
            interactive={true}
            intro={true}
          />
        </motion.div>

        {/* SECTION HEADER: The Narrative Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-mono uppercase tracking-widest font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Chronicle of Growth
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
            <DecryptedText
              text="THE STORY IN FOUR CHAPTERS."
              speed={30}
              maxIterations={8}
              encryptedClassName="text-violet-400"
            />
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light">
            How disciplined composure, academic foundations, and enterprise battle testing converged into engineering with intent.
          </p>
        </motion.div>

        {/* STORY CHAPTERS TIMELINE */}
        <div className="space-y-12 mb-24 relative">
          {/* Vertical Timeline Track Line */}
          <div className="hidden md:block absolute left-[28px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-violet-500/40 via-white/10 to-violet-500/20" />

          {chapters.map((ch, idx) => {
            const Icon = ch.icon;
            return (
              <motion.div
                key={ch.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="relative md:pl-16"
              >
                {/* Chapter Marker Node */}
                <div className="hidden md:flex absolute left-0 top-6 w-14 h-14 rounded-2xl bg-[#0c0c12] border border-violet-500/30 items-center justify-center text-violet-400 font-mono font-bold text-sm shadow-[0_0_20px_rgba(139,92,246,0.15)] z-10">
                  <span>{ch.num}</span>
                </div>

                {/* Chapter Card Content */}
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.16)"
                  spotlightSize={380}
                  className="p-8 sm:p-10 rounded-2xl border border-white/[0.08] bg-[#0c0c12]/90 backdrop-blur-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-widest text-violet-400 font-bold">
                          {ch.badge}
                        </div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {ch.title}
                        </h3>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-neutral-400 bg-white/[0.03] border border-white/10 px-3 py-1.5 rounded-lg w-fit">
                      {ch.tagline}
                    </span>
                  </div>

                  {/* Narrative Paragraphs */}
                  <div className="space-y-4 text-sm sm:text-base text-neutral-300 font-light leading-relaxed mb-8">
                    {ch.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Highlights Bullet Matrix */}
                  <div className="pt-6 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {ch.highlights.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="flex items-start gap-2.5 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-300 font-light">{h}</span>
                      </div>
                    ))}
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* ENTERPRISE TRACK RECORD: Companies & Clients */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <SpotlightCard
            spotlightColor="rgba(139, 92, 246, 0.18)"
            spotlightSize={340}
            className="p-8 sm:p-10 rounded-2xl border border-white/[0.08] bg-[#0c0c12]/90 backdrop-blur-xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <div className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold mb-1">
                  COMMERCIAL FOOTPRINT
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Organizations & Client Engagements
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-md">
                Direct client deliverables, production releases, and stakeholder leadership across enterprise technology.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PORTFOLIO_CONTEXT.companies_and_clients.map((c) => (
                <div
                  key={c.name}
                  className="p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-violet-500/40 hover:bg-white/[0.04] transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-white tracking-tight group-hover:text-violet-300 transition-colors">
                      {c.name}
                    </span>
                    <span className="text-[10px] font-mono text-violet-400 uppercase tracking-wider px-2 py-0.5 rounded border border-violet-500/30 bg-violet-500/10">
                      {c.type}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light">{c.role}</p>
                </div>
              ))}
            </div>
          </SpotlightCard>
        </motion.div>

        {/* OPERATING CREED: 4 Core Principles */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-24"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold mb-2">
              ENGINEERING PHILOSOPHY
            </div>
            <h3 className="text-3xl font-black text-white tracking-tight mb-3">
              The Operating Creed.
            </h3>
            <p className="text-sm text-neutral-400 font-light">
              Non-negotiable principles that guide every PRD written, line committed, and architecture deployed.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {operatingPrinciples.map((op, opIdx) => {
              const OpIcon = op.icon;
              return (
                <SpotlightCard
                  key={op.title}
                  spotlightColor="rgba(139, 92, 246, 0.2)"
                  spotlightSize={300}
                  className="p-7 rounded-2xl border border-white/[0.08] bg-[#0c0c12]/90 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-5">
                      <OpIcon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-mono text-violet-400 font-bold">0{opIdx + 1}</span>
                      <h4 className="text-lg font-bold text-white tracking-tight">{op.title}</h4>
                    </div>
                    <p className="text-sm text-neutral-300 font-light leading-relaxed">
                      {op.desc}
                    </p>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>
        </motion.div>

        {/* EPILOGUE: Let's Connect Dispatch Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-8 sm:p-12 rounded-3xl border border-white/10 bg-gradient-to-br from-[#0c0c12] via-[#09090e] to-black relative overflow-hidden shadow-2xl"
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-violet-400 font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-violet-400" />
                AVAILABLE FOR STRATEGIC ROLES & ENGAGEMENTS
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
                Let&apos;s build something high-impact.
              </h3>
              <p className="text-sm sm:text-base text-neutral-300 font-light max-w-xl leading-relaxed">
                Whether you need a software engineer to architect high-throughput microservices, orchestrate intelligent AI agent workflows, or bridge engineering into product strategy—I am open to discussions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:priyanshurawat.business@gmail.com"
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_25px_rgba(139,92,246,0.4)] hover:shadow-[0_0_35px_rgba(139,92,246,0.6)] cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Get in Touch</span>
              </a>

              <a
                href="https://linkedin.com/in/rawat-priyanshu"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <LinkedinFilledIcon className="w-4 h-4 text-violet-300" />
                <span>LinkedIn</span>
              </a>

              <a
                href="https://github.com/therealrawat"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <GithubIcon className="w-4 h-4 text-violet-300" />
                <span>GitHub</span>
              </a>

              <a
                href="https://drive.google.com/uc?export=download&id=1kUrtfQCpxHjxxPDoP4tRE257u_-abUWf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <FileText className="w-4 h-4 text-violet-300" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
