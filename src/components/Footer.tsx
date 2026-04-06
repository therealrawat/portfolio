import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-24 px-8 md:px-20 border-t border-neutral-900 bg-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-md"
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Get In Touch
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              LET'S BUILD <br /> TOGETHER.
            </h3>
            <p className="text-neutral-500 text-lg leading-relaxed">
              Open for strategic product roles and engineering opportunities.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col gap-6 w-full md:w-auto"
          >
            {[
              { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/rawat-priyanshu' },
              { icon: Github, label: 'GitHub', href: 'https://github.com/therealrawat' },
              { icon: Mail, label: 'Email', href: 'mailto:priyanshurawat.business@gmail.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-6 border border-neutral-900 hover:border-white transition-colors duration-500"
              >
                <div className="flex items-center gap-4">
                  <social.icon className="w-5 h-5 text-neutral-500 group-hover:text-white transition-colors" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 group-hover:text-white transition-colors font-bold">
                    {social.label}
                  </span>
                </div>
                <ArrowUp className="w-4 h-4 rotate-45 text-neutral-800 group-hover:text-white transition-all duration-500" />
              </a>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-neutral-900">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-700 font-bold">
            © {currentYear} PRIYANSHU RAWAT. ALL RIGHTS RESERVED.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500 hover:text-white transition-colors font-bold"
          >
            BACK TO TOP
            <div className="w-8 h-8 border border-neutral-800 flex items-center justify-center group-hover:border-white transition-colors">
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
