import { motion } from 'framer-motion';
import { Search, FileText, Boxes, Hammer, IterationCw } from 'lucide-react';

const phases = [
  {
    icon: Search,
    title: 'Discovery',
    description: 'Deep user research, problem validation, and competitive analysis to ensure we\'re solving the right problem.',
    number: '01',
  },
  {
    icon: FileText,
    title: 'PRD',
    description: 'Comprehensive Product Requirements Document with clear success metrics, user stories, and technical specifications.',
    number: '02',
  },
  {
    icon: Boxes,
    title: 'Architecture',
    description: 'System design, technology selection, and infrastructure planning for scalability and maintainability.',
    number: '03',
  },
  {
    icon: Hammer,
    title: 'Build',
    description: 'Agile development with continuous integration, code reviews, and rapid prototyping to validate assumptions.',
    number: '04',
  },
  {
    icon: IterationCw,
    title: 'Iteration',
    description: 'Data-driven improvements based on user feedback, analytics, and performance metrics to optimize product-market fit.',
    number: '05',
  },
];

export default function ProductMindset() {
  return (
    <section id="mindset" className="py-24 px-6 relative">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My Product Approach
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            A structured methodology for turning ambiguous problems into production-ready solutions
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-indigo-500/50 to-transparent hidden md:block" />

          <div className="space-y-12">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <motion.div
                  key={phase.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start gap-8"
                >
                  <div className="hidden md:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex-shrink-0 shadow-lg shadow-indigo-500/25">
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  <div className="flex-1 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 md:p-8 hover:border-slate-700/50 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="md:hidden flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex-shrink-0">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-5xl font-bold text-slate-800">{phase.number}</span>
                          <h3 className="text-2xl font-semibold text-white">{phase.title}</h3>
                        </div>
                        <p className="text-slate-400 leading-relaxed">{phase.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
