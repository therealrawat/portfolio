import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUp, Instagram } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="relative py-24 px-8 md:px-20 bg-[#070709]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-md"
          >
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-6 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Get In Touch
            </div>
            <h3 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              <DecryptedText text="LET'S BUILD TOGETHER." speed={40} maxIterations={8} encryptedClassName="text-violet-400" />
            </h3>
            <p className="text-neutral-400 text-lg leading-relaxed font-light">
              Open for strategic engineering, product management roles, and technical consulting partnerships.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.76, 0, 0.24, 1] }}
            className="flex flex-col gap-4 w-full md:w-auto min-w-[280px]"
          >
            {[
              { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/rawat-priyanshu' },
              { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/lowwhiskey' },
              { icon: Github, label: 'GitHub', href: 'https://github.com/therealrawat' },
              { icon: Mail, label: 'Email', href: 'mailto:priyanshurawat.business@gmail.com' },
            ].map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/[0.02] hover:border-violet-500/60 hover:bg-violet-950/20 hover:shadow-[0_0_20px_rgba(139,92,246,0.25)] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <social.icon className="w-5 h-5 text-neutral-400 group-hover:text-violet-400 transition-colors" />
                  <span className="text-[11px] uppercase tracking-[0.3em] text-neutral-300 group-hover:text-white transition-colors font-bold">
                    {social.label}
                  </span>
                </div>
                <ArrowUp className="w-4 h-4 rotate-45 text-neutral-500 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
            © {currentYear} PRIYANSHU RAWAT. ALL RIGHTS RESERVED.
          </p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition-colors font-bold"
          >
            BACK TO TOP
            <div className="w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-violet-400 group-hover:bg-violet-500/10 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-violet-400 group-hover:-translate-y-0.5 transition-all" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
