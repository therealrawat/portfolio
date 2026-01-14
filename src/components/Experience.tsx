import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const TestingXpertsLogo = () => (
  <svg className="w-full h-full p-2" viewBox="0 0 58 52" xmlns="http://www.w3.org/2000/svg">
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

const phases = [
  {
    icon: TestingXpertsLogo,
    title: 'Software Engineer',
    company: 'TestingXperts Pvt Ltd',
    date: 'Oct 2024 - Present',
    location: 'Chandigarh, IN',
    description: 'Architected "DB Genius," an AI-driven tool reducing data-dependency by 60% through automated SQL generation. Spearheaded product demos for 5+ multinational clients, driving enterprise deals.',
    number: '01',
    tags: ['AI Orchestration', 'FastAPI', 'Product Strategy', 'SQL Server', '.NET Core', 'React', 'XUnit' ]
  },
  {
    icon: 'https://media.licdn.com/dms/image/v2/D560BAQGbBTOC2UdwXg/company-logo_200_200/company-logo_200_200/0/1703668177911/smart_data_enterprises_logo?e=1770249600&v=beta&t=TazlPNfK9Amk-uaY_iL0KH4MnZvXN4NSrbt10isQXDI',
    title: 'Associate Software Engineer',
    company: 'smartData Enterprises',
    date: 'March 2023 - Oct 2024',
    location: 'Dehradun, IN',
    description: 'Delivered high-performance backend modules for live EHR projects, ensuring DRUMMOND certification compliance. Improved response times by refactoring core .NET services and integrating ReactJS frontends.',
    number: '02',
    tags: ['.NET Core', 'Microservices', 'EHR Systems', 'Angular', 'SQL Server', 'Agile']
  },
  {
    icon: 'https://media.licdn.com/dms/image/v2/D560BAQGbbTH_anzOLg/img-crop_100/B56Zbo192cH4AU-/0/1747663184024?e=1770249600&v=beta&t=YQTs8_3EbrafGCmn2ZcZcnU6oN9_CbY9mTFu9hzo2TE',
    title: 'Intern',
    company: 'Rites Ltd',
    date: 'Aug 2022 - Jan 2023',
    location: 'Remote',
    description: 'Gained hands-on experience and honed technical skills in system design and documentation within a professional corporate setting.',
    number: '03',
    tags: ['ASP.NET', 'MySQL']
  },
  {
    icon: 'https://media.licdn.com/dms/image/v2/C510BAQHLrGmLXEa3iw/company-logo_200_200/company-logo_200_200/0/1630582770029/oceana_tech_536b74177_logo?e=1770249600&v=beta&t=XgrTkJ8WIbwm5mXx4RqD1_Q3KbBbM9fwLljxXD-GECU',
    title: 'Summer Intern',
    company: 'Oceana Tech',
    date: 'June 2022',
    location: 'Dehradun, IN',
    description: 'Developed Java and OOP skills through hands-on projects with guidance from experienced mentor. Gained foundational knowledge in SDLC and team collaboration.',
    number: '04',
    tags: ['Java']
  },
];

export default function Experience() {
  return (
    <section id="experience" className="py-24 px-6 relative bg-slate-950">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Professional Experience
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Technical Software Engineer with 3+ years of experience bridging technical complexity and business value through AI solutions.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-slate-800 to-transparent hidden md:block" />

          <div className="space-y-12">
            {phases.map((phase, index) => {
              const IconContent = phase.icon;
              // Check if the icon is a string (URL) or a React Component
              const isUrl = typeof IconContent === 'string';

              return (
                <motion.div
                  key={phase.title + index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-start gap-0 md:gap-8"
                >
                  {/* Desktop Icon Container */}
                  <div className="hidden md:flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl shrink-0 z-10 shadow-xl overflow-hidden shadow-indigo-500/20 border border-slate-800/50">
                    {isUrl ? (
                      <img src={IconContent} alt={phase.company} className="w-full h-full object-cover" />
                    ) : (
                      // @ts-ignore - Handle Lucide vs Custom Component
                      <IconContent className="w-8 h-8 text-white" />
                    )}
                  </div>

                  {/* Experience Card */}
                  <div className="flex-1 bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-3xl p-6 md:p-8 hover:border-indigo-500/30 transition-all duration-300 group relative">
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {/* Mobile Icon */}
                          <div className="md:hidden flex items-center justify-center w-12 h-12 bg-indigo-500 rounded-xl shrink-0 overflow-hidden">
                            {isUrl ? (
                              <img src={IconContent} alt={phase.company} className="w-full h-full object-cover" />
                            ) : (
                               // @ts-ignore
                              <IconContent className="w-6 h-6 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                              {phase.title}
                            </h3>
                            <p className="text-indigo-400 font-medium">{phase.company}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:items-end text-sm text-slate-500">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>{phase.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{phase.location}</span>
                          </div>
                        </div>
                      </div>

                      <p className="text-slate-400 leading-relaxed text-lg">
                        {phase.description}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                        {phase.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 text-xs font-medium bg-slate-800 text-indigo-300 rounded-full border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <span className="absolute top-4 right-8 text-7xl font-black text-white/[0.03] select-none pointer-events-none">
                      {phase.number}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}