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
    name: 'Executive Brief',
    category: 'spawn',
    position: [0, 0, 0],
    color: '#ffffff',
    tagline: 'Priyanshu Rawat — Software Engineer & Product Thinker',
    iconName: 'Compass',
    content: {
      title: 'Priyanshu Rawat',
      subtitle: 'Software Engineer & Product Builder • 4+ Years Enterprise & AI Delivery',
      description:
        'For Hiring Managers & Prospective Clients: I bridge complex full-stack engineering with product strategy so every sprint drives measurable business ROI. From writing PRDs with stakeholders to shipping production AI agents and resilient microservices, I own outcomes end-to-end.',
      highlights: [
        'End-to-End Ownership: Discovery → PRD → System Architecture → Full-Stack Build → Iteration',
        'Currently at TestingXperts: Delivering client microservices while shipping internal AI tools that boost engineering velocity',
        'Proven Enterprise Delivery: Intermex (Fintech), S&S Activewear (Logistics), Premium Health US (Healthcare EHR)',
        'Leadership & Discipline: MCA (8.93 CGPA) & Air Force Selection Board (AFSB) Recommended candidate',
      ],
      links: [
        {
          label: 'Download Resume',
          url: 'https://drive.google.com/uc?export=download&id=1kUrtfQCpxHjxxPDoP4tRE257u_-abUWf',
          primary: true,
        },
        { label: 'LinkedIn Profile', url: PORTFOLIO_CONTEXT.contact.linkedin },
        { label: 'GitHub Portfolio', url: PORTFOLIO_CONTEXT.contact.github },
      ],
      meta: {
        'Hiring Availability': 'Open to Senior SWE, Product Engineer & AI Systems roles',
        'Client Engagements': 'AI Agents, SaaS MVPs & Architecture Consulting',
      },
    },
  },
  {
    id: 'projects',
    name: 'Case Studies & ROI',
    category: 'projects',
    position: [0, 0, -20],
    color: '#f97316',
    tagline: 'Live AI Products & Business Impact Portfolio',
    iconName: 'FolderGit2',
    content: {
      title: 'Selected Case Studies & AI Systems',
      subtitle: 'Built to Eliminate Operational Bottlenecks & Ship Faster',
      description:
        'Production applications engineered around concrete user and team bottlenecks — from cutting 15-hour manual PRD cycles down to minutes, to orchestrating stateless Gemini AI pipelines.',
      highlights: [
        'AI Agent Orchestrator: Reclaimed ~40% engineering sprint capacity on Google Cloud by automating manual operational workflows',
        'Intelligent PRD Generator: Cut feature spec authoring from 15+ hours to minutes using multi-LLM structured outputs & PostgreSQL',
        'SyncScripts (Live): Zero-retention Gemini 1.5 Flash meeting synthesizer turning raw transcripts into executive action plans',
        'EchoMap (Live): Real-time English pronunciation & speech diagnostic engine powered by Web Audio spectrograms & Speech AI',
        'PulseCheck AI: Predictive customer churn BI mapping structured LLM JSON directly to live retention visualizations',
        '4Her (Live): Privacy-first full-stack wellness analytics platform built with React, Node.js, Express & MongoDB',
      ],
      links: [
        { label: 'Open SyncScripts Live', url: 'https://syncscripts.netlify.app/', primary: true },
        { label: 'Open EchoMap Live', url: 'https://echo-map.netlify.app/' },
        { label: 'Open 4Her Live', url: 'https://the4her.netlify.app/' },
      ],
    },
  },
  {
    id: 'tech',
    name: 'Capabilities & Stack',
    category: 'tech',
    position: [20, 0, 0],
    color: '#f59e0b',
    tagline: 'Full-Stack Engineering • AI Agents • Cloud Architecture',
    iconName: 'Cpu',
    content: {
      title: 'Technical Capabilities & Architecture',
      subtitle: 'What You Get on Day One — Production Readiness Across the Stack',
      description:
        'A versatile, production-hardened toolkit spanning typed backends, modern web interfaces, LLM agent orchestration, and cloud infrastructure designed for maintainability and scale.',
      highlights: [
        'Frontend & UX Engineering: React, Next.js, Angular, TypeScript, Tailwind CSS, Framer Motion, Three.js / WebGL',
        'Backend & APIs: .NET Core (C#), Node.js, Express, Python, FastAPI, RESTful Microservices & Entity Framework',
        'Applied AI & Automation: Google Gemini API, OpenAI GPT-4o, LangChain, CrewAI, RAG, Vector DBs, Structured Outputs',
        'Cloud, Data & DevOps: Google Cloud Platform (GCP), Azure, Docker, Kubernetes, MS SQL Server, PostgreSQL, MongoDB, Redis',
        'Product Execution: PRDs, Agile Roadmapping, Stakeholder Demos, Rapid 0-to-1 MVP Prototyping & CI/CD',
      ],
      meta: {
        'Architecture Standard': 'Resilient typed contracts, low-friction UX & measurable latency',
        'Delivery Model': 'Fast iterative releases backed by clear PRDs and ownership',
      },
    },
  },
  {
    id: 'experience',
    name: 'Track Record',
    category: 'experience',
    position: [-12.5, 0, 0],
    color: '#fb923c',
    tagline: 'Enterprise Clients, Shipping History & Recognition',
    iconName: 'Award',
    content: {
      title: 'Enterprise Experience & Track Record',
      subtitle: '4+ Years Shipping Critical Systems Across Fintech, Logistics & Healthcare',
      description:
        'Trusted across client-facing consulting and enterprise product delivery to take ambiguous requirements to reliable, high-volume production releases.',
      highlights: [
        'TestingXperts (Current — Software Engineer): Leading client microservice delivery & internal AI products; recipient of individual & team recognition awards',
        'Enterprise Client Portfolio: Intermex (Fintech & cross-border remittance), S&S Activewear (Wholesale logistics), Premium Health US (Urgent-care EHR)',
        'smartData Enterprises (Associate Software Engineer): Built HIPAA-aware healthcare EHR backend modules, travel insurance microservices & React dashboards',
        'RITES Ltd (Intern): Transport infrastructure engineering workflows, documentation & enterprise SDLC audits',
        'Indian Air Force (AFSB) Recommendation: Leadership under pressure, mission clarity & cross-functional team command',
      ],
    },
  },
  {
    id: 'contact',
    name: 'Hire or Partner',
    category: 'contact',
    position: [0, 0, 20],
    color: '#10b981',
    tagline: 'Start a Hiring Conversation or Client Engagement',
    iconName: 'Radio',
    content: {
      title: 'Hire or Partner With Priyanshu',
      subtitle: 'Open for Senior SWE / Product Engineering Roles & High-Impact Client Builds',
      description:
        'Whether you are hiring a high-ownership engineer for your product team or looking for a technical partner to scope and build an AI-enabled application, reach out directly below.',
      highlights: [
        'For Hiring Managers: Full-time roles (Software Engineer, Product Engineer, Full-Stack / Applied AI) — India / Remote / Relocation',
        'For Prospective Clients: End-to-end 0-to-1 MVP builds, workflow/AI agent automation & architecture advisory',
        'Primary Email: priyanshurawat.business@gmail.com',
        'Secondary Email: therealrawat@gmail.com',
      ],
      links: [
        { label: 'Email Priyanshu', url: 'mailto:priyanshurawat.business@gmail.com', primary: true },
        {
          label: 'Download Resume',
          url: 'https://drive.google.com/uc?export=download&id=1kUrtfQCpxHjxxPDoP4tRE257u_-abUWf',
        },
        { label: 'Message on LinkedIn', url: PORTFOLIO_CONTEXT.contact.linkedin },
        { label: 'Inspect GitHub', url: PORTFOLIO_CONTEXT.contact.github },
      ],
      meta: {
        'Response Window': 'Typically within 24 hours',
        'Discovery Call': 'Available via email or LinkedIn',
      },
    },
  },
];
