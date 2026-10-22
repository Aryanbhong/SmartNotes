import React, { useState, useEffect } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Globe,
  Calendar,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { useNotes } from "../../context/NotesContext";
import API from "../../services/API";
import { Button } from "../common/Badge";
import toast from "react-hot-toast";

export const ShareModal = () => {
  const { sharingNote, setSharingNote } = useNotes();
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [permission, setPermission] = useState("view");
  const [expiry, setExpiry] = useState("never");
  const [isRevoked, setIsRevoked] = useState(false);

  useEffect(() => {
    if (sharingNote) {
      setCopied(false);
      setIsRevoked(false);

      if (sharingNote.shareId) {
        setShareLink(
          `${window.location.origin}/share/${sharingNote.shareId}`
        );
      } else {
        setShareLink("");
        generateLink();
      }
    } else {
      setShareLink("");
      setCopied(false);
      setIsRevoked(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharingNote]);

  useEffect(() => {
    if (!sharingNote) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        setSharingNote(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sharingNote, loading, setSharingNote]);

  if (!sharingNote) return null;

  const generateLink = async () => {
    if (!sharingNote?.id) return;

    setLoading(true);

    try {
      const res = await API.post(`/notes/${sharingNote.id}/share`);
      const link = `${window.location.origin}/share/${res.data.shareId}`;

      setShareLink(link);
      setIsRevoked(false);
      toast.success("Share link ready!");
    } catch {
      toast.error("Failed to generate share link");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareLink || isRevoked) return;

    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast.success("Link copied to clipboard!");

      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Unable to copy the link. Please copy it manually.");
    }
  };

  const handleRevoke = () => {
    setIsRevoked(true);
    setShareLink("");
    toast.success("Share link cleared from this dialog");
  };

  const handleSocialShare = (platform) => {
    if (!shareLink || isRevoked) return;

    const text = `Check out this note on SmartNotes: "${
      sharingNote.title || "Untitled Note"
    }"`;

    let url = "";

    if (platform === "whatsapp") {
      url = `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${text} ${shareLink}`
      )}`;
    } else if (platform === "twitter") {
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(shareLink)}`;
    } else if (platform === "email") {
      url = `mailto:?subject=${encodeURIComponent(
        sharingNote.title || "SmartNotes"
      )}&body=${encodeURIComponent(`${text}\n\n${shareLink}`)}`;
    }

    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const selectedOption =
    "bg-[var(--bg-surface)] text-[var(--accent-peach)] border-[var(--accent-peach)]/40 shadow-sm";

  const unselectedOption =
    "border-transparent text-[var(--text-muted)] hover:bg-[var(--bg-hover)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[var(--bg-base)]/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={() => !loading && setSharingNote(null)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-[0_24px_80px_rgba(41,39,32,0.2)] p-5 sm:p-6 text-[var(--text-primary)] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <button
          type="button"
          onClick={() => setSharingNote(null)}
          disabled={loading}
          aria-label="Close share dialog"
          className="absolute top-5 right-5 p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/40"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-6 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-[var(--accent-peach)]/15 text-[var(--accent-peach)] flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <h3
              id="share-modal-title"
              className="text-lg font-bold font-fraunces leading-tight text-[var(--text-primary)]"
            >
              Share Note
            </h3>
            <p className="font-mono text-xs text-[var(--text-muted)] truncate mt-1 max-w-xs">
              {sharingNote.title || "Untitled Note"}
            </p>
          </div>
        </div>

        {/* Share link */}
        <div className="mb-5">
          <label
            htmlFor="share-url"
            className="block font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2"
          >
            Public Share URL
          </label>

          <div className="flex items-center gap-2">
            <input
              id="share-url"
              type="text"
              readOnly
              value={
                shareLink ||
                (loading
                  ? "Generating link..."
                  : isRevoked
                    ? "Link cleared"
                    : "Link unavailable")
              }
              onFocus={(e) => e.target.select()}
              className="min-w-0 flex-1 px-3.5 py-3 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-secondary)] outline-none focus:border-[var(--accent-peach)]/50 font-mono"
            />

            <button
              type="button"
              disabled={!shareLink || isRevoked || loading}
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-semibold bg-[var(--accent-peach)] text-[var(--bg-base)] transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/40 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="mt-2 text-[11px] text-[var(--text-muted)] leading-relaxed">
            Anyone with this link may be able to access your shared note.
          </p>
        </div>

        {/* Permission and expiry */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] mb-5">
          <div>
            <label className="block font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2">
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[var(--accent-peach)]" />
                Access Permission
              </span>
            </label>

            <div className="flex gap-1.5">
              <button
                type="button"
                aria-pressed={permission === "view"}
                onClick={() => setPermission("view")}
                className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/40 ${
                  permission === "view"
                    ? selectedOption
                    : unselectedOption
                }`}
              >
                View Only
              </button>

              <button
                type="button"
                aria-pressed={permission === "edit"}
                onClick={() => setPermission("edit")}
                className={`flex-1 py-2 px-2 rounded-lg text-[11px] font-semibold border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/40 ${
                  permission === "edit"
                    ? selectedOption
                    : unselectedOption
                }`}
              >
                Can Edit*
              </button>
            </div>

            <p className="text-[10px] text-[var(--text-muted)] mt-2">
              *Beta option; backend support required.
            </p>
          </div>

          <div>
            <label
              htmlFor="share-expiry"
              className="block font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-2"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                Link Expiry
              </span>
            </label>

            <select
              id="share-expiry"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full py-2 px-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-xs font-medium outline-none focus:border-[var(--accent-peach)]/50 focus:ring-2 focus:ring-[var(--accent-peach)]/10"
            >
              <option value="never">Never expires</option>
              <option value="7d">Expires in 7 days</option>
              <option value="30d">Expires in 30 days</option>
            </select>

            <p className="text-[10px] text-[var(--text-muted)] mt-2">
              Expiry requires backend support.
            </p>
          </div>
        </div>

        {/* Social sharing */}
        <div className="mb-6">
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--text-muted)] mb-3">
            Share with classmates
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              disabled={!shareLink || isRevoked || loading}
              onClick={() => handleSocialShare("whatsapp")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold bg-[var(--accent-peach)]/10 text-[var(--accent-peach)] border border-[var(--accent-peach)]/30 hover:bg-[var(--accent-peach)]/20 transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-peach)]/40"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp
            </button>

            <button
              type="button"
              disabled={!shareLink || isRevoked || loading}
              onClick={() => handleSocialShare("twitter")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-subtle)]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Twitter / X
            </button>

            <button
              type="button"
              disabled={!shareLink || isRevoked || loading}
              onClick={() => handleSocialShare("email")}
              className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-hover)] transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-subtle)]"
            >
              Email Note
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--border-subtle)] pt-4">
          <button
            type="button"
            onClick={handleRevoke}
            disabled={!shareLink || loading || isRevoked}
            className="text-xs text-[var(--color-destructive)] hover:opacity-80 font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-destructive)]/40 rounded-md"
          >
            Revoke Access
          </button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSharingNote(null)}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
