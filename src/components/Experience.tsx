import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

const TestingXpertsLogo = () => (
  <svg className="w-full h-full p-2 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 58 52" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0,17.24l4.26-3.39c5.34-4.11,14.06-8.74,20.6-10.62,1-.29,1.96-.55,3.04-.84,5.34-1.43,12.23-1.91,17.55-.25,6.94,2.16,9.34,7.9,7.79,14.25-.98,4.02-2.84,6.94-5.11,10.17l-3.53,4.19c-1.05,1.12-3.41,3.46-4.41,4.25-.24.19-.29.17-.53.39-.39.34-.69.56-1.07.9-.24.22-.29.22-.52.4-.24.17-.35.29-.59.46-.31.24-.77.69-1.18.78-.1-.41-.71-1.26-.95-1.67-.3-.53-.63-1.14-.97-1.66-.69-1.07-1.25-2.38-1.89-3.5l-6.94,3.54c-.44.21-.59.39-1.04.48.1,1.08,3.05,4.3,4.02,5.29.32.31.43.51.77.84.31.28.59.49.81.81-.74.47-1.5.85-2.3,1.3-.82.45-1.55.79-2.42,1.2-3.36,1.59-6.72,3.06-10.44,4.06l-6.02,1.39c2.99.65,10.59-.37,13.6-1.2,3.25-.88,6.73-1.98,9.71-3.39.4-.18.86-.46,1.31-.56,1.97,1.24,6.16,4.23,8.49,4.78,1.03.23,6.02,1.48,6.62,1.5l-.36-.23c-1.58-.85-1.77-.98-3.18-2.15-.28-.22-.38-.24-.66-.49-1.09-.99-5.2-5.52-5.44-6.53l2.53-1.64c.44-.31.78-.54,1.22-.86,1.42-1.04,4.74-3.8,5.73-4.91,3.47-3.91,4.45-4.71,7.13-9.74,2.89-5.43,3.49-12.58-.32-17.64C50.67.74,41.92-.41,34.28.11c-4.74.34-9.67,1.81-13.9,3.38l-2.21.94c-4.53,1.99-8.85,4.51-12.66,7.56-.24.2-.3.29-.57.49-.31.23-.36.26-.63.52l-1.13.96c-.51.46-3.06,2.85-3.19,3.28h0Z"
      fill="#fff"
      fillRule="evenodd"
    />
    <path
      d="M10.71,17.46h10l-7,22.41c-.19.6-.33,1.05-.52,1.63-.14.44-.45,1.22-.46,1.69h8.09l4.61-14.34c.42-1.41,3.58-10.78,3.59-11.39h9.05c.37,0,1.3-1.89,1.51-2.28.25-.47.43-.69.68-1.15.18-.34.59-.98.67-1.27H11.9c-.19.77-.4,1.52-.61,2.32-.15.54-.57,1.79-.58,2.37Z"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const RitesLogo = () => (
  <svg className="w-full h-full p-4 opacity-50 group-hover:opacity-100 transition-opacity" viewBox="0 0 1100 1000" xmlns="http://www.w3.org/2000/svg">
    <path d="
      M 801 84.367 C 771.243 91.289, 748.601 109.370, 735.990 136.279 C 724.816 160.125, 724.777 188.791, 735.885 212.496 C 745.814 233.683, 760.322 248.208, 781.381 258.045 C 810.414 271.606, 846.057 268.267, 872.500 249.508 C 880.901 243.548, 892.949 230.619, 897.958 222.187 C 903.420 212.993, 907.411 202.625, 909.545 192.081 C 911.838 180.757, 911.122 160.739, 908.041 150 C 899.165 119.062, 875.086 95.031, 843.826 85.912 C 834.672 83.242, 809.710 82.341, 801 84.367
      M 736 297.086 C 534.605 298.031, 524.438 298.201, 511.849 300.833 C 465.578 310.508, 428.245 337.337, 403.227 378.890 C 393.513 395.026, 387.138 408.550, 303.708 590 C 261.097 682.675, 216.686 779.200, 205.017 804.500 C 193.348 829.800, 183.568 851.288, 183.284 852.250 C 182.794 853.908, 187.758 854, 277.729 854 L 372.691 854 403.526 789.750 C 431.050 732.398, 486.195 618.096, 523.053 542 C 530.378 526.875, 538.201 511.412, 540.436 507.639 C 549.033 493.124, 563.358 480.707, 578.035 475.047 C 594.202 468.812, 588.781 469.004, 750.381 468.964 C 831.296 468.945, 901.775 468.545, 907 468.076 C 929.952 466.017, 948.239 458.063, 964.072 443.251 C 976.979 431.178, 987.850 412.570, 1000.914 380.186 C 1008.112 362.346, 1030.110 297.444, 1029.251 296.584 C 1028.579 295.912, 961.737 296.027, 736 297.086
      M 598.069 492.088 C 589.979 493.675, 581.190 497.077, 575.310 500.898 C 564.323 508.037, 562.131 511.375, 543.475 549.385 C 509.044 619.532, 449.010 745.135, 412.524 823.358 C 399.818 850.600, 397.002 857.404, 398.116 858.179 C 398.992 858.788, 433.822 858.952, 493 858.624 C 568.421 858.207, 586.633 857.855, 587.186 856.804 C 587.564 856.087, 620.598 788, 660.595 705.500 C 700.592 623, 740.221 541.371, 748.659 524.102 C 757.096 506.833, 764 492.321, 764 491.852 C 764 490.732, 603.821 490.960, 598.069 492.088"
      fill="#fff"
      fillRule="evenodd"
    />
  </svg>
);

const phases = [
  {
    icon: TestingXpertsLogo,
    title: 'Software Engineer',
    company: 'TestingXperts Pvt Ltd',
    date: 'Oct 2024 - Present',
    location: 'Chandigarh, IN',
    description: 'Architecting "DB Genius," an AI-driven tool reducing data-dependency by 60% through automated SQL generation. Driving product strategy and enterprise client success.',
    number: '01',
    tags: ['AI Orchestration', 'FastAPI', 'Product Strategy', 'SQL Server']
  },
  {
    icon: 'https://dkk4qeqny48s0.cloudfront.net/wp-content/uploads/2025/02/logo-updated.png',
    title: 'Associate Software Engineer',
    company: 'smartData Enterprises',
    date: 'March 2023 - Oct 2024',
    location: 'Dehradun, IN',
    description: 'Delivered high-performance backend modules for EHR systems, ensuring compliance and scalability. Refined system architecture for real-time data processing.',
    number: '02',
    tags: ['.NET Core', 'Microservices', 'EHR Systems', 'ReactJS']
  },
  {
    icon: RitesLogo,
    title: 'Intern',
    company: 'Rites Ltd',
    date: 'Aug 2022 - Jan 2023',
    location: 'Remote',
    description: 'Developed technical documentation and gained hands-on experience in professional software life cycles and system design.',
    number: '03',
    tags: ['System Design', 'Documentation']
  },
];

export default function Experience() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as any },
    },
  };

  return (
    <section id="experience" className="py-32 px-8 md:px-20 bg-black relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-neutral-500 mb-6 font-bold">
            <span className="w-12 h-[1px] bg-neutral-800" />
            Background
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
            PROFESSIONAL <br /> JOURNEY.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative max-w-5xl"
        >
          {/* Vertical Line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[px] bg-neutral-900 hidden md:block" />

          <div className="space-y-24">
            {phases.map((phase) => {
              const IconContent = phase.icon;
              const isUrl = typeof IconContent === 'string';

              return (
                <motion.div
                  key={phase.title + phase.number}
                  variants={itemVariants}
                  className="group relative flex flex-col md:flex-row gap-8 md:gap-20"
                >
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-neutral-900 pb-8">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 border border-neutral-800 shrink-0 overflow-hidden group-hover:border-white transition-colors duration-500 bg-black flex items-center justify-center grayscale">
                          {isUrl ? (
                            <img src={IconContent} alt={phase.company} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            <IconContent />
                          )}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-white group-hover:translate-x-1 transition-transform duration-500 uppercase tracking-tight">
                            {phase.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-black">{phase.company}</span>
                            <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                            <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-bold">{phase.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-neutral-500 font-black">
                        <Calendar className="w-3 h-3" />
                        {phase.date}
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-12">
                      <p className="text-neutral-500 text-lg leading-relaxed max-w-2xl">
                        {phase.description}
                      </p>

                      <div className="flex flex-wrap gap-x-6 gap-y-3 h-fit">
                        {phase.tags.map(tag => (
                          <div key={tag} className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-neutral-700 font-black group-hover:text-white transition-colors">
                            <div className="w-1 h-1 bg-neutral-800 group-hover:bg-white rounded-full" />
                            {tag}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block absolute -right-12 top-0 text-[100px] font-black text-white/[0.01] transition-colors group-hover:text-white/[0.03] select-none pointer-events-none">
                    {phase.number}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
