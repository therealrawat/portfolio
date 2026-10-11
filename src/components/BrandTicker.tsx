import { motion } from 'framer-motion';

/* ─── Brand SVGs ────────────────────────────────────────────────────────── */

const IntermexLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12H20M20 12L14 6M20 12L14 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 6L16 12L10 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
  </svg>
);

const SSActivewearLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 3L2 9L12 21L22 9L18 3H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 21L7.5 9H16.5L12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
  </svg>
);

const PremiumHealthLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4V20M4 12H20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
  </svg>
);

const TestingXpertsLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 58 52" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0,17.24l4.26-3.39c5.34-4.11,14.06-8.74,20.6-10.62,1-.29,1.96-.55,3.04-.84,5.34-1.43,12.23-1.91,17.55-.25,6.94,2.16,9.34,7.9,7.79,14.25-.98,4.02-2.84,6.94-5.11,10.17l-3.53,4.19c-1.05,1.12-3.41,3.46-4.41,4.25-.24.19-.29.17-.53.39-.39.34-.69.56-1.07.9-.24.22-.29.22-.52.4-.24.17-.35.29-.59.46-.31.24-.77.69-1.18.78-.1-.41-.71-1.26-.95-1.67-.3-.53-.63-1.14-.97-1.66-.69-1.07-1.25-2.38-1.89-3.5l-6.94,3.54c-.44.21-.59.39-1.04.48.1,1.08,3.05,4.3,4.02,5.29.32.31.43.51.77.84.31.28.59.49.81.81-.74.47-1.5.85-2.3,1.3-.82.45-1.55.79-2.42,1.2-3.36,1.59-6.72,3.06-10.44,4.06l-6.02,1.39c2.99.65,10.59-.37,13.6-1.2,3.25-.88,6.73-1.98,9.71-3.39.4-.18.86-.46,1.31-.56,1.97,1.24,6.16,4.23,8.49,4.78,1.03.23,6.02,1.48,6.62,1.5l-.36-.23c-1.58-.85-1.77-.98-3.18-2.15-.28-.22-.38-.24-.66-.49-1.09-.99-5.2-5.52-5.44-6.53l2.53-1.64c.44-.31.78-.54,1.22-.86,1.42-1.04,4.74-3.8,5.73-4.91,3.47-3.91,4.45-4.71,7.13-9.74,2.89-5.43,3.49-12.58-.32-17.64C50.67.74,41.92-.41,34.28.11c-4.74.34-9.67,1.81-13.9,3.38l-2.21.94c-4.53,1.99-8.85,4.51-12.66,7.56-.24.2-.3.29-.57.49-.31.23-.36.26-.63.52l-1.13.96c-.51.46-3.06,2.85-3.19,3.28h0Z"
      fill="currentColor"
      fillRule="evenodd"
    />
    <path
      d="M10.71,17.46h10l-7,22.41c-.19.6-.33,1.05-.52,1.63-.14.44-.45,1.22-.46,1.69h8.09l4.61-14.34c.42-1.41,3.58-10.78,3.59-11.39h9.05c.37,0,1.3-1.89,1.51-2.28.25-.47.43-.69.68-1.15.18-.34.59-.98.67-1.27H11.9c-.19.77-.4,1.52-.61,2.32-.15.54-.57,1.79-.58,2.37Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

const SmartDataLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.6" />
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const RitesLogo = () => (
  <svg className="w-full h-full" viewBox="0 0 1100 1000" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M 801 84.367 C 771.243 91.289, 748.601 109.370, 735.990 136.279 C 724.816 160.125, 724.777 188.791, 735.885 212.496 C 745.814 233.683, 760.322 248.208, 781.381 258.045 C 810.414 271.606, 846.057 268.267, 872.500 249.508 C 880.901 243.548, 892.949 230.619, 897.958 222.187 C 903.420 212.993, 907.411 202.625, 909.545 192.081 C 911.838 180.757, 911.122 160.739, 908.041 150 C 899.165 119.062, 875.086 95.031, 843.826 85.912 C 834.672 83.242, 809.710 82.341, 801 84.367 M 736 297.086 C 534.605 298.031, 524.438 298.201, 511.849 300.833 C 465.578 310.508, 428.245 337.337, 403.227 378.890 C 393.513 395.026, 387.138 408.550, 303.708 590 C 261.097 682.675, 216.686 779.200, 205.017 804.500 C 193.348 829.800, 183.568 851.288, 183.284 852.250 C 182.794 853.908, 187.758 854, 277.729 854 L 372.691 854 403.526 789.750 C 431.050 732.398, 486.195 618.096, 523.053 542 C 530.378 526.875, 538.201 511.412, 540.436 507.639 C 549.033 493.124, 563.358 480.707, 578.035 475.047 C 594.202 468.812, 588.781 469.004, 750.381 468.964 C 831.296 468.945, 901.775 468.545, 907 468.076 C 929.952 466.017, 948.239 458.063, 964.072 443.251 C 976.979 431.178, 987.850 412.570, 1000.914 380.186 C 1008.112 362.346, 1030.110 297.444, 1029.251 296.584 C 1028.579 295.912, 961.737 296.027, 736 297.086 M 598.069 492.088 C 589.979 493.675, 581.190 497.077, 575.310 500.898 C 564.323 508.037, 562.131 511.375, 543.475 549.385 C 509.044 619.532, 449.010 745.135, 412.524 823.358 C 399.818 850.600, 397.002 857.404, 398.116 858.179 C 398.992 858.788, 433.822 858.952, 493 858.624 C 568.421 858.207, 586.633 857.855, 587.186 856.804 C 587.564 856.087, 620.598 788, 660.595 705.500 C 700.592 623, 740.221 541.371, 748.659 524.102 C 757.096 506.833, 764 492.321, 764 491.852 C 764 490.732, 603.821 490.960, 598.069 492.088"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

/* ─── Brands Data ───────────────────────────────────────────────────────── */

const brands = [
  {
    name: 'Intermex',
    role: 'Fintech & Remittance',
    type: 'Client Project',
    Icon: IntermexLogo,
  },
  {
    name: 'S&S Activewear',
    role: 'Logistics & Distribution',
    type: 'Client Project',
    Icon: SSActivewearLogo,
  },
  {
    name: 'Premium Health US',
    role: 'Healthcare Systems',
    type: 'Client Project',
    Icon: PremiumHealthLogo,
  },
  {
    name: 'TestingXperts',
    role: 'Digital Assurance & AI',
    type: 'Full-Time',
    Icon: TestingXpertsLogo,
  },
  {
    name: 'smartData Enterprises',
    role: 'Enterprise Tech & EHR',
    type: 'Full-Time',
    Icon: SmartDataLogo,
  },
  {
    name: 'RITES Ltd',
    role: 'Govt Infrastructure',
    type: 'Internship',
    Icon: RitesLogo,
  },
];

export default function BrandTicker() {
  // Triplicate array for smooth endless looping on all displays
  const marqueeItems = [...brands, ...brands, ...brands];

  return (
    <section className="py-14 bg-[#050505] border-y border-neutral-900/60 relative overflow-hidden select-none">
      {/* Header Label */}
      <div className="max-w-7xl mx-auto px-8 mb-8 text-center">
        <div className="flex items-center justify-center gap-4 text-[10px] uppercase tracking-[0.4em] text-neutral-500 font-bold">
          <span className="w-8 md:w-16 h-[1px] bg-neutral-800" />
          <span>Companies & Client Projects Contributed To</span>
          <span className="w-8 md:w-16 h-[1px] bg-neutral-800" />
        </div>
      </div>

      {/* Gradient Fades for Infinite Edge Blend */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none" />

      {/* Ticker Track */}
      <div className="flex overflow-hidden">
        <motion.div
          className="flex gap-6 md:gap-8 w-max items-center pr-6 md:pr-8"
          animate={{ x: ['0%', '-33.333%'] }}
          transition={{
            repeat: Infinity,
            ease: 'linear',
            duration: 32,
          }}
        >
          {marqueeItems.map((brand, idx) => {
            const Icon = brand.Icon;
            return (
              <div
                key={`${brand.name}-${idx}`}
                className="group flex items-center gap-4 px-6 py-3.5 rounded-full border border-neutral-900 bg-neutral-950/80 hover:border-neutral-700 hover:bg-neutral-900/60 transition-all duration-300 cursor-default shrink-0 shadow-lg shadow-black/40"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center p-2 group-hover:border-neutral-600 group-hover:bg-neutral-800 transition-colors">
                  <span className="w-full h-full text-neutral-400 group-hover:text-white transition-colors">
                    <Icon />
                  </span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-widest text-neutral-300 group-hover:text-white uppercase transition-colors">
                      {brand.name}
                    </span>
                    <span className="text-[8px] uppercase tracking-wider text-neutral-600 px-1.5 py-0.5 rounded border border-neutral-800/80 font-bold">
                      {brand.type}
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-500 group-hover:text-neutral-400 font-bold transition-colors">
                    {brand.role}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
