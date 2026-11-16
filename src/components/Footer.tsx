import { motion } from 'framer-motion';
import { Linkedin, Github, Mail, ArrowUp, Instagram } from 'lucide-react';
import DecryptedText from './reactbits/DecryptedText';

interface FooterProps {
  theme?: 'dark' | 'light';
}

export default function Footer({ theme = 'dark' }: FooterProps) {
  const isLight = theme === 'light';
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className={`relative py-24 px-8 md:px-20 transition-colors duration-500 ${
        isLight ? 'bg-[#f5f5f7] border-t border-black/[0.08]' : 'bg-[#070709]'
      }`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-16 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="max-w-md"
          >
            <div
              className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] mb-6 font-bold ${
                isLight ? 'text-neutral-500' : 'text-neutral-400'
              }`}
            >
              <span className={`w-12 h-[1px] ${isLight ? 'bg-neutral-300' : 'bg-neutral-800'}`} />
              Get In Touch
            </div>
            <h3
              className={`text-4xl md:text-6xl font-black mb-8 tracking-tighter ${
                isLight ? 'text-black' : 'text-white'
              }`}
            >
              <DecryptedText
                text="LET'S BUILD TOGETHER."
                speed={40}
                maxIterations={8}
                encryptedClassName={isLight ? 'text-black/60' : 'text-white/60'}
              />
            </h3>
            <p
              className={`text-lg leading-relaxed font-light ${
                isLight ? 'text-neutral-600' : 'text-neutral-400'
              }`}
            >
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
                className={`group flex items-center justify-between p-5 rounded-xl border transition-all duration-300 ${
                  isLight
                    ? 'border-black/10 bg-black/[0.02] hover:border-black/40 hover:bg-black/[0.05] hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/50 hover:bg-white/[0.05] hover:shadow-[0_0_25px_rgba(255,255,255,0.18)]'
                }`}
              >
                <div className="flex items-center gap-4">
                  <social.icon
                    className={`w-5 h-5 transition-colors ${
                      isLight ? 'text-neutral-500 group-hover:text-black' : 'text-neutral-400 group-hover:text-white'
                    }`}
                  />
                  <span
                    className={`text-[11px] uppercase tracking-[0.3em] transition-colors font-bold ${
                      isLight ? 'text-neutral-800 group-hover:text-black' : 'text-neutral-300 group-hover:text-white'
                    }`}
                  >
                    {social.label}
                  </span>
                </div>
                <ArrowUp
                  className={`w-4 h-4 rotate-45 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
                    isLight ? 'text-neutral-400 group-hover:text-black' : 'text-neutral-500 group-hover:text-white'
                  }`}
                />
              </a>
            ))}
          </motion.div>
        </div>

        <div
          className={`flex flex-col md:flex-row items-center justify-between gap-8 pt-10 border-t ${
            isLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
          }`}
        >
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 font-bold">
            © {currentYear} PRIYANSHU RAWAT. ALL RIGHTS RESERVED.
          </p>

          <button
            onClick={scrollToTop}
            className={`group flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] transition-colors font-bold ${
              isLight ? 'text-neutral-600 hover:text-black' : 'text-neutral-400 hover:text-white'
            }`}
          >
            BACK TO TOP
            <div
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-colors ${
                isLight
                  ? 'border-black/10 group-hover:border-black/30 group-hover:bg-black/[0.05]'
                  : 'border-white/10 group-hover:border-white/40 group-hover:bg-white/[0.08]'
              }`}
            >
              <ArrowUp
                className={`w-3.5 h-3.5 transition-all group-hover:-translate-y-0.5 ${
                  isLight ? 'text-neutral-600 group-hover:text-black' : 'text-neutral-400 group-hover:text-white'
                }`}
              />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
