import React from "react";

/**
 * TwoDo Signature Logo Mark:
 * Two overlapping circles (Sage + Peach) with a small Heart in the center intersection.
 */
export const TwoDoLogo = ({ size = 28, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="SmartNotes Logo"
    >
      {/* Sage Circle (Left) */}
      <circle cx="12" cy="16" r="10" fill="#5C6E4E" fillOpacity="0.85" />
      {/* Peach Circle (Right) */}
      <circle cx="20" cy="16" r="10" fill="#E8A87C" fillOpacity="0.85" />
      {/* Heart / Terracotta Intersection Spark */}
      <circle cx="16" cy="16" r="4" fill="#C1633C" />
    </svg>
  );
};

/**
 * Success Bloom:
 * A single calm bloom in heart color (soft scale + fade of a heart or check).
 * The ONLY celebration in the app.
 */
export const SuccessBloom = ({ children, className = "" }) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[var(--accent-heart)] bg-[var(--accent-heart-bg)] px-2.5 py-1 rounded-full border border-[var(--accent-heart)]/40 animate-heart-bloom ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-heart)]" />
      {children || "Done"}
    </span>
  );
};

export const Badge = ({
  children,
  variant = "default",
  size = "sm",
  mono = false,
  className = "",
  onClick,
}) => {
  const base =
    "inline-flex items-center rounded-full font-medium transition-colors select-none";

  const fontClass = mono ? "font-mono uppercase tracking-wider" : "font-sans";

  const sizes = {
    xs: "text-[10px] px-2 py-0.5 gap-1",
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-2",
  };

  const variants = {
    // Default neutral warm surface
    default:
      "bg-[var(--bg-surface-raised)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    // Sage -> user's own content & selected items
    sage:
      "bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] border border-[var(--accent-sage-border)]",
    primary:
      "bg-[var(--accent-sage-bg)] text-[var(--accent-sage)] border border-[var(--accent-sage-border)]",
    // Peach -> collaborative / shared content
    peach:
      "bg-[var(--accent-peach-bg)] text-[var(--accent-peach)] border border-[var(--accent-peach-border)]",
    shared:
      "bg-[var(--accent-peach-bg)] text-[var(--accent-peach)] border border-[var(--accent-peach-border)]",
    // Gold -> AI ONLY (summary, OCR, tags)
    gold:
      "bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)]",
    ai:
      "bg-[var(--accent-gold-bg)] text-[var(--accent-gold)] border border-[var(--accent-gold-border)]",
    // Heart -> success / done moments only
    heart:
      "bg-[var(--accent-heart-bg)] text-[var(--accent-heart)] border border-[var(--accent-heart)]/30",
    success:
      "bg-[var(--accent-heart-bg)] text-[var(--accent-heart)] border border-[var(--accent-heart)]/30",
    // Muted red destructive
    danger:
      "bg-[var(--color-destructive-bg)] text-[var(--color-destructive)] border border-[var(--color-destructive-border)]",
  };

  const interactive = onClick
    ? "cursor-pointer hover:opacity-90 active:scale-95"
    : "";

  return (
    <span
      onClick={onClick}
      className={`${base} ${fontClass} ${sizes[size]} ${variants[variant] || variants.default} ${interactive} ${className}`}
    >
      {children}
    </span>
  );
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  icon: Icon,
  type = "button",
  onClick,
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-sage)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)] disabled:opacity-40 disabled:cursor-not-allowed select-none min-h-[38px]";

  const sizes = {
    xs: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
    sm: "text-xs px-3.5 py-2 gap-1.5 min-h-[36px]",
    md: "text-sm px-4.5 py-2.5 gap-2 min-h-[42px]",
    lg: "text-base px-6 py-3.5 gap-2.5 rounded-full font-semibold min-h-[48px]",
    icon: "p-2 rounded-full min-h-[36px] min-w-[36px]",
  };

  const variants = {
    // Sage -> Primary actions (New note, save, confirm)
    primary:
      "bg-[#5C6E4E] hover:bg-[#4E5E42] text-[#F6F2E9] shadow-xs active:scale-[0.98]",
    sage:
      "bg-[#5C6E4E] hover:bg-[#4E5E42] text-[#F6F2E9] shadow-xs active:scale-[0.98]",
    // Secondary warm card
    secondary:
      "bg-[var(--bg-surface-raised)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] border border-[var(--border-default)] active:scale-[0.98]",
    outline:
      "border border-[var(--border-default)] hover:border-[var(--border-strong)] bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
    ghost:
      "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]",
    // Peach -> Shared actions
    peach:
      "bg-[var(--accent-peach-bg)] hover:opacity-90 text-[var(--accent-peach)] border border-[var(--accent-peach-border)]",
    // Gold -> AI actions (Summarize, OCR)
    gold:
      "bg-[var(--accent-gold-bg)] hover:opacity-90 text-[var(--accent-gold)] border border-[var(--accent-gold-border)]",
    // Destructive muted red
    danger:
      "bg-[var(--color-destructive-bg)] hover:opacity-90 text-[var(--color-destructive)] border border-[var(--color-destructive-border)]",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : Icon ? (
        <Icon className={size === "lg" ? "w-5 h-5" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
      ) : null}
      {children}
    </button>
  );
};

export const Card = ({
  children,
  className = "",
  hover = false,
  raised = false,
  onClick,
  ...props
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-3xl transition-all duration-200 ${
        raised
          ? "bg-[var(--bg-surface-raised)] border border-[var(--border-subtle)]"
          : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
      } ${hover ? "hover:border-[var(--border-default)] hover:bg-[var(--bg-surface-hover)] cursor-pointer" : ""} ${className}`}
      style={{ boxShadow: "var(--card-shadow)" }}
      {...props}
    >
      {children}
    </div>
  );
};

export const Avatar = ({ name = "User", size = "md", src, className = "" }) => {
  const getInitials = (n) => {
    if (!n) return "SN";
    const parts = n.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return n.slice(0, 2).toUpperCase();
  };

  const sizes = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm font-semibold",
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover border border-[var(--border-default)] ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-[var(--bg-surface-raised)] border border-[var(--border-default)] text-[var(--text-secondary)] font-mono flex items-center justify-center select-none ${className}`}
    >
      {getInitials(name)}
    </div>
  );
};
