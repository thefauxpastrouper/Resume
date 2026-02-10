import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "dark" | "light" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    resolvedTheme: "dark" | "light";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function getSystemTheme(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "dark";
        return (localStorage.getItem("theme") as Theme) || "dark";
    });

    const resolvedTheme = theme === "system" ? getSystemTheme() : theme;

    useEffect(() => {
        const root = document.documentElement;

        if (resolvedTheme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        localStorage.setItem("theme", theme);
    }, [theme, resolvedTheme]);

    // Listen for system theme changes when in "system" mode
    useEffect(() => {
        if (theme !== "system") return;

        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            const root = document.documentElement;
            if (mediaQuery.matches) {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
}
