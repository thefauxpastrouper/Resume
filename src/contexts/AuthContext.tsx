import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch session on mount
    authClient.getSession().then(({ data }) => {
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });
        // For now, admin check is done by email or a separate call
        // You can add an admin role table later
        checkAdmin(data.user.id);
      }
      setIsLoading(false);
    }).catch(() => {
      setIsLoading(false);
    });
  }, []);

  const checkAdmin = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/check?user_id=${userId}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setIsAdmin(!!data.isAdmin);
      }
    } catch {
      // silently fail, not admin
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await authClient.signIn.email({ email, password });
      if (error) {
        return { error };
      }
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });
        checkAdmin(data.user.id);
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Sign in failed" } };
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name: displayName,
      });
      if (error) {
        return { error };
      }
      if (data?.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          image: data.user.image,
        });
      }
      return { error: null };
    } catch (err: any) {
      return { error: { message: err.message || "Sign up failed" } };
    }
  };

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
