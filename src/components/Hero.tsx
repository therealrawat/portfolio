import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-6">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-transparent" />

      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-sm text-slate-300">Product Manager & Engineer</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Building the Right Products to{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">
            Solve Operational Debt
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto"
        >
          Bridging the gap between Engineering and Strategy. From PRDs to Production,
          I architect solutions that scale.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => scrollToSection('projects')}
            className="group px-8 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-all duration-300 font-medium flex items-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
          >
            View Projects
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => scrollToSection('mindset')}
            className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 backdrop-blur-sm border border-slate-700/50 text-white rounded-xl transition-all duration-300 font-medium"
          >
            My Approach
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-20 flex items-center justify-center gap-8 text-slate-500 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>Available for opportunities</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
