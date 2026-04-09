import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, ArrowRight } from "lucide-react";

const skills = [
  "Rust", "C++", "JavaScript", "React", "MongoDB", "Express", "Node.js", "Solana", "Python", "Docker"
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col justify-center py-20">
      <div className="max-w-3xl animate-fade-in-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-3 w-3 rounded-full bg-success animate-pulse-glow" />
          <span className="text-sm text-muted-foreground">Available for work</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
          Hi, I'm{" "}
          <span className="gradient-text">Aditya Swaroop</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
          Full Stack Developer passionate about building decentralized applications,
          automation tools, and scalable web platforms. Currently exploring Solana, Rust, and Web3.
        </p>

        <div className="flex flex-wrap gap-2 mb-10">
          {skills.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full text-sm bg-muted text-muted-foreground border border-border hover:border-primary/50 hover:text-primary transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-12">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors glow-blue"
          >
            View Projects <ArrowRight size={18} />
          </Link>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-muted transition-colors"
          >
            Read Blog
          </Link>
        </div>

        <div className="flex items-center gap-5">
          <a href="https://github.com/thefauxpastrouper" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Github size={22} />
          </a>
          <a href="https://linkedin.com/in/swaroop-aditya" target="_blank" rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Linkedin size={22} />
          </a>
          <a href="mailto:work.adityaswaroop@gmail.com"
            className="text-muted-foreground hover:text-foreground transition-colors">
            <Mail size={22} />
          </a>

        </div>
      </div>
    </div>
  );
}
