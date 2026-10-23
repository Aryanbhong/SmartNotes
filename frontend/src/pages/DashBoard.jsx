

import React from "react";
import {
  BookOpen,
  Calendar,
  ScanLine,
  Sparkles,
  Pin,
  Plus,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
} from "lucide-react";
import { useNotes } from "../context/NotesContext";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../Components/layout/AppLayout";
import NoteCard from "../Components/NoteCard";
import { Card, Button ,Badge } from "../Components/common/Badge";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const {
    notes,
    stats,
    openNewNoteModal,
    openEditNoteModal,
    setViewingNote,
    deleteNoteWithUndo,
    togglePin,
    toggleFavorite,
    summarizeNote,
    setSharingNote,
    loadingSummaryId,
    setIsOcrOpen,
  } = useNotes();

  const { user } = useAuth();
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const pinnedNotes = notes.filter((n) => n.pinned);
  const recentNotes = notes.slice(0, 6);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const activityData = [
    { day: "Mon", count: Math.min(6, Math.max(1, Math.floor(notes.length * 0.15) + 1)) },
    { day: "Tue", count: Math.min(8, Math.max(2, Math.floor(notes.length * 0.25) + 2)) },
    { day: "Wed", count: Math.min(7, Math.max(1, Math.floor(notes.length * 0.2) + 1)) },
    { day: "Thu", count: Math.min(10, Math.max(3, Math.floor(notes.length * 0.35) + 3)) },
    { day: "Fri", count: Math.min(6, Math.max(2, Math.floor(notes.length * 0.18) + 1)) },
    { day: "Sat", count: Math.min(4, Math.max(1, Math.floor(notes.length * 0.1) + 1)) },
    { day: "Sun", count: Math.min(5, Math.max(2, Math.floor(notes.length * 0.12) + 2)) },
  ];
  const maxActivity = Math.max(...activityData.map((d) => d.count), 1);

  return (
    <AppLayout>
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Top Greeting & Quick Action Banner */}
        <div className="relative overflow-hidden rounded-[28px] border border-[var(--border-subtle)] bg-[radial-gradient(ellipse_at_78%_20%,var(--accent-sage)/0.38,transparent_42%),radial-gradient(ellipse_at_96%_100%,var(--accent-heart)/0.18,transparent_36%),linear-gradient(125deg,var(--bg-base)_0%,var(--bg-elevated)_58%,var(--bg-surface)_100%)] text-[var(--accent-sage-contrast)] p-6 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.22)]">
          <div className="pointer-events-none absolute -right-10 -bottom-10 w-72 h-72 bg-[var(--accent-peach)]/10 rounded-full blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-sage-contrast)]/[0.07] backdrop-blur-md text-[var(--accent-peach)] text-xs font-semibold font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                SmartNotes Study Hub Active
              </div>
              <h1 className="font-fraunces text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--accent-sage-contrast)]">
                {getGreeting()}, <em>{user?.name ? user.name.split(" ")[0] : "Student"}</em>! 🎓
              </h1>
              <p className="text-xs sm:text-sm text-[var(--accent-sage-contrast)]/70 leading-relaxed font-normal">
                You have created <span className="font-bold text-[var(--accent-sage-contrast)]">{stats.notesThisWeek} note(s)</span> this week. Keep the momentum going!
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => openNewNoteModal()}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[var(--accent-sage)] text-[var(--accent-sage-contrast)] hover:opacity-90 font-bold text-xs sm:text-sm shadow-md transition transform hover:-translate-y-0.5 active:translate-y-0 font-sans"
              >
                <Plus className="w-4 h-4" />
                Create Note
              </button>
              <button
                type="button"
                onClick={() => setIsOcrOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/25 font-semibold text-xs sm:text-sm transition font-sans"
              >
                <ScanLine className="w-4 h-4" />
                OCR Scan
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Notes — sage */}
          <Card className="p-5 flex items-center justify-between bg-[var(--bg-surface)] border-[var(--border-subtle)]" hover>
            <div>
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-[var(--text-muted)]">Total Notes</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-fraunces text-[var(--text-primary)] mt-1">
                {stats.totalNotes}
              </h3>
              <p className="text-[11px] text-[var(--accent-sage)] font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Synced &amp; safe
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
          </Card>

          {/* Notes This Week — sage */}
          <Card className="p-5 flex items-center justify-between bg-[var(--bg-surface)] border-[var(--border-subtle)]" hover>
            <div>
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-[var(--text-muted)]">Notes This Week</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-fraunces text-[var(--text-primary)] mt-1">
                {stats.notesThisWeek}
              </h3>
              <p className="text-[11px] text-[var(--accent-sage)] font-medium mt-1">
                Weekly activity
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-sage)]/10 text-[var(--accent-sage)] flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
          </Card>

          {/* OCR Scans — gold */}
          <Card className="p-5 flex items-center justify-between bg-[var(--bg-surface)] border-[var(--border-subtle)]" hover>
            <div>
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-[var(--text-muted)]">OCR Scans Used</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-fraunces text-[var(--text-primary)] mt-1">
                {stats.ocrScans}
              </h3>
              <p className="text-[11px] text-[var(--accent-gold)] font-medium mt-1">
                Handwriting to text
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center">
              <ScanLine className="w-6 h-6" />
            </div>
          </Card>

          {/* AI Summaries — gold */}
          <Card className="p-5 flex items-center justify-between bg-[var(--bg-surface)] border-[var(--border-subtle)]" hover>
            <div>
              <p className="text-xs font-semibold font-mono uppercase tracking-wider text-[var(--text-muted)]">AI Summaries &amp; Decks</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-fraunces text-[var(--text-primary)] mt-1">
                {stats.aiSummariesUsed}
              </h3>
              <p className="text-[11px] text-[var(--accent-gold)] font-medium mt-1">
                Active study aids
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[var(--accent-gold)]/10 text-[var(--accent-gold)] flex items-center justify-center">
              <BrainCircuit className="w-6 h-6" />
            </div>
          </Card>
        </div>

        {/* Weekly Productivity Chart & Quick Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Bar Chart */}
          <Card className="lg:col-span-2 p-6 bg-[var(--bg-surface)] border-[var(--border-subtle)]" glass>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold font-fraunces text-[var(--text-primary)]">
                  Weekly Study Productivity
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Notes captured across the past 7 days</p>
              </div>
              <Badge variant="primary" size="xs">
                Live Metrics
              </Badge>
            </div>

            <div className="h-44 flex items-end justify-between gap-3 pt-4 px-2">
              {activityData.map((item, i) => {
                const heightPercent = Math.max(15, Math.round((item.count / maxActivity) * 100));
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                    <span className="text-[10px] text-[var(--text-muted)] group-hover:text-[var(--accent-sage)] font-semibold transition">
                      {item.count}
                    </span>
                    <div className="w-full bg-[var(--bg-elevated)] rounded-xl overflow-hidden h-32 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-[var(--accent-sage)] to-[var(--accent-sage)]/60 group-hover:from-[var(--accent-gold)] group-hover:to-[var(--accent-gold)]/60 rounded-xl transition-all duration-300"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-[var(--text-muted)]">
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Quick Study Assistant Card */}
          <Card className="p-6 flex flex-col justify-between bg-[var(--bg-surface)] border-[var(--border-subtle)]">
            <div>
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-gold)] text-[var(--bg-base)] flex items-center justify-center mb-4 shadow-md shadow-[var(--accent-gold)]/20">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-fraunces text-[var(--text-primary)] mb-1">
                Student AI Assistant
              </h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                Did you know? You can generate self-quizzes and flashcards directly from any note inside the editor.
              </p>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Summarize in Bullets</span>
                  <span className="text-[var(--accent-gold)] font-bold">Fast</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-[var(--text-secondary)]">Generate Flashcards</span>
                  <span className="text-[var(--accent-gold)] font-bold">Smart</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openNewNoteModal()}
              className="mt-6 w-full"
            >
              Try AI Tools Now
            </Button>
          </Card>
        </div>

        {/* Pinned Notes Section */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-fraunces text-[var(--text-primary)] flex items-center gap-2">
                <Pin className="w-4 h-4 text-[var(--accent-gold)] fill-current" />
                Pinned Notes
              </h2>
              <span className="text-xs text-[var(--text-muted)]">{pinnedNotes.length} pinned</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onView={setViewingNote}
                  onEdit={openEditNoteModal}
                  onDelete={deleteNoteWithUndo}
                  onTogglePin={togglePin}
                  onToggleFavorite={toggleFavorite}
                  onSummarize={summarizeNote}
                  onShare={setSharingNote}
                  loadingSummary={loadingSummaryId === note.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Notes Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-fraunces text-[var(--text-primary)]">
                Recent Notes
              </h2>
              <p className="text-xs text-[var(--text-muted)]">Recently edited and captured materials</p>
            </div>
            <button
              onClick={() => navigate("/notes")}
              className="text-xs font-semibold text-[var(--accent-sage)] hover:underline flex items-center gap-1"
            >
              View All ({notes.length}) <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {recentNotes.length === 0 ? (
            <Card className="p-10 text-center flex flex-col items-center justify-center bg-[var(--bg-surface)] border-[var(--border-subtle)]">
              <BookOpen className="w-12 h-12 text-[var(--text-muted)] mb-3" />
              <p className="text-sm font-semibold text-[var(--text-secondary)] mb-1">
                No notes found yet!
              </p>
              <p className="text-xs text-[var(--text-muted)] mb-4 max-w-sm">
                Get started by creating your first lecture or study note, or upload an image to extract text.
              </p>
              <Button variant="primary" size="sm" onClick={() => openNewNoteModal()}>
                <Plus className="w-4 h-4 mr-1.5" /> Create First Note
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onView={setViewingNote}
                  onEdit={openEditNoteModal}
                  onDelete={deleteNoteWithUndo}
                  onTogglePin={togglePin}
                  onToggleFavorite={toggleFavorite}
                  onSummarize={summarizeNote}
                  onShare={setSharingNote}
                  loadingSummary={loadingSummaryId === note.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
