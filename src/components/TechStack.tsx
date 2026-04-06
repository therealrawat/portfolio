import { motion } from 'framer-motion';
import { Code2, Cloud, Database, Layers, Sparkles, Terminal } from 'lucide-react';

const techCategories = [
  {
    category: 'Frontend',
    icon: Code2,
    technologies: ['Angular', 'React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'],
  },
  {
    category: 'Backend',
    icon: Terminal,
    technologies: ['.NET', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
  },
  {
    category: 'AI & ML',
    icon: Sparkles,
    technologies: ['Gemini AI', 'OpenAI', 'LangChain', 'Vector DBs', 'RAG'],
  },
  {
    category: 'Cloud',
    icon: Cloud,
    technologies: ['Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
    <section id="tech" className="py-32 px-8 md:px-20 bg-black relative">
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
            Capabilities
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            TECH STACK.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900"
        >
          {techCategories.map((category) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                variants={itemVariants}
                className="group relative bg-black p-10 min-h-[300px] transition-colors duration-500 hover:bg-neutral-950"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-10 h-10 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon className="w-4 h-4 text-neutral-500 group-hover:text-black transition-colors duration-500" />
                  </div>
                  <h3 className="text-xl font-black text-white tracking-tight uppercase">{category.category}</h3>
                </div>

                <div className="flex flex-wrap gap-3">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold hover:text-white transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
