import { GraduationCap, Code2, Globe, Server, Database, Terminal } from "lucide-react";

const skillCategories = [
  {
    title: "Languages",
    icon: Code2,
    skills: ["Rust", "C++", "JavaScript", "Python", "TypeScript"],
  },
  {
    title: "Frontend",
    icon: Globe,
    skills: ["React", "Tailwind CSS", "HTML/CSS"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "MongoDB"],
  },
  {
    title: "DevOps & Tools",
    icon: Terminal,
    skills: ["Docker", "Docker Compose", "Hetzner Cloud", "systemd", "Git"],
  },
  {
    title: "Blockchain",
    icon: Database,
    skills: ["Solana", "Web3", "Smart Contracts"],
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 md:px-16 lg:px-24 py-20">
      <div className="max-w-4xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          About <span className="gradient-text">Me</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-12 max-w-2xl animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          I'm a Computer Science graduate from University of Delhi, passionate about building
          full-stack applications and exploring blockchain technology.
        </p>

        {/* Education */}
        <section className="mb-16 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <GraduationCap size={24} className="text-primary" />
            Education
          </h2>
          <div className="glass rounded-xl p-6">
            <h3 className="text-lg font-semibold">Bachelor of Computer Science</h3>
            <p className="text-primary">University of Delhi</p>
            <p className="text-sm text-muted-foreground mt-1">GPA: 7.7/10 — Top 10% of batch</p>
            <p className="text-sm text-muted-foreground mt-2">
              Coursework: Data Structures, Artificial Intelligence, Machine Learning, Software Engineering
            </p>
          </div>
        </section>

        {/* Skills */}
        <section className="animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <h2 className="text-xl font-semibold mb-6">Skills & Technologies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skillCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="glass rounded-xl p-5 hover-lift">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={18} className="text-primary" />
                    <h3 className="font-medium">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((s) => (
                      <span key={s} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
