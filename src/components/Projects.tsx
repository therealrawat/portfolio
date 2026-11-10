import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ExternalLink, FileText, Sparkles } from 'lucide-react';
import { sfx } from '../utils/audio';

type ProjectCategory = 'all' | 'ai' | 'fullstack' | 'automation';

interface Project {
  title: string;
  category: 'ai' | 'fullstack' | 'automation';
  badge: string;
  problem: string;
  tags: string[];
  liveUrl: string;
  caseStudyUrl: string;
}

const projects: Project[] = [
  {
    title: 'SyncScripts',
    category: 'ai',
    badge: 'Production AI',
    problem: 'Professional teams face severe information overload post-meeting. Transforms transcripts into structured actionable insights with Gemini 1.5 Flash in a stateless zero-retention architecture.',
    tags: ['Gemini 1.5 Flash', 'TypeScript', 'Stateless Privacy', 'SQL'],
    liveUrl: 'https://syncscripts.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1xxIGKOABNoZG3CJZFtJGcnBue6ZnAqBX/view?usp=drive_link',
  },
  {
    title: 'EchoMap',
    category: 'ai',
    badge: 'Diagnostic AI',
    problem: 'Identifies subtle linguistic gaps in English pronunciation using AI speech recognition and real-time audio spectrogram analysis to provide personalized phonetic feedback.',
    tags: ['Speech AI', 'TypeScript', 'Web Audio API', 'Vite'],
    liveUrl: 'https://echo-map.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1qgzbImMw64QSZPnS2o3smqBu3XvGHzpH/view?usp=drive_link',
  },
  {
    title: '4Her',
    category: 'fullstack',
    badge: 'Wellness Platform',
    problem: 'Empowering menstrual health tracking with technical precision and utmost data dignity. Features cycle predictive algorithms and private health analytics.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    liveUrl: 'https://the4her.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/129ssK2BYRBFnUTGMo6yYc9sb5awPVW-s/view?usp=drive_link',
  },
  {
    title: 'AI Agent Orchestrator',
    category: 'automation',
    badge: 'Enterprise Architecture',
    problem: 'Engineering teams lose ~40% of sprint capacity to manual operational tasks and context switching. Orchestrates multi-agent workflows to automate technical support runs.',
    tags: ['Google Cloud', 'Gemini AI', 'Python', 'Microservices'],
    liveUrl: 'https://syncscripts.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1xxIGKOABNoZG3CJZFtJGcnBue6ZnAqBX/view?usp=drive_link',
  },
  {
    title: 'Intelligent PRD Gen',
    category: 'automation',
    badge: 'Productivity Tool',
    problem: 'PMs spend 15+ hours per feature drafting PRDs from scratch. Integrates multiple LLMs to automate comprehensive PRD creation with acceptance criteria and architecture specs.',
    tags: ['OpenAI', 'Next.js', 'PostgreSQL', 'Tailwind'],
    liveUrl: 'https://echo-map.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1qgzbImMw64QSZPnS2o3smqBu3XvGHzpH/view?usp=drive_link',
  },
  {
    title: 'PulseCheck AI',
    category: 'ai',
    badge: 'Predictive Intelligence',
    problem: 'Predictive churn analysis and revenue protection engine mapping LLM JSON outputs directly into real-time business intelligence dashboards.',
    tags: ['Recharts', 'Gemini AI', 'Tailwind', 'Analytics'],
    liveUrl: 'https://the4her.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/129ssK2BYRBFnUTGMo6yYc9sb5awPVW-s/view?usp=drive_link',
  },
];

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');

  const filteredProjects = projects.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  const categories: { key: ProjectCategory; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'ai', label: 'AI & Speech Systems' },
    { key: 'fullstack', label: 'Full-Stack Apps' },
    { key: 'automation', label: 'Product & Agent Automation' },
  ];

  return (
    <section id="projects" className="py-32 px-6 md:px-20 relative bg-black border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto">
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-4 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Engineering Portfolio
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter">
              SELECTED PROJECTS.
            </h2>
          </motion.div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => {
                  sfx.playInteract();
                  setActiveCategory(cat.key);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 ${
                  activeCategory === cat.key
                    ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                key={project.title}
                className="group relative bg-neutral-950/80 border border-white/[0.08] hover:border-white/20 p-8 rounded-2xl flex flex-col justify-between min-h-[420px] transition-all duration-500 hover:shadow-2xl hover:shadow-white/[0.03]"
              >
                <div>
                  {/* Top Bar: Badge & External Icon */}
                  <div className="flex justify-between items-start mb-8">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.06] border border-white/10 rounded-full text-[10px] uppercase tracking-widest font-bold text-neutral-300">
                      <Sparkles className="w-3 h-3 text-orange-400" />
                      {project.badge}
                    </span>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-neutral-500 group-hover:text-white bg-white/[0.03] hover:bg-white/10 rounded-xl transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 group-hover:text-orange-200 transition-colors duration-300">
                    {project.title}
                  </h3>

                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-8">
                    {project.problem}
                  </p>
                </div>

                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[10px] font-mono text-neutral-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-5 border-t border-white/[0.08]">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white hover:text-orange-300 transition-colors"
                    >
                      <span>Live App</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={project.caseStudyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-white transition-colors"
                    >
                      <span>PRD Document</span>
                      <FileText className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
