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
    <section id="mindset" className="py-32 px-8 md:px-20 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Product Lifecycle
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            MY APPROACH.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-px bg-neutral-900 border border-neutral-900"
        >
          {phases.map((phase) => {
            const Icon = phase.icon;
            return (
              <motion.div
                key={phase.title}
                variants={itemVariants}
                className="group relative bg-black p-10 min-h-[300px] flex flex-col justify-between transition-colors duration-500 hover:bg-neutral-950"
              >
                <div>
                  <div className="w-12 h-12 border border-neutral-800 flex items-center justify-center mb-10 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors duration-500" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 uppercase tracking-tight">
                    {phase.title}
                  </h3>

                  <p className="text-neutral-500 leading-relaxed text-sm">
                    {phase.description}
                  </p>
                </div>

                <div className="absolute top-6 right-6 text-[40px] font-black text-white/[0.01] transition-colors group-hover:text-white/[0.03]">
                  {phase.number}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
