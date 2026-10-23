
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  BookOpen,
  ScanLine,
  Share2,
  CloudCheck,
  CheckCircle2,
  ArrowRight,
  BrainCircuit,
  Lock,
  Star,
  Users,
  Layers,
  GraduationCap,
} from "lucide-react";
import { Button } from "../Components/common/Badge";
import { useAuth } from "../context/AuthContext";

export const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BrainCircuit,
      // AI feature = gold
      iconBg: "bg-[var(--accent-gold)]/15",
      iconColor: "text-[var(--accent-gold)]",
      title: "AI Study Co-pilot",
      desc: "Turn bulky notes into bulleted summaries, smart tag hierarchies, flashcards, and ELI5 concept breakdowns.",
    },
    {
      icon: ScanLine,
      // AI/OCR feature = gold
      iconBg: "bg-[var(--accent-gold)]/15",
      iconColor: "text-[var(--accent-gold)]",
      title: "Handwritten OCR Scanner",
      desc: "Snap a photo of lecture whiteboards or notebook pages and extract clean, searchable, editable text.",
    },
    {
      icon: BookOpen,
      // user content = sage
      iconBg: "bg-[var(--accent-sage)]/15",
      iconColor: "text-[var(--accent-sage)]",
      title: "Rich TipTap Editor",
      desc: "Distraction-free markdown & rich text editing with live checklists, code blocks, highlighting, and auto-save.",
    },
    {
      icon: CloudCheck,
      // user content = sage
      iconBg: "bg-[var(--accent-sage)]/15",
      iconColor: "text-[var(--accent-sage)]",
      title: "Offline-First Sync",
      desc: "Take notes on campus or during commutes without Wi-Fi. Offline drafts automatically sync to PostgreSQL.",
    },
    {
      icon: Share2,
      // share/collaborative = peach
      iconBg: "bg-[var(--accent-peach)]/15",
      iconColor: "text-[var(--accent-peach)]",
      title: "Secure Collaboration Links",
      desc: "Generate viewable links with custom expiry and permission controls for study groups and peer reviews.",
    },
    {
      icon: Layers,
      // user content = sage
      iconBg: "bg-[var(--accent-sage)]/15",
      iconColor: "text-[var(--accent-sage)]",
      title: "Organized Notebooks & Tags",
      desc: "Categorize notes into subject notebooks like Computer Science, Biology, and Math with instant tag filtering.",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] selection:bg-[var(--accent-sage)] selection:text-[var(--accent-sage-contrast)] overflow-hidden relative font-sans">
      {/* Background soft mesh gradients */}
      <div className="pointer-events-none absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[var(--accent-sage)]/20 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[var(--accent-peach)]/10 rounded-full blur-[140px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[30%] w-[600px] h-[600px] bg-[var(--accent-gold)]/8 rounded-full blur-[140px]" />

      {/* Top Navigation */}
      <header className="relative z-20 bg-[var(--bg-base)]/80 backdrop-blur-xl border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Overlapping sage+peach logo circles */}
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute w-7 h-7 rounded-full bg-[var(--accent-sage)] left-0 top-1/2 -translate-y-1/2 opacity-90" />
              <div className="absolute w-7 h-7 rounded-full bg-[var(--accent-peach)] right-0 top-1/2 -translate-y-1/2 opacity-70 mix-blend-multiply" />
              <Sparkles className="relative z-10 w-4 h-4 text-[var(--accent-sage-contrast)]" />
            </div>
            <span className="font-caveat font-bold text-2xl tracking-tight text-[var(--text-primary)]">
              SmartNotes
            </span>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate("/dashboard")}
                icon={ArrowRight}
              >
                Open Dashboard
              </Button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2.5 rounded-2xl bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)] font-bold text-sm hover:opacity-90 transition shadow-md"
                >
                  Get Started Free
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-24 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/25 text-[var(--accent-gold)] text-xs font-semibold mb-6 shadow-inner font-mono uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[var(--accent-sage)]" />
          <span>The Modern Student AI Note-Taking Engine</span>
        </div>

        {/* Headline */}
        <h1 className="font-fraunces text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--text-primary)] leading-[1.08] mb-6 max-w-4xl">
          Study smarter, organize faster, and{" "}
          <em className="text-[var(--accent-sage)]">ace every exam</em>.
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mb-10 leading-relaxed font-normal">
          SmartNotes combines handwriting OCR, AI flashcards, instant summaries, and offline-first storage into a single beautiful workspace designed for students and researchers.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <button
            onClick={() => navigate("/signup")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)] font-bold text-base hover:opacity-90 transition shadow-xl"
          >
            Start Taking Smart Notes
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-[var(--accent-sage)]/40 bg-[var(--bg-surface)]/75 hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] text-base font-semibold transition"
          >
            Live Demo Access
          </button>
        </div>

        {/* Trust proofs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[var(--text-muted)]">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-sage)]" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-sage)]" /> Free AI quotas included
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-sage)]" /> Works completely offline
          </span>
        </div>

        {/* App Showcase Card */}
        <div className="mt-16 w-full rounded-3xl p-3 bg-gradient-to-b from-[var(--accent-sage)]/20 via-[var(--bg-elevated)]/80 to-[var(--bg-base)] border border-[var(--border-subtle)] shadow-2xl backdrop-blur-xl">
          <div className="rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-6 sm:p-8 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* OCR Card */}
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-sage)]">
                  OCR Engine
                </span>
                <h4 className="text-base font-bold text-[var(--text-primary)] mt-1">Scan handwritten lecture notes</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Snap a photo of your notebook or chalkboard, extract clean editable text in seconds.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-[var(--accent-sage)]">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Accuracy
                </span>
                <span className="text-[var(--accent-sage)] font-semibold">Tesseract.js</span>
              </div>
            </div>

            {/* AI Assistant Card */}
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-gold)]">
                  AI Study Assistant
                </span>
                <h4 className="text-base font-bold text-[var(--text-primary)] mt-1">Interactive Flashcards &amp; Quizzes</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Generate multiple choice quiz questions and recall flashcards directly from lecture content.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-[var(--accent-gold)]">
                  <Sparkles className="w-3.5 h-3.5" /> Cohere &amp; Local AI
                </span>
                <span className="text-[var(--accent-gold)] font-semibold">Active Recall</span>
              </div>
            </div>

            {/* Peer Sharing Card */}
            <div className="p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent-peach)]">
                  Peer Sharing
                </span>
                <h4 className="text-base font-bold text-[var(--text-primary)] mt-1">Collaborate with Classmates</h4>
                <p className="text-xs text-[var(--text-muted)] mt-2">
                  Generate shareable public links with view or edit permissions and expiration dates.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1 text-[var(--accent-peach)]">
                  <Share2 className="w-3.5 h-3.5" /> Instant URL
                </span>
                <span className="text-[var(--accent-peach)] font-semibold">Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 border-t border-[var(--border-subtle)]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-fraunces text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight mb-4">
            Everything you need to <em>excel</em> in university &amp; school
          </h2>
          <p className="font-sans text-sm sm:text-base text-[var(--text-secondary)]">
            A comprehensive suite of study tools built to eliminate busywork and maximize learning retention.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const IconComp = f.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--accent-sage)]/40 hover:bg-[var(--bg-elevated)] transition-all duration-300 group hover:-translate-y-1"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${f.iconBg} ${f.iconColor} flex items-center justify-center mb-5 shadow-md shadow-black/10 group-hover:scale-110 transition-transform`}
                >
                  <IconComp className="w-6 h-6" />
                </div>
                <h3 className="font-fraunces text-lg font-bold text-[var(--text-primary)] mb-2">
                  {f.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[var(--bg-base)] border-t border-[var(--border-subtle)] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--accent-sage)]" />
            <span className="font-caveat font-bold text-base text-[var(--text-secondary)]">SmartNotes</span>
            <span>— Modern AI Student Note-Taking Platform</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/login")} className="hover:text-[var(--text-primary)] transition">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="hover:text-[var(--text-primary)] transition">
              Sign Up
            </button>
            <span>© {new Date().getFullYear()} SmartNotes. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
