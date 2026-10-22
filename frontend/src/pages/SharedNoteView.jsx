import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/API";
import {
  Sparkles,
  Calendar,
  Clock,
  Share2,
  Lock,
  ArrowRight,
  BookOpen,
  Leaf,
} from "lucide-react";
import { formatNoteDate, getReadingStats } from "../utils/formatters";
import { Button } from "../components/common/Badge";

export const SharedNoteView = () => {
  const { shareId } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSharedNote = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await API.get(`/notes/shared/${shareId}`);
        setNote(res.data);
      } catch (err) {
        setError(
          "This shared note could not be found or the link has expired."
        );
        setNote(null);
      } finally {
        setLoading(false);
      }
    };

    if (!shareId) {
      setError("This shared note link is invalid.");
      setLoading(false);
      return;
    }

    fetchSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--accent-peach)]/30 bg-[var(--accent-peach)]/10 text-[var(--accent-peach)]">
            <BookOpen className="h-6 w-6 animate-pulse" />
          </div>

          <h2 className="font-fraunces text-2xl tracking-tight text-[var(--text-primary)]">
            A moment for your ideas.
          </h2>

          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Loading your shared note...
          </p>

          <div className="mx-auto mt-6 h-1 w-24 overflow-hidden rounded-full bg-[var(--border-subtle)]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--accent-peach)]" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 text-center sm:p-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-destructive)]/10 text-[var(--color-destructive)]">
            <Lock className="h-6 w-6" />
          </div>

          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--color-destructive)]">
            Link unavailable
          </p>

          <h2 className="font-fraunces mb-3 text-3xl tracking-tight text-[var(--text-primary)]">
            This note is out of reach.
          </h2>

          <p className="mb-8 text-sm leading-7 text-[var(--text-muted)]">
            {error ||
              "The link may be invalid or access was revoked by the author."}
          </p>

          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent-sage)] px-5 py-3 text-sm font-semibold text-[var(--accent-sage-contrast)] transition-colors hover:opacity-90"
          >
            Back to SmartNotes
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const stats = getReadingStats(note.content || "");

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] font-sans selection:bg-[var(--accent-peach)] selection:text-[var(--accent-sage-contrast)]">
      {/* Navbar — peach-accented header */}
      <header className="sticky top-0 z-30 border-b border-[var(--accent-peach)]/20 bg-[var(--accent-peach)]/10 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-3 text-left"
            aria-label="Go to SmartNotes home"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-peach)]/20 text-[var(--accent-peach)] transition-colors group-hover:bg-[var(--accent-peach)]/30">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <span className="block font-caveat text-lg font-bold tracking-tight text-[var(--text-primary)]">
                SmartNotes
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--text-muted)] sm:block">
                A space for ideas
              </span>
            </div>
          </button>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs text-[var(--text-muted)] md:inline">
              A little knowledge, shared.
            </span>

            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--accent-sage)] px-4 py-2.5 text-xs font-bold text-[var(--accent-sage-contrast)] transition-all duration-200 hover:opacity-90"
            >
              Create your own
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-5 pb-12 pt-12 sm:px-8 sm:pt-20">
        {/* Shared note label — peach badge */}
        <div className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--accent-peach)]/15 text-[var(--accent-peach)]">
              <Share2 className="h-4 w-4" />
            </span>

            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent-peach)]">
              SHARED NOTE
            </span>
          </div>

          <span className="rounded-full border border-[var(--border-subtle)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Read only
          </span>
        </div>

        {/* Title */}
        <article>
          <header>
            <h1 className="mb-7 break-words font-fraunces text-3xl font-bold leading-[1.1] tracking-[-0.045em] text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
              {note.title || "Untitled Note"}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2 font-mono">
                <Calendar className="h-3.5 w-3.5 text-[var(--accent-peach)]" />
                {formatNoteDate(note.createdAt)}
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-[var(--border-subtle)] sm:block" />

              <span className="inline-flex items-center gap-2 font-mono">
                <Clock className="h-3.5 w-3.5 text-[var(--accent-peach)]" />
                {stats.readingTimeMin} min read
              </span>

              <span className="hidden h-1 w-1 rounded-full bg-[var(--border-subtle)] sm:block" />

              <span className="font-mono">{stats.wordCount} words</span>
            </div>
          </header>

          {/* Editorial divider */}
          <div className="mb-10 mt-10 border-t border-[var(--border-subtle)] sm:mb-14 sm:mt-14">
            <div className="h-[2px] w-12 bg-[var(--accent-peach)]" />
          </div>

          {/* Note body — Tailwind Typography plugin */}
          <div
            className={[
              "prose prose-invert max-w-none",
              "prose-headings:font-fraunces prose-headings:font-medium",
              "prose-headings:tracking-tight prose-headings:text-[var(--text-primary)]",
              "prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl",
              "prose-p:leading-[1.95] prose-p:text-[var(--text-secondary)]",
              "prose-li:text-[var(--text-secondary)]",
              "prose-strong:text-[var(--text-primary)]",
              "prose-a:text-[var(--accent-sage)] prose-a:decoration-[var(--accent-sage)]/40",
              "prose-blockquote:border-l-[var(--accent-peach)]",
              "prose-blockquote:text-[var(--text-muted)]",
              "prose-hr:border-[var(--border-subtle)]",
              "prose-th:bg-[var(--bg-elevated)] prose-th:text-[var(--text-primary)]",
              "prose-td:border-[var(--border-subtle)] prose-th:border-[var(--border-subtle)]",
              "prose-img:rounded-2xl",
              "prose-pre:border prose-pre:border-[var(--border-subtle)]",
              "prose-pre:bg-[var(--bg-elevated)] prose-pre:text-[var(--accent-gold)]",
              "prose-code:rounded prose-code:bg-[var(--bg-elevated)]",
              "prose-code:px-1 prose-code:py-0.5",
              "prose-code:text-[var(--accent-gold)]",
              "prose-code:before:content-none prose-code:after:content-none",
              "[overflow-wrap:anywhere]",
            ].join(" ")}
            dangerouslySetInnerHTML={{
              __html: note.content || "",
            }}
          />

          {/* Tags — peach pills for shared content */}
          {note.tags && note.tags.length > 0 && (
            <footer className="mt-12 border-t border-[var(--border-subtle)] pt-7">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Filed under
              </p>

              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-[var(--accent-peach)]/25 bg-[var(--accent-peach)]/10 px-3.5 py-2 text-xs text-[var(--accent-peach)] transition-colors hover:border-[var(--accent-peach)]/50 hover:bg-[var(--accent-peach)]/15"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </footer>
          )}
        </article>

        {/* CTA */}
        <section className="relative mt-16 overflow-hidden rounded-3xl border border-[var(--accent-sage)]/20 bg-[var(--bg-surface)] p-7 sm:mt-24 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-[var(--accent-sage)]/20" />
          <div className="pointer-events-none absolute -right-2 -top-6 h-28 w-28 rounded-full border border-[var(--accent-sage)]/15" />

          <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
            <div className="max-w-lg">
              <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--accent-sage)]/15 text-[var(--accent-sage)]">
                <Leaf className="h-5 w-5" />
              </div>

              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--accent-sage)]">
                Your next idea starts here
              </p>

              <h2 className="font-fraunces text-3xl font-bold leading-tight tracking-tight text-[var(--text-primary)] sm:text-4xl">
                Good ideas deserve
                <br className="hidden sm:block" /> a place to <em>grow.</em>
              </h2>

              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--text-secondary)]">
                Keep your notes organized, scan handwritten pages with OCR,
                and turn your study material into AI-powered flashcards.
              </p>
            </div>

            <button
              onClick={() => navigate("/signup")}
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 rounded-xl bg-[var(--accent-sage)] px-5 py-3.5 text-sm font-bold text-[var(--accent-sage-contrast)] transition-colors hover:opacity-90"
            >
              Start for free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[var(--border-subtle)] pt-6 text-[10px] tracking-wide text-[var(--text-muted)] sm:flex-row">
          <span>SmartNotes · Made for curious minds.</span>

          <button
            onClick={() => navigate("/")}
            className="transition-colors hover:text-[var(--text-secondary)]"
          >
            Back to home ↗
          </button>
        </footer>
      </main>
    </div>
  );
};

export default SharedNoteView;
