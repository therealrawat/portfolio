import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Layers,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import ProjectImageStack from './reactbits/ProjectImageStack';
import { navigateTo } from '../utils/navigation';

interface DetailedProject {
  id: string;
  title: string;
  subtitle: string;
  highlightMetric: string;
  pmPhilosophy: string;
  engineeringArch: string;
  techStack: string[];
  liveUrl: string;
  githubUrl: string;
  images: [string, string, string];
}

const detailedProjects: DetailedProject[] = [
  {
    id: 'syncscripts',
    title: 'SyncScripts',
    subtitle: 'Zero-Retention AI Meeting Intelligence',
    highlightMetric: '75% Faster Post-Call Synthesis',
    pmPhilosophy:
      'Solved Meeting Debt and post-call information overload. Rather than forcing teams into 30-minute recap sessions, SyncScripts automatically extracts structured decisions, blocker registries, and assigned action items.',
    engineeringArch:
      'Stateless, ephemeral client-side pipeline built with React and TypeScript. Integrates Gemini 1.5 Flash for high-throughput context processing with strict zero data-retention guarantees.',
    techStack: ['Gemini 1.5 Flash', 'React', 'TypeScript', 'Tailwind CSS', 'Netlify Edge'],
    liveUrl: 'https://syncscripts.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'agent-orchestrator',
    title: 'AI Agent Orchestrator',
    subtitle: 'Autonomous Operational Incident Platform',
    highlightMetric: 'Recovers 40% of Sprint Capacity',
    pmPhilosophy:
      'Engineers routinely sacrifice up to 40% of sprint capacity managing manual operational firefighting and ticket runs. This platform automates repetitive triage so developers can focus on core architecture.',
    engineeringArch:
      'Coordinated multi-agent architecture hosted on Google Cloud. Executes deterministic runbooks, verifies incident resolution through schema validation, and routes escalation telemetry with automated auditing.',
    techStack: ['Google Cloud', 'Gemini AI', 'TypeScript', 'Node.js', 'Docker', 'PostgreSQL'],
    liveUrl: 'https://syncscripts.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'echomap',
    title: 'EchoMap',
    subtitle: 'Diagnostic AI Speech & Spectrogram Engine',
    highlightMetric: 'Sub-50ms Real-Time Acoustic Feedback',
    pmPhilosophy:
      'Replaces subjective language pronunciation grading with deterministic visual feedback. Acoustic anomaly analysis gives language learners immediate visual cues on phonetic nuances.',
    engineeringArch:
      'Real-time Web Audio API signal processing pipeline coupled with spectrogram frequency mapping. Analyzes acoustic wave nodes and highlights accent deviations with low latency.',
    techStack: ['Web Audio API', 'React', 'TypeScript', 'Canvas 2D', 'Tailwind CSS'],
    liveUrl: 'https://echo-map.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'prd-generator',
    title: 'Intelligent PRD Generator',
    subtitle: 'Automated Product Specifications & User Stories',
    highlightMetric: '15+ Hours Saved Per Major Feature Spec',
    pmPhilosophy:
      'Writing rigorous PRDs from scratch is slow and prone to omitting technical edge cases. This system enforces structured requirements definitions that align engineering and design before a single line of code is written.',
    engineeringArch:
      'Multi-model LLM chaining pipeline built with Next.js and PostgreSQL. Translates high-level feature goals into structured personas, data entity diagrams, acceptance criteria, and edge-case test matrices.',
    techStack: ['Next.js', 'PostgreSQL', 'OpenAI & Gemini', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://syncscripts.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: '4her',
    title: '4Her Health Platform',
    subtitle: 'Predictive Wellness with Zero-Tracking Dignity',
    highlightMetric: '100% Client-Side Private Encryption',
    pmPhilosophy:
      'Sensitive biological data should never sit in centralized corporate databases. Engineered predictive wellness tools that prioritize individual data privacy without sacrificing algorithmic accuracy.',
    engineeringArch:
      'Fully client-side forecasting engine leveraging IndexedDB and the Web Cryptography API. Runs cyclical predictive algorithms directly in the browser with zero external server storage.',
    techStack: ['React', 'TypeScript', 'IndexedDB', 'Web Crypto API', 'Tailwind CSS'],
    liveUrl: 'https://the4her.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    id: 'pulsecheck',
    title: 'PulseCheck AI',
    subtitle: 'Predictive Churn Telemetry & Revenue Safeguard',
    highlightMetric: 'Identifies Churn 30 Days in Advance',
    pmPhilosophy:
      'B2B SaaS teams lack proactive visibility into account decay. PulseCheck maps continuous usage telemetry and feedback sentiment directly into revenue retention alerts.',
    engineeringArch:
      'Real-time telemetry ingestion pipeline with Recharts dynamic visualization layer. Formats inference outputs into structured risk indices with automated webhook notifications.',
    techStack: ['Recharts', 'Gemini AI', 'React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://the4her.netlify.app/',
    githubUrl: 'https://github.com/therealrawat',
    images: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white relative pt-28 pb-24 px-6 md:px-16 overflow-hidden">
      {/* Ambient Gradient Glows */}
      <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-violet-600/[0.08] blur-[150px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-20 left-10 w-[500px] h-[500px] bg-violet-900/[0.05] blur-[140px] rounded-full z-0" />

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

        {/* Hero Title & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-4 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Case Studies & Systems
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter mb-6">
            <DecryptedText
              text="ARCHITECTED PROJECTS."
              speed={35}
              maxIterations={8}
              encryptedClassName="text-violet-400"
            />
          </h1>
          <p className="text-lg md:text-xl text-neutral-300 max-w-3xl font-light leading-relaxed">
            A comprehensive catalog of production systems, AI agent workflows, and full-stack platforms engineered for low latency, zero data-retention privacy, and measurable business impact.
          </p>
        </motion.div>

        {/* Projects Deep Dive Cards */}
        <div className="flex flex-col gap-8 mb-16">
          {detailedProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: idx * 0.08 }}
            >
              <SpotlightCard
                spotlightColor="rgba(139, 92, 246, 0.2)"
                spotlightSize={400}
                className="p-6 sm:p-8 md:p-10 rounded-2xl flex flex-col lg:flex-row gap-8 lg:gap-12 items-center"
              >
                {/* Left Side: Interactive 3D Image Stack */}
                <div className="w-full lg:w-1/2 flex flex-col justify-center">
                  <div className="w-full h-56 sm:h-64 md:h-72">
                    <ProjectImageStack
                      images={project.images}
                      title={project.title}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-4 text-[11px] font-mono text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-violet-400" />
                      Hover cards for 3D fan-out
                    </span>
                    <span className="text-neutral-400">0{idx + 1} / 0{detailedProjects.length}</span>
                  </div>
                </div>

                {/* Right Side: Narrative, Engineering, Metrics & Links */}
                <div className="w-full lg:w-1/2 flex flex-col justify-between">
                  <div>
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        {project.title}
                      </h3>
                      <span className="text-[10px] uppercase font-mono tracking-wider px-2.5 py-1 rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-300 font-bold shrink-0">
                        {project.highlightMetric}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-mono text-neutral-400 mb-6">
                      {project.subtitle}
                    </p>

                    {/* PM Angle */}
                    <div className="mb-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Product Problem & Strategy</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                        {project.pmPhilosophy}
                      </p>
                    </div>

                    {/* Engineering Architecture */}
                    <div className="mb-6 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-violet-400 mb-1.5">
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Engineering Implementation</span>
                      </div>
                      <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
                        {project.engineeringArch}
                      </p>
                    </div>
                  </div>

                  {/* Tech stack and Action Buttons */}
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.03] text-neutral-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.08]">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold transition-all shadow-md cursor-pointer"
                      >
                        <span>Live Prototype</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>

                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.03] hover:border-violet-400 hover:bg-violet-500/10 text-neutral-200 hover:text-white text-xs font-semibold transition-all"
                      >
                        <Github className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" />
                        <span>Source Code</span>
                      </a>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Bottom Connect Banner */}
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
                Need a Custom System Built?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                Let&apos;s engineer your next milestone.
              </h3>
              <p className="text-sm text-neutral-400 font-light max-w-xl">
                From technical discovery and PRD writing to distributed microservices and LLM orchestrations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="mailto:priyanshurawat.business@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
              >
                <span>Initiate Discussion</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => navigateTo('home')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] hover:border-violet-400 hover:bg-white/[0.08] text-white text-xs font-semibold transition-all cursor-pointer"
              >
                <span>Back to Home</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

