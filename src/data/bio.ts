export const PORTFOLIO_CONTEXT = {
  about: "Priyanshu Rawat, Technical Software Engineer with over 3 years of experience in architecting scalable solutions and a proven track record of transitioning technical features into business value. Currently, at TestingXperts, driving end-to-end delivery of client-facing projects while building AI-powered internal products that shape organizational capability. His approach to engineering is rooted in Product Thinking. he don’t just build backend modules; He identify bottlenecks—like data retrieval delays—and orchestrate intelligent agent solutions to solve them. Whether he is designing dynamic microservices for travel insurance carriers or pitching product demonstrations to multinational clients, his goal is to ensure that every line of code serves a strategic business objective. With an MCA (8.93 CGPA) and a background recommended by the AirForce Selection Board, I bring a disciplined, leadership-oriented mindset to cross-functional collaboration, Agile roadmapping, and stakeholder management..",
  
  pm_philosophy: "I believe in 'Engineering with Intent'. PRDs are the foundation of every successful product. My approach follows a structured methodology: Discovery → PRD → Architecture → Build → Iteration. This ensures we're solving the right problem with the right solution, validated through data-driven improvements.",
  
  projects: [
    {
      name: "SyncScripts",
      tech: "Gemini, React, TypeScript",
      pm_angle: "Solved Meeting Debt by automating transcript analysis. Professional teams in service-based and technical consulting firms face Information Overload post-meeting. SyncScripts transforms meeting transcripts into actionable insights, reducing context switching and improving team productivity.",
      engineering_angle: "Stateless architecture for data privacy. Built with React and TypeScript, leveraging Gemini 1.5 Flash for intelligent transcript analysis. The system processes meeting data securely without storing sensitive information, ensuring privacy while delivering powerful AI-driven insights."
    },
    {
      name: "AI Agent Orchestration Platform",
      tech: "Gemini AI, React, TypeScript, Google Cloud",
      pm_angle: "Engineering teams lose 40% of sprint capacity to manual operational tasks and context switching. This platform automates complex workflows, allowing engineers to focus on high-value work.",
      engineering_angle: "Built on Google Cloud with Gemini AI integration. Scalable architecture that orchestrates multiple AI agents to handle complex operational tasks, reducing manual overhead and improving team efficiency."
    },
    {
      name: "Intelligent PRD Generator",
      tech: "LLM Integration, Next.js, PostgreSQL, OpenAI",
      pm_angle: "Product managers spend 15+ hours per feature writing comprehensive PRDs from scratch. This tool automates PRD generation while maintaining quality and comprehensiveness.",
      engineering_angle: "Next.js application with PostgreSQL backend. Integrates multiple LLMs to generate structured PRDs based on product requirements, user stories, and technical specifications."
    },
    {
      name: "PulseCheck AI",
      tech: "Recharts, Gemini AI, Tailwind",
      pm_angle: "Predictive churn analysis to protect revenue. Product teams lack systematic way to identify at-risk customers before they churn.",
      engineering_angle: "Mapping LLM JSON outputs to dynamic data visualizations. Built with React, Recharts for analytics, and Gemini AI for predictive modeling. Real-time dashboard that transforms AI insights into actionable business intelligence."
    }
  ],
  
  tech_stack: "Modern web technologies: Angular, React, TypeScript, .NET, C#, AI/ML (OpenAI, Gemini), Cloud platforms (Google Cloud), and databases (MS SQL Server). Focus on scalable, maintainable architectures.",
  
  value_prop: "Bridging the gap between Engineering and Strategy. I combine product thinking with technical execution to build solutions that solve real operational problems. My work demonstrates understanding of both the 'why' (product strategy) and the 'how' (engineering implementation)."
};

export type SectionContext = 
  | 'home' 
  | 'projects' 
  | 'mindset' 
  | 'tech' 
  | 'contact';

export function getContextForSection(section: SectionContext): string {
  switch (section) {
    case 'home':
      return `${PORTFOLIO_CONTEXT.about}\n\n${PORTFOLIO_CONTEXT.value_prop}`;
    case 'projects':
      return `Projects Context:\n${PORTFOLIO_CONTEXT.projects.map(p => 
        `- ${p.name}: ${p.pm_angle} ${p.engineering_angle}`
      ).join('\n\n')}`;
    case 'mindset':
      return PORTFOLIO_CONTEXT.pm_philosophy;
    case 'tech':
      return PORTFOLIO_CONTEXT.tech_stack;
    case 'contact':
      return `${PORTFOLIO_CONTEXT.about}\n\nOpen to product management and engineering opportunities.`;
    default:
      return PORTFOLIO_CONTEXT.about;
  }
}

