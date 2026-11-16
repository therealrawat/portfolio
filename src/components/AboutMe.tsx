import { motion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import Lanyard from './reactbits/Lanyard';

interface StoryChapter {
  id: string;
  badge: string;
  title: string;
  image: string;
  imageAlt: string;
  content: string[];
}

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'roots',
    badge: '01 / Origin',
    title: 'Tinkering & Competitive Roots',
    image: '/doodle-roots.jpg',
    imageAlt: 'Tinkering with chess and retro tactical PC games doodle',
    content: [
      'Growing up in Dehradun, my curiosity always leaned toward two things: understanding how systems work under the hood and figuring out how to outthink an opponent. Whether I was breaking down mechanics in tactical PC games or obsessing over strategy in competitive chess, I’ve always loved the intersection of quick execution and long-term planning.',
      'That mindset naturally pulled me toward technology—not just as a user, but as someone who wanted to build the board, set the rules, and see what happens when real people play.'
    ]
  },
  {
    id: 'craft',
    badge: '02 / Foundation',
    title: 'Learning the Craft',
    image: '/doodle-craft.jpg',
    imageAlt: 'Studying computer science and backend engineering doodle',
    content: [
      'My path into tech started with a Bachelor of Science, followed by a Master of Computer Applications (MCA) from Uttaranchal University. Early internships at places like RITES Ltd. got my hands dirty with backend systems, databases, and server-side architecture.',
      "I quickly realized that code wasn't just about making a compiler happy—it was the fastest way to turn a rough business idea into something tangible that real customers could click, test, and pay for."
    ]
  },
  {
    id: 'engineering',
    badge: '03 / Scale',
    title: 'Engineering at Scale',
    image: '/doodle-engineering.jpg',
    imageAlt: 'Engineering scalable enterprise systems and cloud architecture doodle',
    content: [
      'After graduating, I jumped into professional software engineering—first at smartData Enterprises in Dehradun, and later in Chandigarh as a Full-Stack Software Engineer at TestingXperts. Working across enterprise systems—modernizing remittance platforms, building internal browser tools, and architecting AI-driven reporting engines—gave me a grounded, end-to-end view of how reliable software gets shipped.',
      'I’ve spent plenty of time in the weeds with .NET, React, Angular, SQL, and AI workflows. Having that deep engineering foundation gives my clients a massive advantage: I know what’s actually feasible, how to avoid expensive technical debt, and how to take an idea from a napkin sketch to production without bloated timelines.'
    ]
  },
  {
    id: 'product',
    badge: '04 / Philosophy',
    title: 'A Product Manager Who Happens to Code',
    image: '/doodle-product.jpg',
    imageAlt: 'Product management whiteboard wireframes and lightbulb idea doodle',
    content: [
      'While engineering is my profession, Product Management is what I genuinely love. Building my own side projects taught me a hard lesson that pure coding never does: building the thing is the easy part; building the right thing is what makes money.',
      "Most developers will blindly build whatever spec sheet you hand them. I don't. In my off-hours, I work with founders and clients to pressure-test their ideas first—stripping away the fluff, identifying the core user problem, and shipping lean, high-impact web apps fast. When I'm not building for clients, I write about what I learn and post the odd video on YouTube."
    ]
  },
  {
    id: 'today',
    badge: '05 / Present',
    title: '…and that brings us to today!',
    image: '/doodle-today.jpg',
    imageAlt: 'Modern creator launching products and collaborating with founders doodle',
    content: [
      'These days, I bridge the gap between product strategy and full-stack execution. Whether you have a rough idea that needs an MVP, an existing product that feels clunky, or a business process crying out for a custom web app, I can help you scope it, design it, and build it.'
    ]
  }
];

export default function AboutMe() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] text-black relative selection:bg-black/15 selection:text-black">
      {/* Ambient Gradient Glows (Soft studio vignette) */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-black/[0.02] blur-[160px] rounded-full z-0" />
      <div className="pointer-events-none absolute bottom-20 right-10 w-[600px] h-[600px] bg-neutral-900/[0.015] blur-[180px] rounded-full z-0" />

      {/* Full-screen 3D Lanyard Hero hanging directly from the very top of the screen */}
      <div className="w-full h-screen relative z-10">
        <Lanyard
          frontImage="/card-front.jpeg"
          backImage="/card-back.png"
          strapImage="/strap.png"
          cardColor="#ffffff"
          finish="matte"
          metal="silver"
          orientation="portrait"
          size={0.65}
          strapLength={0.32}
          breeze={0.35}
          elasticity={0.45}
          damping={0.45}
          interactive={true}
          intro={true}
        />
      </div>

      {/* Quick Version Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 md:px-16 pt-12 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-neutral-400 font-bold">
            <span className="w-10 h-[1px] bg-neutral-300" />
            The quick version
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-neutral-950 tracking-tight leading-[1.05]">
            Hey, I'm Priyanshu.
          </h2>

          <div className="space-y-6 text-lg sm:text-xl md:text-2xl text-neutral-600 font-light leading-relaxed">
            <p>
              I've been fascinated by how things work on the web for as long as I can remember. These days I'm a <span className="text-neutral-900 font-normal">Senior Software Engineer</span>  at TestingXperts. After hours, I partner with founders and businesses to design, validate, and build web apps from scratch.
            </p>
            <p>
              In my spare time I build small things online, write, and help people pressure-test their product ideas before they spend a year building the wrong thing. I also post the odd thing on{' '}
              <a
                href="https://youtube.com/@lowwhiskey"
                target="_blank"
                rel="noopener noreferrer"
                className="group/yt inline-flex items-center gap-0.5 text-neutral-950 font-normal underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 hover:text-black transition-all"
              >
                <span>You Tube</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/yt:translate-x-0.5 group-hover/yt:-translate-y-0.5" />
              </a>
              .
            </p>
          </div>
        </motion.div>
      </section>

      {/* The Long Version Storyboard Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10 md:px-16 pt-8 pb-36">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 sm:mb-28 border-t border-neutral-200/80 pt-16 sm:pt-20"
        >
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-neutral-400 font-bold mb-4">
            <span className="w-10 h-[1px] bg-neutral-300" />
            The Long Version
          </div>
          {/* <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-950 tracking-tight">
            The Journey, The Craft &amp; The Mindset
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-500 font-light max-w-2xl leading-relaxed">
            How competitive curiosity, enterprise-scale engineering, and side projects shaped a product-first approach to building software.
          </p> */}
        </motion.div>

        {/* Storyboard Chapters */}
        <div className="space-y-24 sm:space-y-36 lg:space-y-44">
          {STORY_CHAPTERS.map((chapter, index) => {
            const isEven = index % 2 === 1;

            return (
              <motion.article
                key={chapter.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-center"
              >
                {/* Text Column */}
                <div className={`space-y-5 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="inline-flex items-center gap-2 text-[10px] uppercase font-mono tracking-widest text-neutral-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-[#b497cf]" />
                    {chapter.badge}
                  </div>

                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-950 tracking-tight leading-[1.15]">
                    {chapter.title}
                  </h3>

                  <div className="space-y-4 text-base sm:text-lg text-neutral-600 font-light leading-relaxed">
                    {chapter.content.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}

                    {/* Special links & CTA for Chapter 5 */}
                    {chapter.id === 'today' && (
                      <>
                        <p className="pt-2">
                          You can check out some of my{' '}
                          <button
                            onClick={() => navigateTo('projects')}
                            className="text-neutral-950 font-normal underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-all cursor-pointer"
                          >
                            past work here
                          </button>
                          , read my thoughts on building products, or connect with me on{' '}
                          <a
                            href="https://linkedin.com/in/rawat-priyanshu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-neutral-950 font-normal underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-900 transition-all"
                          >
                            <span>LinkedIn</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                          . Have an idea you want to bring to life?{' '}
                          <a
                            href="mailto:priyanshurawat.business@gmail.com"
                            className="text-neutral-950 font-medium underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-950 transition-all"
                          >
                            Let&apos;s talk and get it built
                          </a>
                          .
                        </p>

                        <div className="pt-4 flex flex-wrap items-center gap-3">
                          <a
                            href="mailto:priyanshurawat.business@gmail.com"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold transition-all shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.18)] hover:-translate-y-0.5 cursor-pointer"
                          >
                            <Mail className="w-4 h-4" />
                            <span>Let&apos;s Talk &amp; Build</span>
                          </a>

                          <button
                            onClick={() => navigateTo('projects')}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-neutral-300/80 hover:border-neutral-900 bg-white/80 hover:bg-white text-neutral-900 text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow cursor-pointer"
                          >
                            <span>Explore Projects</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Doodle Column */}
                <div className={`${isEven ? 'md:order-1' : 'md:order-2'}`}>
                  <div className="relative group mx-auto max-w-[480px]">
                    {/* Soft background glow matching the brand purple tone */}
                    <div className="absolute -inset-2 bg-gradient-to-tr from-[#b497cf]/15 via-transparent to-neutral-200/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                    {/* Doodle Card Container */}
                    <div className="relative rounded-3xl overflow-hidden bg-white border border-neutral-200/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-4 sm:p-6 transition-all duration-500 group-hover:border-neutral-300 group-hover:shadow-[0_16px_40px_rgb(0,0,0,0.07)]">
                      <img
                        src={chapter.image}
                        alt={chapter.imageAlt}
                        loading="lazy"
                        className="w-full aspect-square object-contain rounded-2xl transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
