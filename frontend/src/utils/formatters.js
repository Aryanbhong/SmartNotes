import { format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

export const formatRelativeTime = (dateInput) => {
  if (!dateInput) return "";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`;
    }
    if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`;
    }
    return format(date, "MMM d, yyyy");
  } catch {
    return "";
  }
};

export const formatNoteDate = (dateInput) => {
  if (!dateInput) return "";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    return format(date, "MMM d, yyyy • h:mm a");
  } catch {
    return "";
  }
};

export const getReadingStats = (htmlOrText = "") => {
  const plainText = htmlOrText.replace(/<[^>]*>?/gm, "").trim();
  const words = plainText.length > 0 ? plainText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const charCount = plainText.length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  return {
    wordCount,
    charCount,
    readingTimeMin,
    plainText,
  };
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "…";
};

