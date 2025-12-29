import { motion } from 'framer-motion';
import { Code2, Cloud, Database, Layers, Sparkles, Terminal } from 'lucide-react';

const techCategories = [
  {
    category: 'Frontend',
    icon: Code2,
    technologies: ['Angular','React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Next.js'],
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    category: 'Backend',
    icon: Terminal,
    technologies: ['.NET', 'Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    category: 'AI & ML',
    icon: Sparkles,
    technologies: ['Gemini AI', 'OpenAI', 'LangChain', 'Vector DBs', 'RAG'],
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    category: 'Cloud',
    icon: Cloud,
    technologies: ['Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Terraform'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    category: 'Database',
    icon: Database,
    technologies: ['SQL Server', 'Supabase', 'PostgreSQL', 'MongoDB', 'Redis'],
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    category: 'Tools',
    icon: Layers,
    technologies: ['Git', 'Figma', 'Linear', 'Notion', 'Analytics', 'CrewAI'],
    gradient: 'from-slate-500 to-slate-600',
  },
];

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tech Stack
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Modern technologies and frameworks I leverage to build scalable, production-ready systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-br ${category.gradient} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{category.category}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {category.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 rounded-lg text-sm text-slate-300 hover:text-white hover:border-slate-600/50 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
