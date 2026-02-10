import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, User, Eye, EyeOff, Github, Chrome } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GhostLoader } from "@/components/ui/GhostLoader";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  displayName: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
    },
  });

  const onSubmit = async (data: AuthFormData) => {
    if (isLogin) {
      const { error } = await signIn(data.email, data.password);
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome back!" });
        navigate("/");
      }
    } else {
      if (!data.displayName) {
        toast({ title: "Error", description: "Display name is required for sign up", variant: "destructive" });
        return;
      }
      const { error } = await signUp(data.email, data.password, data.displayName);
      if (error) {
        if (error.message.includes("rate limit") || error.status === 429) {
          toast({
            title: "Too many attempts",
            description: "You've exceeded the rate limit for signups. Please wait a moment or check your Supabase dashboard settings.",
            variant: "destructive"
          });
        } else {
          toast({ title: "Error", description: error.message, variant: "destructive" });
        }
      } else {
        toast({ title: "Account created!", description: "Please check your email to verify your account." });
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const handleOAuthLogin = (provider: 'google' | 'github') => {
    toast({
      title: "Coming Soon",
      description: `${provider.charAt(0).toUpperCase() + provider.slice(1)} login will be available shortly.`,
    });
  };

  if (isLoading) return <GhostLoader />;

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 bg-background">
      <div className="w-full max-w-md glass rounded-2xl p-8 animate-fade-in-up border border-white/10 shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          {isLogin ? "Sign in to your account" : "Join the community"}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {!isLogin && (
            <div className="relative group">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                {...register("displayName")}
                type="text"
                placeholder="Display Name"
                className={`w-full pl-10 pr-4 py-3 bg-muted/50 border ${errors.displayName ? 'border-destructive' : 'border-border'} rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              />
              {errors.displayName && <p className="text-xs text-destructive mt-1 ml-1">{errors.displayName.message}</p>}
            </div>
          )}

          <div className="relative group">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-3 bg-muted/50 border ${errors.email ? 'border-destructive' : 'border-border'} rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
            />
            {errors.email && <p className="text-xs text-destructive mt-1 ml-1">{errors.email.message}</p>}
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full pl-10 pr-12 py-3 bg-muted/50 border ${errors.password ? 'border-destructive' : 'border-border'} rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && <p className="text-xs text-destructive mt-1 ml-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] shadow-lg shadow-primary/20 glow-blue"
          >
            {isSubmitting ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-muted"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleOAuthLogin('github')}
            className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Github size={18} />
            <span className="text-sm font-medium">GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Chrome size={18} />
            <span className="text-sm font-medium">Google</span>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-primary hover:underline font-medium ml-1"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
}
