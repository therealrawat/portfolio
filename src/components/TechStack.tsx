import { motion, type Variants } from 'framer-motion';
import { Code2, Cloud, Database, Layers, Cpu, Terminal } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import TrueFocus from './reactbits/TrueFocus';

const techCategories = [
  {
    category: 'Frontend',
    icon: Code2,
    technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'],
  },
  {
    category: 'Backend',
    icon: Terminal,
    technologies: ['.NET Core', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'AI & ML',
    icon: Cpu,
    technologies: ['Gemini AI', 'OpenAI', 'LangChain', 'Vector DBs', 'RAG'],
  },
  {
    category: 'Cloud',
    icon: Cloud,
    technologies: ['Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'CI/CD'],
  },
  {
    category: 'Database',
    icon: Database,
    technologies: ['SQL Server', 'Supabase', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Tools',
    icon: Layers,
    technologies: ['Git', 'Figma', 'Linear', 'Notion', 'Analytics', 'CrewAI'],
  },
];

export default function TechStack() {
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

  return (
    <section id="tech" className="py-32 px-8 md:px-20 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Capabilities
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

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {techCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div key={category.category} variants={itemVariants} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(139, 92, 246, 0.18)"
                  spotlightSize={300}
                  className="p-8 min-h-[300px] h-full flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:border-violet-400/80 group-hover:bg-violet-500/20 group-hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all duration-500">
                        <Icon className="w-4 h-4 text-neutral-400 group-hover:text-violet-300 transition-colors duration-500" />
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-violet-200 transition-colors duration-300">
                        {category.category}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {category.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] group-hover:border-violet-500/30 rounded-lg text-xs font-mono text-neutral-300 hover:text-white hover:bg-violet-950/30 hover:border-violet-400/60 transition-all cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] text-[10px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-violet-400/70 transition-colors">
                    Production Verified
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
