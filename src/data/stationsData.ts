import { PORTFOLIO_CONTEXT } from './bio';

export interface StationData {
  id: string;
  name: string;
  category: 'spawn' | 'projects' | 'tech' | 'experience' | 'contact';
  position: [number, number, number]; // [x, y, z] in Three.js coordinates
  color: string;
  tagline: string;
  iconName: string;
  content: {
    title: string;
    subtitle: string;
    description: string;
    highlights?: string[];
    links?: { label: string; url: string; primary?: boolean }[];
    meta?: Record<string, string>;
  };
}

export const STATIONS: StationData[] = [
  {
    id: 'spawn',
    name: 'Command Core',
    category: 'spawn',
    position: [0, 0, 0],
    color: '#ffffff',
    tagline: 'Priyanshu Rawat — Product & Engineering Hub',
    iconName: 'Compass',
    content: {
      title: 'Priyanshu Rawat',
      subtitle: 'Software Engineer & Product Thinker • 4+ Years Experience',
      description:
        'Bridging the gap between complex engineering systems and strategic product growth. Architecting AI-powered platforms, resilient microservices, and high-impact enterprise solutions.',
      highlights: [
        'Currently at TestingXperts: Client-facing delivery & AI-powered internal products',
        'MCA Graduate with 8.93 CGPA',
        'Recommended by the Air Force Selection Board (AFSB) — disciplined, mission-oriented mindset',
        'Believer in "Engineering with Intent": Discovery → PRD → Architecture → Build → Iteration'
      ],
      links: [
        { label: 'Download Resume', url: 'https://drive.google.com/uc?export=download&id=1kUrtfQCpxHjxxPDoP4tRE257u_-abUWf', primary: true },
        { label: 'View LinkedIn', url: PORTFOLIO_CONTEXT.contact.linkedin },
        { label: 'GitHub Profile', url: PORTFOLIO_CONTEXT.contact.github }
      ]
    }
  },
  {
    id: 'projects',
    name: 'Projects Citadel',
    category: 'projects',
    position: [0, 0, -32],
    color: '#f97316',
    tagline: 'Featured AI & Full-Stack Systems',
    iconName: 'FolderGit2',
    content: {
      title: 'Featured Projects & AI Systems',
      subtitle: 'Engineered for Real-World Scalability & Business Impact',
      description:
        'A collection of production applications, AI agent frameworks, and productivity tools built to eliminate operational friction and turn complex data into actionable workflows.',
      highlights: [
        'SyncScripts: Solving meeting debt by automating transcript analysis with Gemini 1.5 Flash (Stateless privacy architecture)',
        'EchoMap: AI-driven diagnostic speech recognition system for detecting nuanced English linguistic gaps',
        '4Her: Dignified menstrual wellness tracking platform built with React, Node, Express, MongoDB',
        'AI Agent Orchestration Platform: Scalable multi-agent system on Google Cloud reclaiming 40% dev sprint capacity',
        'Intelligent PRD Gen: Multi-LLM spec automation cutting feature requirement writing from 15h to minutes',
        'PulseCheck AI: Predictive customer churn intelligence connecting LLM structured JSON to real-time dynamic visualizations'
      ],
      links: [
        { label: 'Launch SyncScripts', url: 'https://syncscripts.netlify.app/', primary: true },
        { label: 'Launch EchoMap', url: 'https://echo-map.netlify.app/' },
        { label: 'Launch 4Her', url: 'https://the4her.netlify.app/' }
      ]
    }
  },
  {
    id: 'tech',
    name: 'Tech Matrix',
    category: 'tech',
    position: [32, 0, 0],
    color: '#a855f7',
    tagline: 'Modern Stack & Architectural Pillars',
    iconName: 'Cpu',
    content: {
      title: 'Technical Arsenal & Capabilities',
      subtitle: 'Full-Stack • AI / Agents • Cloud & Distributed Systems',
      description:
        'A battle-tested stack spanning modern frontend frameworks, robust typed backend engines, large language model integrations, and cloud infrastructure.',
      highlights: [
        'Languages: TypeScript, JavaScript, C#, Python, SQL',
        'Frontend: React, Next.js, Angular, Tailwind CSS, Framer Motion, Three.js / WebGL',
        'Backend & Cloud: .NET Core, Node.js, Express, Google Cloud Platform (GCP), RESTful APIs & Microservices',
        'AI & Agents: Google Gemini API, OpenAI GPT-4o, LLM Orchestration, Prompt Engineering, Structured Outputs',
        'Databases & DevOps: MS SQL Server, PostgreSQL, MongoDB, Git, CI/CD Pipelines, Netlify'
      ],
      meta: {
        'Engineering Philosophy': 'Intentional architecture over premature optimization',
        'Core Focus': 'Zero-friction UX backed by resilient backend services'
      }
    }
  },
  {
    id: 'experience',
    name: 'Career Highway',
    category: 'experience',
    position: [-32, 0, 0],
    color: '#34d399',
    tagline: 'Milestones, Leadership & Proven Track Record',
    iconName: 'Award',
    content: {
      title: 'Career Trajectory & Impact',
      subtitle: '4+ Years Delivering Scalable Software & AI Capabilities',
      description:
        'Proven history of designing high-availability systems, leading cross-functional teams, and transforming product requirements into business value.',
      highlights: [
        'TestingXperts (Current): Driving end-to-end delivery of client-facing microservices and building internal AI products',
        'Key Enterprise Clients: Intermex (Fintech/Remittance), S&S Activewear (Logistics/Wholesale), Premium Health US (Healthcare EHR)',
        'smartData Enterprises: Enterprise healthcare modules, dynamic travel insurance backend microservices',
        'RITES Ltd: Transport infrastructure engineering lifecycle and system audits',
        'Indian Air Force (AFSB) Recommendation: Demonstrating decisive leadership, calm execution under pressure, and strategic team alignment',
        'Academic Excellence: Master of Computer Applications (MCA) — 8.93 CGPA'
      ]
    }
  },
  {
    id: 'contact',
    name: 'Transmission Outpost',
    category: 'contact',
    position: [0, 0, 32],
    color: '#fbbf24',
    tagline: 'Direct Comms, Collaborations & Hiring',
    iconName: 'Radio',
    content: {
      title: 'Initiate Transmission',
      subtitle: 'Open for Software Engineering, Product Roles & High-Value Consulting',
      description:
        'Looking for someone who can translate complex technical challenges into measurable business outcomes? Let’s connect.',
      highlights: [
        'Primary Email: priyanshurawat.business@gmail.com',
        'Alternate Email: therealrawat@gmail.com',
        'Location: India (Open to Global Remote / Relocation Opportunities)',
        'Social: LinkedIn @rawat-priyanshu • Instagram @lowwhiskey'
      ],
      links: [
        { label: 'Email Priyanshu', url: 'mailto:priyanshurawat.business@gmail.com', primary: true },
        { label: 'LinkedIn Message', url: PORTFOLIO_CONTEXT.contact.linkedin },
        { label: 'GitHub Repos', url: PORTFOLIO_CONTEXT.contact.github },
        { label: 'Instagram', url: PORTFOLIO_CONTEXT.contact.instagram }
      ]
    }
  }
];

export interface DataCoreItem {
  id: number;
  position: [number, number, number];
  label: string;
}

export const DATA_CORES: DataCoreItem[] = [
  { id: 1, position: [14, 0.8, -14], label: 'Discovery Core' },
  { id: 2, position: [-14, 0.8, -14], label: 'PRD Core' },
  { id: 3, position: [14, 0.8, 14], label: 'Architecture Core' },
  { id: 4, position: [-14, 0.8, 14], label: 'Iteration Core' },
  { id: 5, position: [0, 0.8, -18], label: 'Optimization Core' },
];

