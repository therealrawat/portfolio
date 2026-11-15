import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Database,
  Layers,
  Boxes,
  Zap,
  Cloud,
  FileText,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import ShinyText from './reactbits/ShinyText';
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
  NodeJsIcon,
  DockerIcon,
  KubernetesIcon,
  PostgresIcon,
  RedisIcon,
  GoogleCloudIcon,
  GeminiIcon,
  OpenAiIcon,
  GitIcon,
  FigmaIcon,
  SqlServerIcon,
  SupabaseIcon,
  GsapIcon,
} from './icons/TechIcons';

interface TechItem {
  name: string;
  icon: React.ReactNode;
}

interface Category {
  id: string;
  label: string;
  techs: TechItem[];
}

interface TechDetail {
  name: string;
  category: string;
  usedIn: string;
  impact: string;
}

const TECH_DETAILS: Record<string, TechDetail> = {
  'Three.js': {
    name: 'Three.js',
    category: 'Frontend & 3D Graphics',
    usedIn: 'Immoral Combat',
    impact: 'Procedural 3D character animation blending, screen-space damage vignettes, and optimized 60 FPS WebGL canvas rendering.',
  },
  'WebGL': {
    name: 'WebGL',
    category: 'Frontend & 3D Graphics',
    usedIn: 'Immoral Combat',
    impact: 'Custom hardware-accelerated shaders, instant K.O. physics simulations, and low-latency rendering pipeline.',
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
  },
  'TypeScript': {
    name: 'TypeScript',
    category: 'Core Language',
    usedIn: 'All Production Systems',
    impact: 'End-to-end type safety, strict compile-time validation, and scalable shared contracts across client and server.',
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
  },
  'FastAPI': {
    name: 'FastAPI',
    category: 'Async Backend',
    usedIn: 'AI Microservices & ML Endpoints',
    impact: 'Asynchronous Python web services, Pydantic type validation, and high-concurrency LLM streaming.',
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
  'Microservices': {
    name: 'Microservices',
    category: 'Distributed Systems',
    usedIn: 'TestingXperts Enterprise Clients',
    impact: 'Decoupled, event-driven domain boundaries with high availability and autonomous scalability.',
  },
  'REST APIs': {
    name: 'REST APIs',
    category: 'API Architecture',
    usedIn: 'Financial & Healthcare Systems',
    impact: 'Strict HTTP status codes, robust idempotency guarantees, and comprehensive OpenAPI contracts.',
  },
  'Gemini AI': {
    name: 'Gemini AI',
    category: 'Generative AI & LLMs',
    usedIn: 'SyncScripts, PulseCheck AI, Portfolio Agent',
    impact: '1M+ token context window processing, zero data-retention privacy enforcement, and multi-modal transcript extraction.',
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
  'CrewAI': {
    name: 'CrewAI',
    category: 'Multi-Agent Frameworks',
    usedIn: 'AI Agent Orchestration Platform',
    impact: 'Collaborative autonomous multi-agent swarms tackling complex, sequential business tasks.',
  },
  'Vector DBs': {
    name: 'Vector DBs',
    category: 'Semantic Search',
    usedIn: 'Document Intelligence & RAG',
    impact: 'High-dimensional cosine similarity indexing and low-latency semantic context retrieval.',
  },
  'RAG Architecture': {
    name: 'RAG Architecture',
    category: 'AI Architecture',
    usedIn: 'Enterprise Knowledge Systems',
    impact: 'Context-augmented generation preventing hallucinations and grounding AI responses in verified corporate data.',
  },
  'Google Cloud': {
    name: 'Google Cloud',
    category: 'Cloud Infrastructure',
    usedIn: 'AI Orchestrations & Enterprise Deployments',
    impact: 'Cloud Run serverless containers, IAM policy management, and secure VPC microservice networking.',
  },
  'Docker': {
    name: 'Docker',
    category: 'Containerization',
    usedIn: 'All Microservices & Production Environments',
    impact: 'Immutable reproducible container images, multi-stage minimal builds, and development parity.',
  },
  'Kubernetes': {
    name: 'Kubernetes',
    category: 'Container Orchestration',
    usedIn: 'Distributed Microservice Deployments',
    impact: 'Automated pod scaling, self-healing service discovery, and rolling zero-downtime updates.',
  },
  'Azure': {
    name: 'Azure',
    category: 'Enterprise Cloud',
    usedIn: 'TestingXperts & Client Environments',
    impact: 'App Services, Azure DevOps pipelines, and enterprise Active Directory integrations.',
  },
  'CI/CD': {
    name: 'CI/CD',
    category: 'DevOps Automation',
    usedIn: 'GitHub Actions & Azure Pipelines',
    impact: 'Automated linting, strict unit/integration test gates, and continuous artifact deployment.',
  },
  'Git': {
    name: 'Git',
    category: 'Version Control',
    usedIn: 'All Development Workflows',
    impact: 'Strict branching strategies, atomic pull requests, semantic versioning, and collaborative code reviews.',
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
  'PRD Methodology': {
    name: 'PRD Methodology',
    category: 'Product Management',
    usedIn: 'All Strategic Product Initiatives',
    impact: 'Deconstructing ambiguous problems into crisp acceptance criteria, metric goals, and technical scopes.',
  },
  'Stateless Architecture': {
    name: 'Stateless Architecture',
    category: 'Systems Engineering',
    usedIn: 'SyncScripts & AI Agents',
    impact: 'Stateless execution boundaries ensuring complete enterprise data privacy and infinite horizontal scaling.',
  },
};

const categories: Category[] = [
  {
    id: 'frontend',
    label: 'Frontend & 3D',
    techs: [
      { name: 'React', icon: <ReactIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'TypeScript', icon: <TypeScriptIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Three.js', icon: <ThreeJsIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> },
      { name: 'Next.js', icon: <NextJsIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'WebGL', icon: <WebGLIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Angular', icon: <AngularIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Tailwind CSS', icon: <TailwindIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'GSAP', icon: <GsapIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Vite', icon: <ViteIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & Services',
    techs: [
      { name: '.NET Core', icon: <DotNetIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'FastAPI', icon: <FastApiIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Node.js', icon: <NodeJsIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Python', icon: <PythonIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Microservices', icon: <Terminal className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'REST APIs', icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Intelligence',
    techs: [
      { name: 'Gemini AI', icon: <GeminiIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'OpenAI', icon: <OpenAiIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'LangChain', icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'CrewAI', icon: <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'Vector DBs', icon: <Database className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'RAG Architecture', icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    techs: [
      { name: 'Google Cloud', icon: <GoogleCloudIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Docker', icon: <DockerIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Kubernetes', icon: <KubernetesIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Azure', icon: <Cloud className="w-5 h-5 sm:w-6 sm:h-6 text-sky-400" /> },
      { name: 'CI/CD', icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'Git', icon: <GitIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
    ],
  },
  {
    id: 'databases',
    label: 'Databases & Storage',
    techs: [
      { name: 'PostgreSQL', icon: <PostgresIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'SQL Server', icon: <SqlServerIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Redis', icon: <RedisIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Supabase', icon: <SupabaseIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'MongoDB', icon: <Database className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" /> },
    ],
  },
  {
    id: 'architecture',
    label: 'Architecture & Design',
    techs: [
      { name: 'Figma', icon: <FigmaIcon className="w-5 h-5 sm:w-6 sm:h-6" /> },
      { name: 'Linear', icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" /> },
      { name: 'PRD Methodology', icon: <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
      { name: 'Stateless Architecture', icon: <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-300" /> },
    ],
  },
];

export default function TechStack() {
  const [activeCategory, setActiveCategory] = useState<string>('frontend');
  const [selectedTech, setSelectedTech] = useState<string>('React');

  const currentCategory = categories.find((c) => c.id === activeCategory) || categories[0];

  const activeDetail = TECH_DETAILS[selectedTech] || {
    name: selectedTech,
    category: 'Core Competency',
    usedIn: 'Enterprise & Portfolio Implementations',
    impact: 'Applied across scalable systems, distributed microservices, and modern web applications.',
  };

  return (
    <section id="tech" className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20 bg-[#070709] relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="pointer-events-none absolute top-1/4 -right-40 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 -left-40 w-96 h-96 bg-white/[0.02] rounded-full blur-[140px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="mb-14 md:mb-18">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Tech Stack & Capabilities
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal sm:font-medium tracking-tight text-white leading-[1.12] max-w-4xl">
            Delivering{' '}
            <ShinyText
              text="Cutting-Edge"
              speed={4}
              className="font-semibold text-white"
            />
            <br />
            Technology Solutions
          </h2>

          <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mt-5 leading-relaxed font-light">
            Specialising in modern tech stacks with a focus on distributed microservices, AI orchestration, and high-performance WebGL systems, I engineer tailored digital solutions that combine architectural rigor, high velocity, and business impact.
          </p>
        </div>

        {/* Mobile Horizontal Tabs */}
        <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedTech(cat.techs[0].name);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${isActive
                  ? 'bg-white/[0.1] border border-white/60 text-white font-semibold shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                  : 'bg-white/[0.03] border border-white/10 text-neutral-400 hover:text-white'
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Desktop Left Sidebar: Vertical Category Tabs */}
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-5 pt-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setSelectedTech(cat.techs[0].name);
                  }}
                  className="group flex items-center gap-3 text-left transition-all cursor-pointer select-none py-1.5"
                >
                  {/* Active Indicator Bar */}
                  <div
                    className={`w-[2px] h-5 rounded-full transition-all duration-300 ${isActive
                      ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                      : 'bg-transparent group-hover:bg-white/20'
                      }`}
                  />
                  <span
                    className={`text-base sm:text-lg transition-colors duration-200 ${isActive
                      ? 'text-white font-semibold'
                      : 'text-neutral-500 hover:text-neutral-300 font-normal'
                      }`}
                  >
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Grid of Tech Cards using ReactBits SpotlightCard */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: 'easeInOut' }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
              >
                {currentCategory.techs.map((tech) => {
                  const isSelected = selectedTech === tech.name;
                  return (
                    <SpotlightCard
                      key={tech.name}
                      spotlightColor="rgba(255, 255, 255, 0.12)"
                      spotlightSize={260}
                      onClick={() => setSelectedTech(tech.name)}
                      className={`group h-20 sm:h-22 cursor-pointer transition-all duration-300 border ${isSelected
                        ? 'border-white/60 bg-white/[0.08] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                        : 'border-white/10 bg-[#0c0c11]/80 hover:border-white/40 hover:bg-white/[0.04]'
                        }`}
                      contentClassName="flex items-center justify-center w-full h-full px-4 py-3"
                    >
                      <div className="flex items-center justify-center gap-2.5 sm:gap-3">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
                          {tech.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white tracking-tight group-hover:text-white transition-colors whitespace-nowrap">
                          {tech.name}
                        </span>
                      </div>
                    </SpotlightCard>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Interactive Inspector Strip */}
            <motion.div
              layout
              key={activeDetail.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-8 p-5 sm:p-6 rounded-2xl border border-white/10 bg-[#0e0e14]/90 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-200 font-bold px-2 py-0.5 rounded-md border border-white/20 bg-white/[0.05]">
                    {activeDetail.category}
                  </span>
                  <span className="text-neutral-500 text-xs">•</span>
                  <span className="text-xs font-mono text-neutral-300">
                    Proven in: <strong className="text-white font-semibold">{activeDetail.usedIn}</strong>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  {activeDetail.name}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-3xl">
                  {activeDetail.impact}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-1.5 text-xs font-mono text-neutral-200 bg-white/[0.05] border border-white/20 px-3 py-1.5 rounded-xl self-start sm:self-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                Production Rigor
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
