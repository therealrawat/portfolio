import { motion } from 'framer-motion';
import { Brain, FileText, Code2 } from 'lucide-react';

const competencies = [
  {
    icon: Brain,
    title: 'AI Orchestration',
    description:
      'Building intelligent systems that leverage LLMs and AI agents to automate complex workflows and reduce operational overhead.',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    icon: FileText,
    title: 'Product Strategy (PRDs)',
    description:
      'Crafting comprehensive Product Requirements Documents that align stakeholders, define clear success metrics, and guide execution.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Code2,
    title: 'Full-Stack Development',
    description:
      'End-to-end implementation with React, TypeScript, and modern cloud infrastructure. From prototype to production-ready systems.',
    gradient: 'from-indigo-500 to-cyan-500',
  },
];

export default function ValueProp() {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Core Competencies
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A unique blend of product thinking, technical execution, and strategic vision
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {competencies.map((competency, index) => {
            const Icon = competency.icon;
            return (
              <motion.div
                key={competency.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-8 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl hover:border-slate-700/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${competency.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {competency.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed">
                    {competency.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
