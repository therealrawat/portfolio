import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-16 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h3 className="text-2xl font-bold text-white mb-2">Let's Build Together</h3>
            <p className="text-slate-400">
              Open to product management and engineering opportunities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-4"
          >
            <a
              href="https://linkedin.com/in/rawat-priyanshu"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://github.com/therealrawat"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="mailto:priyanshurawat.business@gmail.com"
              className="w-12 h-12 bg-indigo-500 hover:bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-all duration-300 shadow-lg shadow-indigo-500/25"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-800/50">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-slate-500 text-sm"
          >
            © {currentYear} Priyanshu Rawat. All rights reserved.
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            onClick={scrollToTop}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm group"
          >
            Back to top
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
