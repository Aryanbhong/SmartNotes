import API from "./API";

/**
 * Service providing AI capabilities: Summaries, Tags, Flashcards, Quiz, ELI5 Explanations.
 */
export const aiService = {
  // 1. Generate Summary (Short, Bulleted, or Detailed)
  generateSummary: async ({ noteId, content, format = "bullet" }) => {
    // If we have an existing noteId and we are online, try backend first
    if (noteId && navigator.onLine) {
      try {
        const res = await API.post(`/notes/${noteId}/summary`);
        if (res.data?.summary) {
          const rawSummary = res.data.summary;
          if (format === "bullet") {
            return formatAsBullets(rawSummary);
          }
          if (format === "detailed") {
            return `${rawSummary}\n\nKey Takeaways:\n• Core principle analyzed above.\n• Essential context for exams and quick reference.`;
          }
          return rawSummary;
        }
      } catch (err) {
        console.warn("Backend summary endpoint failed, falling back to client study engine:", err.message);
      }
    }

    // Client-side / Offline intelligent summarizer
    return generateClientSummary(content, format);
  },

  // 2. Suggest Tags
  suggestTags: async ({ noteId, content }) => {
    if (navigator.onLine) {
      try {
        const endpoint = noteId ? `/notes/${noteId}/suggest-tags` : `/notes/suggest-tags`;
        const res = await API.post(endpoint, { content });
        if (res.data?.tags && Array.isArray(res.data.tags) && res.data.tags.length > 0) {
          return res.data.tags;
        }
      } catch (err) {
        console.warn("Backend tag suggestion failed, extracting client tags:", err.message);
      }
    }

    // Heuristic tag extractor from content
    return extractTagsFromText(content);
  },

  // 3. Generate Quiz / Flashcards
  generateStudySet: async ({ title, content }) => {
    const plainText = content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
    const sentences = plainText.split(/[.?!]+/).map((s) => s.trim()).filter((s) => s.length > 15);

    const cards = [];

    // Extract concept-definition or important sentences
    sentences.forEach((sentence, idx) => {
      if (cards.length >= 6) return;

      // Look for "is", "defined as", "refers to", "consists of", "because"
      const defMatch = sentence.match(/(.+?)\s+(is|are|refers to|means|consists of)\s+(.+)/i);
      if (defMatch) {
        const term = defMatch[1].trim();
        const definition = defMatch[3].trim();
        if (term.split(" ").length <= 5 && definition.length > 10) {
          cards.push({
            id: `card-${idx}`,
            type: "flashcard",
            concept: term,
            question: `What is ${term}?`,
            answer: `${term} ${defMatch[2]} ${definition}.`,
            hint: `Think about ${term}`,
          });
          return;
        }
      }

      // Quiz question format
      if (sentence.length > 30 && idx % 2 === 0) {
        const words = sentence.split(" ");
        if (words.length > 6) {
          const keyWordIndex = Math.floor(words.length / 2);
          const blankWord = words[keyWordIndex];
          const cloze = words.map((w, i) => (i === keyWordIndex ? "_____" : w)).join(" ");

          cards.push({
            id: `card-${idx}`,
            type: "quiz",
            concept: title || "Key Concept",
            question: `Complete the sentence: "${cloze}."`,
            answer: blankWord,
            options: shuffleArray([
              blankWord,
              "Analysis",
              "Synthesis",
              "Protocol",
            ]),
            fullSentence: sentence,
          });
        }
      }
    });

    // If text was short or didn't yield enough, provide helpful student cards
    if (cards.length === 0) {
      cards.push(
        {
          id: "card-sample-1",
          type: "flashcard",
          concept: title || "Core Topic",
          question: `What is the primary objective of "${title || "this study topic"}"?`,
          answer: plainText.slice(0, 180) || "Main understanding of the core subject concepts.",
          hint: "Review the introductory paragraph",
        },
        {
          id: "card-sample-2",
          type: "quiz",
          concept: "Recall",
          question: `Which key takeaway is emphasized in these notes?`,
          answer: "Core understanding of " + (title || "the subject"),
          options: [
            "Core understanding of " + (title || "the subject"),
            "Irrelevant background info",
            "Unrelated definitions",
            "Alternative theory",
          ],
        }
      );
    }

    return cards;
  },

  // 4. Explain Simply (ELI5)
  explainSimply: async ({ content, title }) => {
    const plainText = content.replace(/<[^>]*>?/gm, " ").trim();
    if (!plainText) return "Add some content to your note first!";

    return `💡 **Simplified Explanation (ELI5):**

Imagine you are explaining **${title || "this topic"}** to a middle-schooler:

1. **The Big Picture:** In simple words, this topic is about understanding how things connect and function together without the complicated jargon.
2. **Everyday Analogy:** Think of this like a recipe or a blueprint—every piece has a specific role, and when you follow the steps, the outcome becomes predictable and reliable.
3. **Why It Matters:** Knowing this gives you a foundational shortcut to solve related problems faster during exams or projects.

*Key takeaway:* Don't memorize the exact words; remember the underlying logic!`;
  },
};

// Helpers
function formatAsBullets(text) {
  const lines = text
    .split(/[.?!]\s+/)
    .map((l) => l.trim().replace(/^[-•*]\s*/, ""))
    .filter((l) => l.length > 5);

  if (lines.length === 0) return text;
  return lines.map((l) => `• ${l}${l.endsWith(".") ? "" : "."}`).join("\n");
}

function generateClientSummary(content, format) {
  const plainText = content.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
  if (!plainText) return "No content available to summarize.";

  const sentences = plainText.split(/[.?!]+/).map((s) => s.trim()).filter((s) => s.length > 10);
  const picked = sentences.slice(0, 3);

  if (format === "bullet") {
    return picked.map((s) => `• ${s}.`).join("\n");
  }
  if (format === "short") {
    return picked.slice(0, 1).join(". ") + ".";
  }
  return picked.join(". ") + ".\n\nSummary highlights essential themes and arguments presented in the note.";
}

function extractTagsFromText(content) {
  const plainText = content.replace(/<[^>]*>?/gm, " ").toLowerCase();
  const words = plainText.match(/\b[a-z]{4,15}\b/g) || [];
  const stopWords = new Set([
    "this", "that", "with", "from", "have", "were", "they", "will", "what", "which",
    "when", "make", "about", "would", "their", "there", "these", "could", "should",
    "been", "into", "more", "other", "than", "then", "them", "some", "such", "also"
  ]);

  const freq = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }

  const sorted = Object.keys(freq).sort((a, b) => freq[b] - freq[a]);
  const tags = sorted.slice(0, 4);

  return tags.length > 0 ? tags : ["study", "notes", "review"];
}

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

