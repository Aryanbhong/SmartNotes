import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Leaf,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../Components/common/Badge";
import toast from "react-hot-toast";

export const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signup(form.name, form.email, form.password);

      if (res.success) {
        toast.success("Account created successfully! Please sign in.");
        navigate("/login");
      } else {
        setError(res.error || "Failed to create account");
        toast.error(res.error || "Signup failed");
      }
    } catch (err) {
      const message = err.message || "Something went wrong. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    toast(
      "Google OAuth integration coming soon! You can sign up with your email.",
      { icon: "ℹ️" }
    );
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] py-3.5 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-all duration-200 focus:border-[var(--accent-sage)] focus:ring-2 focus:ring-[var(--accent-sage)]/20";

  return (
    <div className="min-h-screen overflow-hidden font-sans lg:grid lg:grid-cols-2" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>

      {/* LEFT: Branding panel — sage themed */}
      <aside className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-[var(--border-subtle)] bg-[var(--accent-sage)] p-10 xl:p-14 lg:flex">

        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-28 top-24 h-80 w-80 rounded-full border border-[var(--accent-sage-contrast)]/15" />
        <div className="pointer-events-none absolute -right-16 top-36 h-56 w-56 rounded-full border border-[var(--accent-sage-contrast)]/15" />
        <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[var(--accent-peach)]/20 blur-3xl" />

        {/* Brand */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="relative z-10 flex w-fit items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-sage-contrast)]/20 text-[var(--accent-sage-contrast)]">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>
            <span className="block font-caveat text-xl font-bold tracking-tight text-[var(--accent-sage-contrast)]">
              SmartNotes
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--accent-sage-contrast)]/60">
              A space for ideas
            </span>
          </div>
        </button>

        {/* Main editorial content */}
        <div className="relative z-10 my-auto max-w-xl py-16">

          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--accent-sage-contrast)]/20 bg-[var(--accent-sage-contrast)]/10 px-3.5 py-2 text-xs text-[var(--accent-sage-contrast)]/80">
            <GraduationCap className="h-4 w-4" />
            Your personal study space
          </div>

          <h1 className="font-fraunces text-5xl font-bold leading-[1.12] tracking-[-0.04em] text-[var(--accent-sage-contrast)] xl:text-6xl">
            Make room
            <br />
            for what
            <br />
            <em>matters.</em>
          </h1>

          <p className="mt-7 max-w-md text-sm leading-7 text-[var(--accent-sage-contrast)]/75">
            Your ideas, notes, and next big breakthrough — all in one
            thoughtful space. Study at your own pace and let AI help
            you connect the dots.
          </p>

          {/* Feature list */}
          <div className="mt-10 space-y-5">
            {[
              {
                title: "Your notes, beautifully organized",
                desc: "Notebooks, folders, and tags in one place.",
              },
              {
                title: "From pages to searchable text",
                desc: "Use OCR to digitize your handwritten notes.",
              },
              {
                title: "Learn a little smarter",
                desc: "Create AI-powered flashcards and quizzes.",
              },
              {
                title: "Share knowledge, simply",
                desc: "Share notes with links and expiry controls.",
              },
            ].map((feature) => (
              <div key={feature.title} className="flex items-start gap-3.5">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-sage-contrast)]/15 text-[var(--accent-sage-contrast)]">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-[var(--accent-sage-contrast)]">
                    {feature.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--accent-sage-contrast)]/60">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Decorative quote */}
          <div className="mt-12 border-l-2 border-[var(--accent-sage-contrast)]/40 pl-5">
            <p className="font-fraunces text-lg italic leading-relaxed text-[var(--accent-sage-contrast)]/80">
              "A little progress each day adds up to big results."
            </p>
          </div>
        </div>

        {/* Bottom footer */}
        <div className="relative z-10 flex items-center justify-between gap-4 border-t border-[var(--accent-sage-contrast)]/20 pt-6 text-[10px] text-[var(--accent-sage-contrast)]/50">
          <span>© {new Date().getFullYear()} SmartNotes</span>

          <span className="flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-sage-contrast)]/70" />
            Your space, your ideas
          </span>
        </div>
      </aside>

      {/* RIGHT: Signup form */}
      <main className="relative flex min-h-screen items-center justify-center bg-[var(--bg-surface)] px-5 py-10 sm:px-10 lg:px-12 xl:px-20">

        {/* Subtle background decoration */}
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full bg-[var(--accent-sage)]/5 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">

          {/* Mobile brand */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-12 flex items-center gap-3 text-left lg:hidden"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)]">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <span className="block font-caveat text-xl font-bold text-[var(--text-primary)]">
                SmartNotes
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                A space for ideas
              </span>
            </div>
          </button>

          {/* Form heading */}
          <div className="mb-8">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--accent-sage)]/30 bg-[var(--accent-sage)]/10 text-[var(--accent-sage)]">
              <Leaf className="h-5 w-5" />
            </div>

            <p className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-sage)]">
              A fresh start
            </p>

            <h2 className="font-fraunces text-4xl font-bold tracking-[-0.035em] text-[var(--text-primary)] sm:text-5xl">
              Create your
              <br />
              <em className="text-[var(--accent-sage)]">account.</em>
            </h2>

            <p className="mt-4 text-sm leading-6 text-[var(--text-secondary)]">
              Build your own study space. Your next idea starts here.
            </p>
          </div>

          {/* Google button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-all duration-200 hover:border-[var(--accent-sage)]/40 hover:bg-[var(--bg-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/30"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
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

          {/* Divider */}
          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            <span className="font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
              Or use your email
            </span>
            <div className="h-px flex-1 bg-[var(--border-subtle)]" />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-5 rounded-xl border border-[var(--color-destructive)]/40 bg-[var(--color-destructive)]/10 px-4 py-3 text-sm leading-6 text-[var(--color-destructive)]"
            >
              {error}
            </div>
          )}

          {/* Signup form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="signup-name"
                className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
              >
                Full name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                <input
                  id="signup-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="signup-email"
                className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
              >
                Email address
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                <input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="signup-password"
                className="mb-2 block text-xs font-medium text-[var(--text-secondary)]"
              >
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />

                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-[10px] text-[var(--text-muted)]">
                Use at least 6 characters.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="group mt-2 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--accent-sage)] px-5 py-4 text-sm font-semibold text-[var(--accent-sage-contrast)] transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--accent-sage)]/50 focus:ring-offset-2 focus:ring-offset-[var(--bg-surface)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--accent-sage-contrast)]/30 border-t-[var(--accent-sage-contrast)]" />
                  Creating your account...
                </>
              ) : (
                <>
                  Create student account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Sign in */}
          <p className="mt-8 text-center text-xs text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[var(--accent-sage)] transition-colors hover:text-[var(--accent-sage)]/70"
            >
              Sign in
            </Link>
          </p>

          {/* Bottom note */}
          <div className="mt-10 flex items-center justify-center gap-2 border-t border-[var(--border-subtle)] pt-6 text-[10px] text-[var(--text-muted)]">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-sage)]" />
            <span>Your space for learning and growing.</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Signup;
