import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExperienceItem {
  company: string;
  role: string;
  location: string;
  period: string;
  bullets: string[];
  moreBullets?: string[];
}

const experiences: ExperienceItem[] = [
  {
    company: 'TestingXperts',
    role: 'Software Engineer',
    location: 'Chandigarh, IN',
    period: '2024 - Present',
    bullets: [
      'Driving end-to-end delivery of client-facing projects while building AI-powered internal products that shape organizational capability.',
      'Architected resilient, high-throughput microservices and integrated AI agent workflows for enterprise clients including Intermex, S&S Activewear, and Premium Health US, eliminating manual operational friction.',
    ],
    moreBullets: [
      'Spearheaded client demonstrations, technical discovery sessions, and PRD definitions with multinational stakeholders to align architectural roadmaps with business milestones.',
      'Built internal AI orchestration tooling that automated repetitive operational processes and accelerated cross-functional developer delivery cycles.',
      'Optimized data retrieval pathways and microservice query latencies across distributed environments, ensuring fault-tolerant production rollouts.',
    ],
  },
  {
    company: 'smartData Enterprises',
    role: 'Associate Software Engineer',
    location: 'Dehradun, IN',
    period: '2023 - 2024',
    bullets: [
      'Delivered high-performance backend modules for Electronic Health Record (EHR) systems, ensuring strict HIPAA compliance, scalability, and sub-100ms API response times.',
      'Refined distributed system architecture for real-time medical data processing and automated data validation pipelines across microservices.',
    ],
    moreBullets: [
      'Designed and consumed RESTful APIs with .NET Core, Entity Framework, and SQL Server, collaborating closely with cross-functional product and QA teams.',
      'Reduced complex medical query latency by 35% through query optimization, indexing strategies, and database connection pooling.',
      'Implemented role-based access control (RBAC) and audit logging for sensitive healthcare data records.',
    ],
  },
  {
    company: 'RITES Ltd',
    role: 'Engineering Intern',
    location: 'Gurugram, IN / Remote',
    period: '2022 - 2023',
    bullets: [
      'Developed technical documentation and gained hands-on experience in professional software life cycles, relational database modeling, and institutional systems.',
      'Assisted in designing relational database schemas and optimizing SQL queries for government transportation and infrastructure tracking workflows.',
    ],
    moreBullets: [
      'Implemented prototype modules in .NET and Razor Pages while adhering to strict government governance and quality assurance standards.',
      'Collaborated with senior engineers on requirement traceability matrices and integration testing for public sector transport workflows.',
    ],
  },
];

export default function Experience() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggleExpand = (index: number) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <section id="experience" className="py-28 md:py-36 px-6 sm:px-10 md:px-16 lg:px-20 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Sticky Column */}
          <div className="lg:col-span-4 lg:sticky lg:top-36 self-start">
            <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-medium tracking-tight text-white leading-[1.08]">
              My work<br />experience
            </h2>
          </div>

          {/* Right Timeline Column */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {experiences.map((exp, index) => {
                const isExpanded = !!expanded[index];
                return (
                  <div key={exp.company} className="flex gap-6 sm:gap-8 lg:gap-10 group">
                    {/* Timeline Node & Dashed Line */}
                    <div className="flex flex-col items-center shrink-0">
                      {/* Concentric Node Circle */}
                      <div className="w-[22px] h-[22px] rounded-full border-2 border-white/80 bg-[#070709] flex items-center justify-center shrink-0 mt-1.5 shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-110 group-hover:border-white">
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      </div>
                      {/* Vertical Dashed Line */}
                      <div className="w-0 flex-1 border-l border-dashed border-white/20 my-2.5" />
                    </div>

                    {/* Content */}
                    <div className="pb-16 sm:pb-20 flex-1 pt-0.5">
                      <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        {exp.company}
                      </h3>

                      <p className="text-xs sm:text-sm text-neutral-400 mt-2 mb-6 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <strong className="text-neutral-200 font-semibold">{exp.role}</strong>
                        <span className="text-neutral-500 select-none">•</span>
                        <span>{exp.location}</span>
                        <span className="text-neutral-500 select-none">•</span>
                        <span>{exp.period}</span>
                      </p>

                      <div className="space-y-4">
                        {exp.bullets.map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-start gap-3">
                            <span className="text-neutral-400 select-none mt-1 leading-none text-base">•</span>
                            <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-light">
                              {bullet}
                            </p>
                          </div>
                        ))}

                        {/* Expandable Bullets */}
                        <AnimatePresence initial={false}>
                          {isExpanded && exp.moreBullets && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden space-y-4"
                            >
                              {exp.moreBullets.map((bullet, bIdx) => (
                                <div key={`more-${bIdx}`} className="flex items-start gap-3">
                                  <span className="text-neutral-400 select-none mt-1 leading-none text-base">•</span>
                                  <p className="text-sm sm:text-[15px] text-neutral-300 leading-relaxed font-light">
                                    {bullet}
                                  </p>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Read more... / Hide Toggle */}
                        {exp.moreBullets && exp.moreBullets.length > 0 && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => toggleExpand(index)}
                              className="text-xs sm:text-sm text-neutral-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 font-normal select-none"
                            >
                              {isExpanded ? 'Hide' : 'Read more...'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
