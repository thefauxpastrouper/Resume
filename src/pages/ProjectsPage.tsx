import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "RestaurantChain",
    description: "A platform to store reviews on Solana blockchain. Restaurant owners create listings and get transparent feedback via on-chain reviews.",
    tags: ["Solana", "Blockchain", "Hetzner Cloud"],
    highlights: ["On-chain reviews for transparency", "Deployed frontend on Hetzner"],
  },
  {
    title: "Pump Fun Bot",
    description: "A Telegram bot that lets users create Solana tokens on the Pump Fun platform without incurring priority fees.",
    tags: ["Python", "Telegram Bot", "Solana"],
    highlights: ["Zero priority fee token creation", "Deployed via systemd on Hetzner"],
  },
  {
    title: "Analysis Bot",
    description: "Telegram bot for analyzing swap data on Solana. Detects whale activity using outlier detection across multiple DEXes.",
    tags: ["Node.js", "Solana", "Data Analysis"],
    highlights: ["Whale detection via outlier logic", "Supports PumpSwap, Raydium DEXes", "Rug-pull detection"],
  },
  {
    title: "HighwayDelight",
    description: "An online platform for booking adventure activities. Full MERN stack application deployed with Docker Compose.",
    tags: ["MERN", "Docker", "Hetzner Cloud"],
    highlights: ["User booking system", "Docker Compose deployment"],
  },
  {
    title: "Zapier Clone",
    description: "An automation platform connecting multiple applications to automate workflows without coding. Triggers, actions, and task history.",
    tags: ["Automation", "Full Stack", "REST APIs"],
    highlights: ["Trigger & action workflows", "Task history tracking"],
  },
  {
    title: "PayApp",
    description: "A Paytm-like application for secure digital payments with real-time transaction updates and multi-factor authentication.",
    tags: ["Payments", "MFA", "Real-time"],
    highlights: ["Multi-factor authentication", "Real-time transactions"],
  },
  {
    title: "Shop Manager",
    description: "A lightweight inventory management app for small shopkeepers. Tracks stock levels, manages sales, and generates bills.",
    tags: ["Inventory", "CRUD", "Full Stack"],
    highlights: ["Stock level tracking", "Bill generation"],
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20">
      <div className="max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          My <span className="gradient-text">Projects</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          A collection of projects spanning blockchain, automation, and full-stack web development.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <div
              key={project.title}
              className="glass rounded-xl p-6 hover-lift animate-fade-in-up"
              style={{ opacity: 0, animationDelay: `${(i + 2) * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <Github size={18} className="text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
              <ul className="text-sm text-muted-foreground mb-4 space-y-1">
                {project.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <span className="text-primary mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-primary" />
                    {h}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
