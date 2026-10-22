
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/common/Badge";
import toast from "react-hot-toast";

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated || localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in both email and password");
      return;
    }

    setLoading(true);
    setError("");

    const res = await login(form.email, form.password);
    if (res.success) {
      toast.success("Welcome back! 👋");
      navigate("/dashboard");
    } else {
      setError(res.error || "Invalid email or password");
      toast.error(res.error || "Login failed");
    }
    setLoading(false);
  };

  const handleGoogleAuth = () => {
    toast("Google OAuth integration coming soon! You can sign in with your email.", {
      icon: "ℹ️",
    });
  };

  return (
    <div className="min-h-screen flex font-sans overflow-hidden" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      {/* Left side: Warm gradient branding panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 bg-[var(--accent-sage)] relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-[var(--accent-peach)]/30 rounded-full blur-3xl" />

        <div
          className="flex items-center gap-3 relative z-10 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-2xl bg-[var(--accent-sage-contrast)]/20 backdrop-blur flex items-center justify-center text-[var(--accent-sage-contrast)] shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-caveat font-bold text-2xl tracking-tight text-[var(--accent-sage-contrast)]">
            SmartNotes
          </span>
        </div>

        <div className="max-w-md relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-sage-contrast)]/15 border border-[var(--accent-sage-contrast)]/20 text-[var(--accent-sage-contrast)] text-xs font-semibold mb-6 font-mono uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            Designed for higher education
          </div>
          <h2 className="font-fraunces text-4xl font-bold leading-[1.12] mb-4 text-[var(--accent-sage-contrast)]">
            "SmartNotes transformed my study routine before <em>finals week.</em>"
          </h2>
          <p className="text-sm text-[var(--accent-sage-contrast)]/80 leading-relaxed mb-6">
            OCR scan handwritten lectures, auto-generate recall flashcards, and search through thousands of notes in milliseconds.
          </p>

          <div className="p-4 rounded-2xl bg-[var(--accent-sage-contrast)]/10 border border-[var(--accent-sage-contrast)]/15 backdrop-blur flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--accent-sage-contrast)]/20 flex items-center justify-center text-[var(--accent-sage-contrast)] font-bold text-sm">
              98%
            </div>
            <div>
              <p className="text-xs font-bold text-[var(--accent-sage-contrast)]">Faster Revision Speed</p>
              <p className="text-[11px] text-[var(--accent-sage-contrast)]/70">Validated by university students</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-[var(--accent-sage-contrast)]/60 flex items-center justify-between">
          <span>© {new Date().getFullYear()} SmartNotes App</span>
          <span className="flex items-center gap-1.5 text-[var(--accent-sage-contrast)]/80 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Offline Capable
          </span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 bg-[var(--bg-surface)]">
        <div className="w-full max-w-md space-y-8 rounded-[28px] sm:rounded-none">
          <div>
            <div className="lg:hidden flex items-center gap-2.5 mb-6 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-8 h-8 rounded-xl bg-[var(--accent-sage)] flex items-center justify-center text-[var(--accent-sage-contrast)]">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-caveat font-bold text-xl text-[var(--text-primary)]">SmartNotes</span>
            </div>
            <h2 className="font-fraunces text-2xl font-bold tracking-tight text-[var(--text-primary)]">
              Welcome back
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              Enter your credentials to access your notes and study decks.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-hover)] text-sm font-semibold text-[var(--text-primary)] transition flex items-center justify-center gap-3 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.28v3.15C3.26 21.36 7.35 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.28C.46 8.2 0 10.04 0 12s.46 3.8 1.28 5.43l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.28 6.57l4.04 3.15c.94-2.82 3.58-4.97 6.68-4.97z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center">
            <span className="w-full border-t border-[var(--border-subtle)]" />
            <span className="absolute bg-[var(--bg-surface)] px-3 text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold font-mono">
              Or with email
            </span>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/40 text-xs text-[var(--color-destructive)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/20 focus:border-[var(--accent-sage)] transition duration-200"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                  Password
                </label>
                <span
                  onClick={() => toast("Password reset is linked with your registered university email.")}
                  className="text-xs text-[var(--accent-sage)] hover:text-[var(--accent-sage)]/70 cursor-pointer"
                >
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3.5 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/20 focus:border-[var(--accent-sage)] transition duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full text-base font-semibold"
            >
              Sign In to SmartNotes
            </Button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)]">
            Don't have an account yet?{" "}
            <Link to="/signup" className="text-[var(--accent-sage)] hover:text-[var(--accent-sage)]/80 font-semibold hover:underline">
              Create an account free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
