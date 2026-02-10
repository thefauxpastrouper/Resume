import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Home, User, FolderOpen, BookOpen, LogIn, LogOut, Shield, Menu, X, Sun, Moon, Monitor } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/about", label: "About", icon: User },
  { path: "/projects", label: "Projects", icon: FolderOpen },
  { path: "/blog", label: "Blog", icon: BookOpen },
];

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cycleTheme = () => {
    const next = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
  };

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const themeLabel = theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System";

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-20 flex-col items-center justify-between py-8 glass z-50">
        <div className="flex flex-col items-center gap-2">
          <Link to="/" className="text-2xl font-bold text-gradient mb-8">AS</Link>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-3 w-16 rounded-lg transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                title={item.label}
              >
                <Icon size={20} />
                <span className="text-[10px]">{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              to="/admin"
              className={`flex flex-col items-center gap-1 p-3 w-16 rounded-lg transition-colors ${location.pathname === "/admin" ? "bg-accent/20 text-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              title="Admin"
            >
              <Shield size={20} />
              <span className="text-[10px]">Admin</span>
            </Link>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={cycleTheme}
            className="flex flex-col items-center gap-1 p-3 w-16 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={`Theme: ${themeLabel}`}
          >
            <ThemeIcon size={20} />
            <span className="text-[10px]">{themeLabel}</span>
          </button>
          {user ? (
            <button
              onClick={signOut}
              className="flex flex-col items-center gap-1 p-3 w-16 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              title="Sign Out"
            >
              <LogOut size={20} />
              <span className="text-[10px]">Logout</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className={`flex flex-col items-center gap-1 p-3 w-16 rounded-lg transition-colors ${location.pathname === "/auth" ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              title="Sign In"
            >
              <LogIn size={20} />
              <span className="text-[10px]">Login</span>
            </Link>
          )}
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 glass z-50 flex items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-gradient">AS</Link>
        <div className="flex items-center gap-2">
          <button onClick={cycleTheme} className="text-foreground p-2" title={`Theme: ${themeLabel}`}>
            <ThemeIcon size={20} />
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground p-2">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-14">
          <nav className="flex flex-col items-center gap-4 pt-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-lg text-lg transition-colors ${active ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-6 py-3 rounded-lg text-lg text-accent hover:bg-muted/50 transition-colors"
              >
                <Shield size={20} />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-6 py-3 rounded-lg text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-6 py-3 rounded-lg text-lg text-muted-foreground hover:text-foreground transition-colors"
              >
                <LogIn size={20} />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
