import { motion } from 'framer-motion';
import DecryptedText from './reactbits/DecryptedText';
import SpotlightCard from './reactbits/SpotlightCard';

/* ─── Real Testimonials Only ─────────────────────────────────────────────── */

interface Testimonial {
  quote: string;
  name: string;
  title: string;
  initials: string;
}

const realTestimonials: Testimonial[] = [
  {
    quote:
      'Priyanshu is very transparent with his communication. He has been incredibly accommodating and responsive to our constant evolving needs.',
    name: 'Martine Paul',
    title: 'Co-Founder at TechVenture',
    initials: 'MP',
  },
  {
    quote:
      'Priyanshu consistently ensures accuracy and reliability, driving significant project impact through both individual contributions and proactive peer reviews.',
    name: 'Manas K Biswas',
    title: 'Sr. Technical Architect at TestingXperts',
    initials: 'MB',
  },
  {
    quote:
      'Sincere, and a total powerhouse. PR is one of those rare developers who treats a side project with the same rigor as a Tier-1 product. A great guy to work with.',
    name: 'Rahul B',
    title: 'APM at AmEx',
    initials: 'RB',
  },
];

/* ─── Single Testimonial Card ────────────────────────────────────────────── */

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <SpotlightCard
      spotlightColor="rgba(139, 92, 246, 0.18)"
      spotlightSize={280}
      className="p-6 md:p-7 flex flex-col justify-between group cursor-default transition-all duration-300"
    >
      {/* Quote Body */}
      <p className="text-sm md:text-[15px] font-normal text-neutral-300 leading-relaxed mb-6 group-hover:text-white transition-colors">
        &ldquo;{item.quote}&rdquo;
      </p>

      {/* Author Row */}
      <div className="flex items-center gap-3.5 pt-1">
        {/* Avatar Monogram */}
        <div className="w-10 h-10 rounded-full bg-violet-500/10 border border-violet-500/30 flex items-center justify-center font-mono font-bold text-xs text-violet-300 shrink-0">
          {item.initials}
        </div>

        {/* Name & Title */}
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white tracking-tight truncate group-hover:text-violet-200 transition-colors">
            {item.name}
          </span>
          <span className="text-xs text-neutral-400 truncate">
            {item.title}
          </span>
        </div>
      </div>
    </SpotlightCard>
  );
}

/* ─── Main Testimonials Component ────────────────────────────────────────── */

export default function Testimonials() {
  // Stagger order between columns so different testimonials lead each side
  const col1 = [realTestimonials[0], realTestimonials[1], realTestimonials[2]];
  const col2 = [realTestimonials[2], realTestimonials[0], realTestimonials[1]];

  // Duplicate for seamless 60fps infinite marquee loop
  const col1Items = [...col1, ...col1];
  const col2Items = [...col2, ...col2];

  return (
    <section id="testimonials" className="py-32 px-6 md:px-16 bg-[#070709] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header (Previous Version) */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-400 mb-4 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Social Proof
            <span className="w-12 h-[1px] bg-neutral-800" />
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            <DecryptedText text="TESTIMONIALS." speed={40} maxIterations={8} encryptedClassName="text-violet-400" />
          </h2>
        </motion.div>

        {/* 2-Column Marquee Stage (Column 1 flows Up, Column 2 flows Down) */}
        <div className="relative h-[580px] md:h-[620px] overflow-hidden">
          {/* Top Fade Gradient Mask */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 md:h-36 bg-gradient-to-b from-[#070709] via-[#070709]/85 to-transparent z-20" />

          {/* Bottom Fade Gradient Mask */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 md:h-36 bg-gradient-to-t from-[#070709] via-[#070709]/85 to-transparent z-20" />

          {/* Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full max-w-5xl mx-auto">
            {/* Column 1: Flows UP */}
            <div className="overflow-hidden relative h-full">
              <div className="flex flex-col gap-5 animate-marquee-up pause-marquee">
                {col1Items.map((item, idx) => (
                  <TestimonialCard key={`col1-${item.name}-${idx}`} item={item} />
                ))}
              </div>
            </div>

            {/* Column 2: Flows DOWN */}
            <div className="overflow-hidden relative h-full hidden md:block">
              <div className="flex flex-col gap-5 animate-marquee-down pause-marquee">
                {col2Items.map((item, idx) => (
                  <TestimonialCard key={`col2-${item.name}-${idx}`} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
