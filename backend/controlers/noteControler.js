

import prisma from "../config/Db.js";
import { v4 as uuidv4 } from "uuid";
import { CohereClient } from "cohere-ai";


const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});


// export const generateSummary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
//     if (!note) return res.status(404).json({ message: "Note not found" });

//     const response = await cohere.summarize({
//       text: note.content,
//       length: "auto",
//       format: "paragraph",
//       extractiveness: "auto",
//     });

//     const summary = response?.summary;
//     if (!summary) {
//       throw new Error("No summary returned from Cohere.");
//     }

//     const updatedNote = await prisma.note.update({
//       where: { id: note.id },
//       data: { summary },
//     });

//     return res.status(200).json({ success: true, summary, note: updatedNote });
//   } catch (error) {
//     console.error("Cohere Summary Error:", error);
//     return res.status(500).json({ message: "Failed to generate summary", error: error.message });
//   }
// };



export const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const prompt = `
      Summarize the following note into a short paragraph.
      - Do NOT add new information.
      - Keep meaning intact.
      - Friendly and simple tone.

      Note content:
      ${note.content}
    `;

    const response = await cohere.chat({
      model: "command-a-03-2025",      // FREE MODEL
      message: prompt               // MUST be a STRING, nothing else.
    });

    // NEW SDK RESPONSE FORMAT
    const summary = response?.text?.trim();

    if (!summary) throw new Error("Cohere returned no summary");

    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: { summary },
    });

    return res.status(200).json({
      success: true,
      summary,
      note: updatedNote,
    });

  } catch (error) {
    console.error("Cohere Summary Error:", error);
    return res.status(500).json({
      message: "Failed to generate summary",
      error: error.message,
    });
  }
};

// export const suggestTags = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
//     if (!note) return res.status(404).json({ message: "Note not found" });

//     const prompt = `Extract 3-5 short, single-word or hyphenated tags that describe the following note. Lowercase, comma-separated.\n\n${note.content}`;

//     const cohereResponse = await cohere.generate({
//       model: "command-xlarge",
//       prompt,
//       max_tokens: 60,
//       temperature: 0.6,
//     });

//     const raw = cohereResponse.body.generations[0].text.trim();
//     const tags = raw.split(/,|\n/).map(tag => tag.trim().toLowerCase()).filter(Boolean);

//     return res.status(200).json({ success: true, tags });
//   } catch (error) {
//     console.error("Cohere Tag Suggestion Error:", error);
//     return res.status(500).json({
//       message: "Failed to suggest tags",
//       error: error.message,
//     });
//   }
// };


export const suggestTags = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id: parseInt(id) },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    const userPrompt = `
      Extract 3–5 short lowercase tags from the note.
      Rules:
      - One word or hyphenated
      - No sentences
      - Return comma-separated

      Note:
      ${note.content}
    `;

    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: userPrompt,
    });

    const raw = response?.text?.trim();
    if (!raw) throw new Error("Cohere returned no tags");

    const tags = raw
      .split(/,|\n/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    return res.status(200).json({ success: true, tags });

  } catch (error) {
    console.error("Cohere Tag Suggestion Error:", error);
    return res.status(500).json({
      message: "Failed to suggest tags",
      error: error.message,
    });
  }
};

/* --------------------- TAG SUGGEST FROM CONTENT --------------------- */

// export const suggestTagsFromContent = async (req, res) => {
//   try {
//     const { content } = req.body;

//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Content is required" });
//     }

//     const prompt = `Extract 3-5 lowercase, single-word or hyphenated tags. Return ONLY comma-separated words:\n\n${content}`;

//     const response = await cohere.generate({
//       model: "command",
//       prompt,
//       max_tokens: 60,
//       temperature: 0.5,
//     });

//     const raw = response?.generations?.[0]?.text?.trim();
//     if (!raw) throw new Error("Cohere returned no tag list");

//     const tags = raw
//       .split(/,|\n/)
//       .map((t) => t.trim().toLowerCase())
//       .filter(Boolean);

//     return res.status(200).json({ success: true, tags });
//   } catch (error) {
//     console.error("Cohere Tag Suggestion (content) Error:", error);
//     return res.status(500).json({
//       message: "Failed to suggest tags",
//       error: error.message,
//     });
//   }
// };

// export const suggestTagsFromContent = async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Content is required." });
//     }

//     const prompt = `Extract 3-5 lowercase, single-word or hyphenated tags that describe the following note. Output ONLY a comma-separated list of tags, each starting with '#', and no extra text:\n\n${content}`;

//     const response = await cohere.generate({
//       model: "command",
//       prompt,
//       max_tokens: 60,
//       temperature: 0.6,
//     });

//     const raw = response.generations?.[0]?.text?.trim();
//     if (!raw) throw new Error("No generations returned.");

//     const cleaned = raw
//       .replace(/^.*?(?=#|\d+\.\s|[a-z\-]+,)/i, "")
//       .replace(/\d+\.\s*/g, "")
//       .trim();

//     const tags = cleaned
//       .split(/,|\n/)
//       .map(t => t.trim().toLowerCase())
//       .filter(Boolean)
//       .map(tag => tag.startsWith('#') ? tag : `#${tag}`);

//     return res.status(200).json({ success: true, tags });
//   } catch (error) {
//     console.error("Cohere Tag Suggestion (content) Error:", error);
//     return res.status(500).json({ message: "Failed to suggest tags", error: error.message });
//   }
// };


export const suggestTagsFromContent = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }

    const userPrompt = `
      Extract 3–5 tags from the following note.
      Rules:
      - Only lowercase
      - Single word or hyphenated
      - No sentences
      - Return comma-separated only

      Note content:
      ${content}
    `;

    // FIX: cohere.chat() requires "message", not "messages"
    const response = await cohere.chat({
      model: "command-a-03-2025",
      message: userPrompt,
    });

    const raw = response?.text?.trim();
    if (!raw) throw new Error("Cohere returned no tags");

    const tags = raw
      .split(/,|\n/)
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    return res.status(200).json({ success: true, tags });

  } catch (error) {
    console.error("Cohere Tag Suggestion (content) Error:", error);
    return res.status(500).json({
      message: "Failed to suggest tags",
      error: error.message,
    });
  }
};
 

// check();

/* ----------------------------- HELPERS ----------------------------- */

const toInt = (v) => {
  const n = parseInt(v, 10);
  return Number.isNaN(n) ? null : n;
};

const normalizeTags = (tags) => {
  if (!tags) return undefined;
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    return tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return undefined;
};

/* ------------------------- CREATE NOTE ------------------------- */

export const createNote = async (req, res) => {
  try {
    const { title, content, tags, pinned, favorite } = req.body;
    const userId = req.user?.id;

    if (!title || !content || !userId) {
      return res.status(400).json({
        message: "Title, content, and userId are required",
      });
    }

    let tagArray = normalizeTags(tags) || [];

    const note = await prisma.note.create({
      data: {
        title,
        content,
        userId: parseInt(userId, 10),
        tags: tagArray,
        pinned: Boolean(pinned),
        favorite: Boolean(favorite),
      },
    });

    return res.status(201).json({ success: true, note });
  } catch (error) {
    console.error("Create Note Error:", error);
    return res.status(500).json({
      message: "Failed to create note",
      error: error.message,
    });
  }
};

/* ------------------------- GET NOTES ------------------------- */

export const getNotes = async (req, res) => {
  try {
    const authUserId = req.user?.id;

    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { search = "", tag } = req.query;

    const where = { userId: authUserId };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    if (tag) {
      where.tags = { has: tag };
    }

    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Get Notes Error:", error);
    return res.status(500).json({
      message: "Failed to fetch notes",
      error: error.message,
    });
  }
};

/* ------------------------- UPDATE NOTE ------------------------- */

export const updateNote = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;

    const noteId = toInt(id);
    if (!noteId) return res.status(400).json({ message: "Invalid note id" });

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { title, content, tags, pinned, favorite } = req.body;

    const data = {};
    if (typeof title === "string") data.title = title;
    if (typeof content === "string") data.content = content;

    const normTags = normalizeTags(tags);
    if (normTags) data.tags = normTags;

    if (typeof pinned === "boolean") data.pinned = pinned;
    if (typeof favorite === "boolean") data.favorite = favorite;

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data,
    });

    return res.status(200).json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("Update Note Error:", error);
    return res.status(500).json({
      message: "Failed to update note",
      error: error.message,
    });
  }
};

/* ------------------------- DELETE NOTE ------------------------- */

export const deleteNote = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;

    const noteId = toInt(id);
    if (!noteId) return res.status(400).json({ message: "Invalid note id" });

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await prisma.note.delete({ where: { id: noteId } });

    return res.status(200).json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error("Delete Note Error:", error);
    return res.status(500).json({
      message: "Failed to delete note",
      error: error.message,
    });
  }
};

/* ------------------------- PIN / FAVORITE ------------------------- */

export const togglePin = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;

    const noteId = toInt(id);
    if (!noteId) return res.status(400).json({ message: "Invalid note id" });

    const existing = await prisma.note.findUnique({ where: { id: noteId } });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { pinned: !existing.pinned },
    });

    return res.status(200).json({ success: true, note: updated });
  } catch (error) {
    console.error("togglePin error:", error);
    return res.status(500).json({
      message: "Failed to toggle pin",
      error: error.message,
    });
  }
};

export const toggleFavorite = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;

    const noteId = toInt(id);
    if (!noteId) return res.status(400).json({ message: "Invalid note id" });

    const existing = await prisma.note.findUnique({ where: { id: noteId } });

    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { favorite: !existing.favorite },
    });

    return res.status(200).json({ success: true, note: updated });
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res.status(500).json({
      message: "Failed to toggle favorite",
      error: error.message,
    });
  }
};

/* ------------------------- SHARE LINK ------------------------- */

export const createShareLink = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: { shareId: note.shareId || uuidv4() },
    });

    res.json({ shareId: updatedNote.shareId });
  } catch (error) {
    console.error("Error creating share link:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getSharedNote = async (req, res) => {
  try {
    const { shareId } = req.params;

    const note = await prisma.note.findUnique({
      where: { shareId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({
      title: note.title,
      content: note.content,
      tags: note.tags,
      createdAt: note.createdAt,
    });
  } catch (error) {
    console.error("Error retrieving shared note:", error);
    res.status(500).json({ message: "Server error" });
  }
};
