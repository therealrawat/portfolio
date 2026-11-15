import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import SpotlightCard from './reactbits/SpotlightCard';
import DecryptedText from './reactbits/DecryptedText';
import ProjectImageStack from './reactbits/ProjectImageStack';
import { navigateTo } from '../utils/navigation';

interface Project {
  title: string;
  description: string;
  liveUrl: string;
  images: [string, string, string]; // [backLeft, frontCenter, backRight]
}

const projects: Project[] = [
  {
    title: 'Immoral Combat',
    description: '3D WebGL stress-relief arcade fighter featuring real-time physics, comical dialogue bubbles, dynamic health bars, and instant K.O. combat mechanics.',
    liveUrl: 'https://immoral-combat.netlify.app/',
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
      'https://pub-fb31e6086d984a29beb2f72346b229ec.r2.dev/images/ic1.png',
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'SyncScripts',
    description: 'Meeting intelligence pipeline transforming post-call transcripts into structured actionable insights with Gemini 1.5 Flash in a zero-retention privacy architecture.',
    liveUrl: 'https://syncscripts.netlify.app/',
    images: [
      'https://pub-fb31e6086d984a29beb2f72346b229ec.r2.dev/images/ss1.png',
      'https://pub-fb31e6086d984a29beb2f72346b229ec.r2.dev/images/ss3.png',
      'https://pub-fb31e6086d984a29beb2f72346b229ec.r2.dev/images/ss2.png',
    ],
  },
  {
    title: 'EchoMap',
    description: 'Diagnostic AI speech recognition engine identifying subtle phonetic anomalies in English pronunciation with real-time spectrogram analysis.',
    liveUrl: 'https://echo-map.netlify.app/',
    images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    title: 'AI Agent Orchestrator',
    description: 'Multi-agent autonomous infrastructure eliminating operational debt by resolving manual incident runs and enterprise support tickets.',
    liveUrl: 'https://syncscripts.netlify.app/',
    images: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop',
    ],
  },
  {
    title: '4Her Health Platform',
    description: 'Predictive wellness analytics with strict client-side data dignity, hormonal cycle forecasting algorithms, and encrypted personal logs.',
    liveUrl: 'https://the4her.netlify.app/',
    images: [
      'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=800&auto=format&fit=crop',
    ],
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-32 px-6 md:px-20 relative bg-[#070709]">
      <div className="max-w-7xl mx-auto">
        {/* Header & 'More Projects' Button */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-4 font-bold">
              <span className="w-12 h-[1px] bg-neutral-800" />
              Engineering Portfolio
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tighter">
              <DecryptedText
                text="SELECTED PROJECTS."
                speed={35}
                maxIterations={8}
                encryptedClassName="text-white/60"
              />
            </h2>
          </div>

          {/* More Projects Button */}
          <button
            onClick={() => navigateTo('projects')}
            className="self-start md:self-end group inline-flex items-center gap-2.5 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 hover:bg-neutral-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] shrink-0 cursor-pointer"
          >
            <span>More Projects</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* 5-Card Grid: Top Row = 2 Wide Cards, Bottom Row = 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {projects.map((project, index) => {
            // First 2 cards: span 3 columns each (half-width top row)
            // Next 3 cards: span 2 columns each (one-third width bottom row)
            const colSpanClass = index < 2 ? 'lg:col-span-3' : 'lg:col-span-2';

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                key={project.title}
                className={`col-span-1 md:col-span-1 ${colSpanClass} h-full`}
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full group"
                >
                  <SpotlightCard
                    spotlightColor="rgba(255, 255, 255, 0.12)"
                    spotlightSize={340}
                    className="p-5 sm:p-6 flex flex-col justify-between h-full cursor-pointer hover:border-white/40"
                  >
                    <div>
                      {/* Top Preview Stage: 3 Layered Images (2 in background, 1 centered in front) */}
                      <div className="mb-5">
                        <ProjectImageStack images={project.images} title={project.title} />
                      </div>

                      {/* Title & Diagonal Arrow */}
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-white transition-colors">
                          {project.title}
                        </h3>
                        <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                      </div>

                      {/* Clean 2-Line Description */}
                      <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed font-light">
                        {project.description}
                      </p>
                    </div>
                  </SpotlightCard>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
