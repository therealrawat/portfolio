import { motion } from 'framer-motion';
import { ExternalLink, FileText } from 'lucide-react';

const projects = [

  {
    title: 'SyncScripts',
    problem: 'Professional teams, in service-based and technical consulting firms, face Information Overload post-meeting.',
    tags: ['Gemini AI', 'LLM Integration', 'React', 'TypeScript'],
    liveUrl: 'https://syncscripts.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1xxIGKOABNoZG3CJZFtJGcnBue6ZnAqBX/view?usp=drive_link',
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    title: '4Her - Menstrual Health Application',
    problem: 'Wellness application for women that empowers them to track reproductive health with dignity.',
    tags: ['MongoDb', 'Express', 'Node.js', 'React'],
    liveUrl: 'https://the4her.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/129ssK2BYRBFnUTGMo6yYc9sb5awPVW-s/view?usp=drive_link',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    title: 'EchoMap - English Diagnostic Utility',
    problem: 'Many English learners possess proficiency but lack the awareness to identify subtle linguistic gaps that hinder professional growth.',
    tags: ['Gemini AI', 'TypeScript', 'Speech Recognition'],
    liveUrl: 'https://echo-map.netlify.app/',
    caseStudyUrl: 'https://drive.google.com/file/d/1qgzbImMw64QSZPnS2o3smqBu3XvGHzpH/view?usp=drive_link',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    title: 'Code Review Automation Engine',
    problem: 'Senior engineers spend 30% of their time on repetitive code review tasks.',
    tags: ['AI/ML', 'Python', 'FastAPI', 'Docker'],
    liveUrl: '#',
    caseStudyUrl: '#',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Customer Feedback Loop System',
    problem: 'Product teams lack systematic way to close the loop between feedback and features.',
    tags: ['React', 'Supabase', 'TypeScript', 'Analytics'],
    liveUrl: '#',
    caseStudyUrl: '#',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    title: 'The Portfolio',
    problem: 'Personal portfolio to showcase projects and case studies effectively.',
    tags: ['OpenAI', 'React', 'Python', 'Analytics'],
    liveUrl: 'https://www.priyanshurawat.co.in/',
    caseStudyUrl: 'https://github.com/therealrawat',
    gradient: 'from-green-500 to-emerald-500',
  },
];

export default function Projects() {
  return (
    <section id="projects" className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            End-to-end case studies showcasing the journey from problem space to shipped product
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl overflow-hidden hover:border-slate-700/50 transition-all duration-300"
            >
              <div className={`absolute top-0 left-0 right-0 h-1 bg-linear-to-r ${project.gradient}`} />

              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-indigo-400 transition-colors">
                  {project.title}
                </h3>

                <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                  {project.problem}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-full text-xs text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 hover:border-indigo-500/30 text-indigo-400 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Live
                  </a>
                  <a
                    href={project.caseStudyUrl}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 rounded-lg transition-all duration-300 text-sm font-medium"
                  >
                    <FileText className="w-4 h-4" />
                    PRD
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
