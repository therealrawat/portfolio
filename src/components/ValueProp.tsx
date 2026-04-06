import { motion } from 'framer-motion';
import { Brain, FileText, Code2 } from 'lucide-react';

const competencies = [
  {
    icon: Brain,
    title: 'AI Orchestration',
    description:
      'Building intelligent systems that leverage LLMs and AI agents to automate complex workflows and reduce operational overhead.',
  },
  {
    icon: FileText,
    title: 'Product Strategy',
    description:
      'Crafting comprehensive Product Requirements Documents that align stakeholders, define clear success metrics, and guide execution.',
  },
  {
    icon: Code2,
    title: 'Full-Stack Execution',
    description:
      'End-to-end implementation with modern frameworks. Rapid prototyping from concept to production-ready systems.',
  },
];

export default function ValueProp() {
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
          className="mb-20"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Core Competencies
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            THE VALUE PROP.
          </h2>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-px bg-neutral-900 border border-neutral-900"
        >
          {competencies.map((competency) => {
            const Icon = competency.icon;
            return (
              <motion.div
                key={competency.title}
                variants={itemVariants}
                className="group relative bg-black p-10 min-h-[350px] flex flex-col justify-between transition-colors duration-500 hover:bg-neutral-950"
              >
                <div>
                  <div className="w-12 h-12 border border-neutral-800 flex items-center justify-center mb-10 group-hover:bg-white group-hover:border-white transition-all duration-500">
                    <Icon className="w-5 h-5 text-neutral-500 group-hover:text-black transition-colors duration-500" />
                  </div>

                  <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
                    {competency.title}
                  </h3>

                  <p className="text-neutral-500 leading-relaxed text-sm max-w-[280px]">
                    {competency.description}
                  </p>
                </div>

                <div className="absolute bottom-6 right-6 text-[40px] font-black text-white/[0.02] transition-colors group-hover:text-white/[0.05]">
                  0{competencies.indexOf(competency) + 1}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
