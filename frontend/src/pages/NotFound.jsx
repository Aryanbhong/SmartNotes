import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Home, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "../Components/common/Badge";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--bg-base)] px-6 py-12 text-center" style={{ color: "var(--text-primary)" }}>
      {/* Soft ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 top-[-8rem] h-80 w-80 rounded-full bg-[var(--accent-sage)]/15 blur-[100px]" />
        <div className="absolute -right-20 bottom-[-7rem] h-96 w-96 rounded-full bg-[var(--accent-heart)]/10 blur-[110px]" />
        <div className="absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-gold)]/[0.06] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(246,242,233,0.025),transparent_55%)]" />
      </div>

      <div className="mb-8 flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 text-xs font-medium tracking-[0.18em] text-[var(--text-muted)] shadow-[0_8px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl font-mono uppercase">
        <BookOpen className="h-4 w-4 text-[var(--accent-sage)]" />
        <span>SMARTNOTES · LOST PAGE</span>
      </div>

      {/* Large 404 — sage at low opacity */}
      <h1 className="mb-2 font-fraunces text-[120px] font-bold leading-none tracking-[-0.08em] text-[var(--accent-sage)]/20 sm:text-[160px]">
        404
      </h1>

      <h2 className="mb-4 font-fraunces text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
        Page not found
      </h2>

      <p className="mb-2 font-fraunces text-base italic leading-relaxed text-[var(--text-muted)] max-w-sm">
        This page got lost between the lines.
      </p>

      <p className="mb-9 max-w-md text-sm leading-7 text-[var(--text-muted)] sm:text-base">
        The note, notebook, or link you're looking for may have been moved,
        renamed, or tucked away somewhere else.
      </p>

      <div className="flex w-full max-w-sm flex-col items-stretch justify-center gap-3 sm:w-auto sm:max-w-none sm:flex-row">
        <Button
          variant="outline"
          size="md"
          onClick={() => navigate(-1)}
          icon={ArrowLeft}
        >
          Go back
        </Button>
        <button
          onClick={() => navigate("/dashboard")}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent-sage)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-sage-contrast)] transition hover:opacity-90"
        >
          <Home className="h-4 w-4" />
          Back to dashboard
        </button>
      </div>

      <div className="mt-12 flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-sage)] shadow-[0_0_12px_var(--accent-sage)]" />
        <span>Your ideas are still right where you left them.</span>
      </div>
    </main>
  );
};

export default NotFound;
