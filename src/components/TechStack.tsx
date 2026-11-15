import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Code2, Cloud, Database, Layers, Cpu, Terminal, CheckCircle2, ArrowUpRight, Zap, Boxes } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import TrueFocus from './reactbits/TrueFocus';
import LogoLoop, { type LogoItem } from './reactbits/LogoLoop';
import {
  TypeScriptIcon,
  ReactIcon,
  ThreeJsIcon,
  NextJsIcon,
  AngularIcon,
  TailwindIcon,
  ViteIcon,
  WebGLIcon,
  DotNetIcon,
  PythonIcon,
  FastApiIcon,
  DockerIcon,
  KubernetesIcon,
  PostgresIcon,
  RedisIcon,
  GoogleCloudIcon,
  GeminiIcon,
  SqlServerIcon,
  GsapIcon,
  getTechIcon,
} from './icons/TechIcons';

interface TechDetail {
  name: string;
  category: string;
  usedIn: string;
  impact: string;
  highlight?: boolean;
}

const TECH_DETAILS: Record<string, TechDetail> = {
  'Three.js': {
    name: 'Three.js',
    category: 'Frontend & 3D Graphics',
    usedIn: 'Immoral Combat',
    impact: 'Procedural 3D character animation blending, screen-space damage vignettes, and optimized 60 FPS WebGL canvas rendering.',
    highlight: true,
  },
  'WebGL': {
    name: 'WebGL',
    category: 'Frontend & 3D Graphics',
    usedIn: 'Immoral Combat',
    impact: 'Custom hardware-accelerated shaders, instant K.O. physics simulations, and low-latency rendering pipeline.',
    highlight: true,
  },
  'GSAP': {
    name: 'GSAP',
    category: 'Frontend & Animation',
    usedIn: 'Immoral Combat & Portfolio',
    impact: 'Timeline-based fighter hit animations, head-tracked speech bubbles, and reactive interface dynamics.',
  },
  'React': {
    name: 'React',
    category: 'Frontend Architecture',
    usedIn: 'SyncScripts, PulseCheck AI, Portfolio',
    impact: 'Component-driven reactive UI, stateless streaming views, and fluid cross-device micro-interactions.',
    highlight: true,
  },
  'TypeScript': {
    name: 'TypeScript',
    category: 'Core Language',
    usedIn: 'All Production Systems',
    impact: 'End-to-end type safety, strict compile-time validation, and scalable shared contracts across client and server.',
    highlight: true,
  },
  'Angular': {
    name: 'Angular',
    category: 'Enterprise Frontend',
    usedIn: 'TestingXperts & Healthcare EHR',
    impact: 'Enterprise-grade modular SPAs, dependency injection architectures, and scalable enterprise portals.',
  },
  'Next.js': {
    name: 'Next.js',
    category: 'Full-Stack Framework',
    usedIn: 'Intelligent PRD Generator',
    impact: 'Server-side rendering, streaming API endpoints, and optimized performance with zero client hydration overhead.',
  },
  'Tailwind CSS': {
    name: 'Tailwind CSS',
    category: 'Frontend Styling',
    usedIn: 'Immoral Combat, SyncScripts, Portfolio',
    impact: 'Atomic responsive layouts, custom design systems, and zero-runtime CSS footprint.',
  },
  'Vite': {
    name: 'Vite',
    category: 'Build Tooling',
    usedIn: 'Immoral Combat, Portfolio',
    impact: 'Sub-second Hot Module Replacement (HMR) and optimized rollup production bundling.',
  },
  '.NET Core': {
    name: '.NET Core',
    category: 'Backend Microservices',
    usedIn: 'Intermex Financial & Enterprise Remittance',
    impact: 'High-throughput transactional APIs, dependency injection architectures, and resilient distributed financial pipelines.',
    highlight: true,
  },
  'FastAPI': {
    name: 'FastAPI',
    category: 'Async Backend',
    usedIn: 'AI Microservices & ML Endpoints',
    impact: 'Asynchronous Python web services, Pydantic type validation, and high-concurrency LLM streaming.',
    highlight: true,
  },
  'Node.js': {
    name: 'Node.js',
    category: 'Runtime & APIs',
    usedIn: 'Client Backend Services',
    impact: 'Event-driven asynchronous services, webhook integrations, and lightweight microservices.',
  },
  'Python': {
    name: 'Python',
    category: 'AI & Data Engineering',
    usedIn: 'Agent Orchestration & Data ETL',
    impact: 'Intelligent multi-agent graph pipelines, statistical modeling, and automated data extraction.',
  },
  'PostgreSQL': {
    name: 'PostgreSQL',
    category: 'Relational Database',
    usedIn: 'Intelligent PRD Generator, SyncScripts',
    impact: 'ACID-compliant relational schemas, indexed JSONB fields, and zero-downtime database migrations.',
  },
  'SQL Server': {
    name: 'SQL Server',
    category: 'Enterprise Database',
    usedIn: 'TestingXperts & Enterprise Clients',
    impact: 'Optimized stored procedures, high-volume transactions, and enterprise data warehousing.',
  },
  'Redis': {
    name: 'Redis',
    category: 'In-Memory Cache',
    usedIn: 'Remittance APIs & AI Platforms',
    impact: 'Sub-millisecond data retrieval, distributed session caching, and API rate limiting.',
  },
  'Gemini AI': {
    name: 'Gemini AI',
    category: 'Generative AI & LLMs',
    usedIn: 'SyncScripts, PulseCheck AI, Portfolio Agent',
    impact: '1M+ token context window processing, zero data-retention privacy enforcement, and multi-modal transcript extraction.',
    highlight: true,
  },
  'OpenAI': {
    name: 'OpenAI',
    category: 'Generative AI',
    usedIn: 'Intelligent PRD Generator',
    impact: 'Structured JSON generation, technical requirement breakdown, and automated PRD specification synthesis.',
  },
  'LangChain': {
    name: 'LangChain',
    category: 'AI Orchestration',
    usedIn: 'Autonomous Agent Platform',
    impact: 'Chained reasoning, dynamic retrieval-augmented generation (RAG), and agentic workflow execution.',
  },
  'Vector DBs': {
    name: 'Vector DBs',
    category: 'Semantic Search',
    usedIn: 'Document Intelligence & RAG',
    impact: 'High-dimensional cosine similarity indexing and low-latency semantic context retrieval.',
  },
  'RAG': {
    name: 'RAG',
    category: 'AI Architecture',
    usedIn: 'Enterprise Knowledge Systems',
    impact: 'Context-augmented generation preventing hallucinations and grounding AI responses in verified corporate data.',
  },
  'Google Cloud': {
    name: 'Google Cloud',
    category: 'Cloud Infrastructure',
    usedIn: 'AI Orchestrations & Enterprise Deployments',
    impact: 'Cloud Run serverless containers, IAM policy management, and secure VPC microservice networking.',
    highlight: true,
  },
  'Azure': {
    name: 'Azure',
    category: 'Enterprise Cloud',
    usedIn: 'TestingXperts & Client Environments',
    impact: 'App Services, Azure DevOps pipelines, and enterprise Active Directory integrations.',
  },
  'Docker': {
    name: 'Docker',
    category: 'Containerization',
    usedIn: 'All Microservices & Production Environments',
    impact: 'Immutable reproducible container images, multi-stage minimal builds, and development parity.',
    highlight: true,
  },
  'Kubernetes': {
    name: 'Kubernetes',
    category: 'Container Orchestration',
    usedIn: 'Distributed Microservice Deployments',
    impact: 'Automated pod scaling, self-healing service discovery, and rolling zero-downtime updates.',
  },
  'CI/CD': {
    name: 'CI/CD',
    category: 'DevOps Automation',
    usedIn: 'GitHub Actions & Azure Pipelines',
    impact: 'Automated linting, strict unit/integration test gates, and continuous artifact deployment.',
  },
  'Supabase': {
    name: 'Supabase',
    category: 'Backend-as-a-Service',
    usedIn: 'Rapid Prototypes & Cloud DB',
    impact: 'Postgres row-level security, instant REST/GraphQL generation, and serverless authentication.',
  },
  'MongoDB': {
    name: 'MongoDB',
    category: 'Document Store',
    usedIn: 'Unstructured Data Pipelines',
    impact: 'Flexible document schemas for high-velocity logging and event streaming.',
  },
  'Git': {
    name: 'Git',
    category: 'Version Control',
    usedIn: 'All Development Workflows',
    impact: 'Strict branching strategies, atomic pull requests, semantic versioning, and collaborative code reviews.',
  },
  'Figma': {
    name: 'Figma',
    category: 'Product Design',
    usedIn: 'UI/UX & Design Systems',
    impact: 'High-fidelity wireframing, interactive prototyping, and seamless developer handoff.',
  },
  'Linear': {
    name: 'Linear',
    category: 'Agile & Roadmapping',
    usedIn: 'Sprint Planning & Issue Tracking',
    impact: 'Milestone tracking, cycle planning, and velocity tracking aligned with product strategy.',
  },
  'CrewAI': {
    name: 'CrewAI',
    category: 'Multi-Agent Frameworks',
    usedIn: 'AI Agent Orchestration Platform',
    impact: 'Collaborative autonomous multi-agent swarms tackling complex, sequential business tasks.',
  },
};

const techCategories = [
  {
    category: 'Frontend & 3D',
    icon: Code2,
    badge: '60 FPS WebGL',
    philosophy: 'Crafting responsive, high-framerate interfaces with custom WebGL shaders, procedural animation blending, and modular components.',
    technologies: ['Three.js', 'WebGL', 'GSAP', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js', 'Angular'],
  },
  {
    category: 'Backend & Services',
    icon: Terminal,
    badge: 'High Throughput',
    philosophy: 'Architecting resilient microservices, high-throughput financial remittance APIs, and asynchronous event-driven pipelines.',
    technologies: ['.NET Core', 'FastAPI', 'Node.js', 'Python', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'AI & Intelligence',
    icon: Cpu,
    badge: 'Zero-Retention RAG',
    philosophy: 'Orchestrating multi-agent systems, zero data-retention privacy analysis, and grounded RAG workflows powered by Gemini.',
    technologies: ['Gemini AI', 'OpenAI', 'LangChain', 'Vector DBs', 'RAG', 'CrewAI'],
  },
  {
    category: 'Cloud & Infrastructure',
    icon: Cloud,
    badge: 'Cloud Native',
    philosophy: 'Containerizing distributed services, configuring immutable environments, and automating CI/CD pipeline deployments.',
    technologies: ['Google Cloud', 'Docker', 'Kubernetes', 'Azure', 'CI/CD'],
  },
  {
    category: 'Data & Storage',
    icon: Database,
    badge: 'Sub-MS Latency',
    philosophy: 'Designing scalable relational schemas, in-memory caching strategies, and semantic vector stores for low retrieval latency.',
    technologies: ['SQL Server', 'PostgreSQL', 'Redis', 'Supabase', 'MongoDB'],
  },
  {
    category: 'Product & Tooling',
    icon: Layers,
    badge: 'Production Rigor',
    philosophy: 'Executing disciplined sprint cycles, PRD discovery, and structured architecture reviews from concept to live deployment.',
    technologies: ['Git', 'Linear', 'Figma', 'TypeScript', 'CrewAI'],
  },
];

const MARQUEE_ROW_1: LogoItem[] = [
  { name: 'Three.js', category: '3D WebGL', icon: <ThreeJsIcon className="w-4 h-4 text-white" />, highlight: true },
  { name: 'TypeScript', category: 'Language', icon: <TypeScriptIcon className="w-4 h-4" />, highlight: true },
  { name: 'React', category: 'Frontend', icon: <ReactIcon className="w-4 h-4" /> },
  { name: 'GSAP', category: 'Animation', icon: <GsapIcon className="w-4 h-4" /> },
  { name: 'Next.js', category: 'Full-Stack', icon: <NextJsIcon className="w-4 h-4" /> },
  { name: 'WebGL', category: 'Shaders', icon: <WebGLIcon className="w-4 h-4" />, highlight: true },
  { name: 'Angular', category: 'Enterprise', icon: <AngularIcon className="w-4 h-4" /> },
  { name: 'Tailwind CSS', category: 'Styling', icon: <TailwindIcon className="w-4 h-4" /> },
  { name: 'Vite', category: 'Tooling', icon: <ViteIcon className="w-4 h-4" /> },
];

const MARQUEE_ROW_2: LogoItem[] = [
  { name: '.NET Core', category: 'Backend', icon: <DotNetIcon className="w-4 h-4" />, highlight: true },
  { name: 'Gemini AI', category: 'LLMs & Agents', icon: <GeminiIcon className="w-4 h-4" />, highlight: true },
  { name: 'FastAPI', category: 'Async Python', icon: <FastApiIcon className="w-4 h-4" /> },
  { name: 'PostgreSQL', category: 'Relational DB', icon: <PostgresIcon className="w-4 h-4" /> },
  { name: 'Docker', category: 'Containers', icon: <DockerIcon className="w-4 h-4" />, highlight: true },
  { name: 'Redis', category: 'In-Memory Cache', icon: <RedisIcon className="w-4 h-4" /> },
  { name: 'Python', category: 'AI & Data', icon: <PythonIcon className="w-4 h-4" /> },
  { name: 'Google Cloud', category: 'Cloud Infra', icon: <GoogleCloudIcon className="w-4 h-4" />, highlight: true },
  { name: 'Kubernetes', category: 'Orchestration', icon: <KubernetesIcon className="w-4 h-4" /> },
  { name: 'SQL Server', category: 'Enterprise DB', icon: <SqlServerIcon className="w-4 h-4" /> },
];

export default function TechStack() {
  const [selectedTech, setSelectedTech] = useState<string>('Three.js');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
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

  const handleSelectTech = (tech: string) => {
    setSelectedTech(tech);
  };

  const activeDetail = TECH_DETAILS[selectedTech] || {
    name: selectedTech,
    category: 'Production Capability',
    usedIn: 'Enterprise & Portfolio Implementations',
    impact: 'Applied across scalable web applications, microservices, and AI workflows.',
  };

  const filteredCategories = activeCategoryFilter === 'All'
    ? techCategories
    : techCategories.filter(c => c.category.toLowerCase().includes(activeCategoryFilter.toLowerCase()));

  return (
    <section id="tech" className="py-32 px-6 sm:px-8 md:px-16 lg:px-20 bg-[#070709] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 -right-40 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute bottom-1/4 -left-40 w-96 h-96 bg-violet-900/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Production Architecture & Skills
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              <DecryptedText text="TECH STACK." speed={40} maxIterations={8} encryptedClassName="text-violet-400" />
            </h2>
          </motion.div>

          {/* ReactBits TrueFocus interactive banner */}
          <div className="mb-2">
            <TrueFocus
              sentence="Engineering Intentional Systems With Production Rigor"
              glowColor="rgba(139, 92, 246, 0.55)"
              borderColor="#8B5CF6"
              className="text-sm font-semibold"
            />
          </div>
        </div>

        {/* ─── ReactBits Infinite Marquee Ticker with Real Logos ──────────────── */}
        <div className="mb-14 space-y-3">
          <div className="flex items-center justify-between px-1 mb-2 text-[10px] font-mono text-neutral-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-violet-400" />
              Interactive Capability Ticker
            </span>
            <span className="text-neutral-400">Hover to pause • Click to inspect</span>
          </div>

          <LogoLoop
            items={MARQUEE_ROW_1}
            speed={38}
            direction="left"
            pauseOnHover={true}
            fadeOut={true}
            activeItem={selectedTech}
            onItemClick={(item) => handleSelectTech(item.name)}
          />

          <LogoLoop
            items={MARQUEE_ROW_2}
            speed={44}
            direction="right"
            pauseOnHover={true}
            fadeOut={true}
            activeItem={selectedTech}
            onItemClick={(item) => handleSelectTech(item.name)}
          />
        </div>

        {/* ─── Interactive Technology Inspector ─────────────────────────────── */}
        <motion.div
          layout
          className="mb-14 p-6 sm:p-8 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-950/20 via-[#0c0c14]/90 to-[#070709] backdrop-blur-xl shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(139,92,246,0.15)]"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 font-bold px-2 py-0.5 rounded-md border border-violet-500/20 bg-violet-500/10">
                  {activeDetail.category}
                </span>
                <span className="text-neutral-500 text-xs">•</span>
                <span className="text-xs font-mono text-neutral-300">
                  Proven in: <strong className="text-white font-semibold">{activeDetail.usedIn}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3.5 pt-1">
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center p-2 shrink-0 shadow-inner">
                  {getTechIcon(activeDetail.name, "w-6 h-6") || <Cpu className="w-5 h-5 text-violet-400" />}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {activeDetail.name}
                </h3>
                {activeDetail.highlight && (
                  <span className="text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full border border-violet-400/30 bg-violet-500/20 text-violet-200 font-bold flex items-center gap-1">
                    <Zap className="w-2.5 h-2.5 text-violet-400" />
                    Core Specialty
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-neutral-300 font-light leading-relaxed max-w-4xl pt-1">
                {activeDetail.impact}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Status
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Production Ready
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── Category Filter Pills ────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {['All', 'Frontend', 'Backend', 'AI', 'Cloud', 'Data', 'Tooling'].map((cat) => {
            const isSelected = activeCategoryFilter === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategoryFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'border border-violet-500 bg-violet-500/20 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] font-bold'
                    : 'border border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white hover:border-white/20'
                }`}
              >
                {cat === 'All' ? 'All Capabilities' : cat}
              </button>
            );
          })}
        </div>

        {/* ─── Bento Cards Grid ─────────────────────────────────────────────── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredCategories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.category}
                  variants={itemVariants}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="h-full"
                >
                  <SpotlightCard
                    spotlightColor="rgba(139, 92, 246, 0.2)"
                    spotlightSize={340}
                    className="p-6 sm:p-8 min-h-[340px] h-full flex flex-col justify-between group hover:border-violet-500/40 transition-all duration-300"
                  >
                    <div>
                      {/* Top Row: Icon, Title & Badge */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-violet-400/80 group-hover:bg-violet-500/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-500">
                            <Icon className="w-4 h-4 text-neutral-400 group-hover:text-violet-300 transition-colors duration-500" />
                          </div>
                          <div>
                            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight uppercase group-hover:text-violet-200 transition-colors duration-300">
                              {category.category}
                            </h3>
                          </div>
                        </div>

                        <span className="text-[9px] uppercase font-mono font-bold tracking-wider px-2 py-0.5 rounded-md border border-violet-500/30 bg-violet-500/10 text-violet-300 shrink-0">
                          {category.badge}
                        </span>
                      </div>

                      {/* Philosophy summary */}
                      <p className="text-xs text-neutral-400 font-light leading-relaxed mb-6">
                        {category.philosophy}
                      </p>

                      {/* Technologies Interactive Pills with Authentic Logos */}
                      <div className="flex flex-wrap gap-2">
                        {category.technologies.map((tech) => {
                          const isSelected = selectedTech === tech;
                          const hasDetails = !!TECH_DETAILS[tech];
                          const icon = getTechIcon(tech, "w-3.5 h-3.5");
                          return (
                            <button
                              key={tech}
                              type="button"
                              onClick={() => handleSelectTech(tech)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                                isSelected
                                  ? 'border border-violet-400 bg-violet-500/25 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)] font-bold'
                                  : 'border border-white/[0.08] bg-white/[0.03] text-neutral-300 hover:text-white hover:bg-violet-950/30 hover:border-violet-400/50'
                              }`}
                            >
                              {icon && <span className="shrink-0">{icon}</span>}
                              <span>{tech}</span>
                              {hasDetails && (
                                <ArrowUpRight className={`w-3 h-3 transition-transform ${isSelected ? 'text-violet-300 translate-x-0.5 -translate-y-0.5' : 'text-neutral-500 opacity-60'}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-400 group-hover:text-violet-400/80 transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Production Verified
                      </span>
                      <span className="text-neutral-400">Priyanshu Rawat</span>
                    </div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
