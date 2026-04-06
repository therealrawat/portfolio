import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const projects = [
  {
    title: 'SyncScripts',
    problem: 'Professional teams face information overload post-meeting. AI-driven transcript analysis for actionable insights.',
    tags: ['Gemini AI', 'LLM Integration', 'TypeScript'],
    liveUrl: 'https://syncscripts.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1xxIGKOABNoZG3CJZFtJGcnBue6ZnAqBX/view?usp=drive_link',
  },
  {
    title: 'AI Agent Orchestrator',
    problem: 'Engineering teams lose 40% of capacity to manual operations. Automating complex technical workflows.',
    tags: ['Gemini AI', 'Google Cloud', 'Python'],
    liveUrl: '#',
    caseStudyUrl: '#',
  },
  {
    title: 'Intelligent PRD Gen',
    problem: 'PMs spend 15+ hours per feature writing PRDs. Quality assurance and technical spec automation.',
    tags: ['OpenAI', 'Next.js', 'PostgreSQL'],
    liveUrl: '#',
    caseStudyUrl: '#',
  },
  {
    title: 'PulseCheck AI',
    problem: 'Predictive churn analysis and revenue protection. Mapping LLM outputs to business intelligence.',
    tags: ['Recharts', 'Gemini AI', 'Tailwind'],
    liveUrl: '#',
    caseStudyUrl: '#',
  },
  {
    title: 'EchoMap',
    problem: 'Identifying subtle linguistic gaps in English using AI-driven speech recognition and diagnostics.',
    tags: ['Speech AI', 'TypeScript', 'Vite'],
    liveUrl: 'https://echo-map.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1qgzbImMw64QSZPnS2o3smqBu3XvGHzpH/view?usp=drive_link',
  },
  {
    title: '4Her',
    problem: 'Empowering menstrual health tracking with dignity and technical precision for wellness metrics.',
    tags: ['MongoDB', 'Express', 'React'],
    liveUrl: 'https://the4her.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/129ssK2BYRBFnUTGMo6yYc9sb5awPVW-s/view?usp=drive_link',
  },
];

export default function Projects() {
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
    <section id="projects" className="py-32 px-8 md:px-20 relative bg-black">
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
            Featured Work
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            SELECTED PROJECTS.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="group relative bg-black p-8 flex flex-col justify-between min-h-[400px] transition-colors duration-500 hover:bg-neutral-950"
            >
              <div>
                <div className="flex justify-between items-start mb-12">
                   <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-neutral-800 group-hover:text-white transition-colors duration-500" />
                </div>

                <h3 className="text-3xl font-black text-white mb-6 group-hover:translate-x-2 transition-transform duration-500">
                  {project.title}
                </h3>

                <p className="text-neutral-500 text-sm leading-relaxed mb-8 max-w-xs">
                  {project.problem}
                </p>
              </div>

              <div className="flex items-center gap-6 pt-10 border-t border-neutral-900 overflow-hidden">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  className="text-[10px] uppercase tracking-[0.3em] text-white font-bold hover:text-neutral-400 transition-colors"
                >
                  Live View
                </a>
                <a
                  href={project.caseStudyUrl}
                  target="_blank"
                  className="text-[10px] uppercase tracking-[0.3em] text-neutral-600 font-bold hover:text-white transition-colors"
                >
                  Read PRD
                </a>
              </div>

              {/* Hover Grain Effect for each card */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] pointer-events-none transition-opacity duration-500 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

