
import prisma from "../config/Db.js";
import { OpenAI } from "openai";

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// import { v4 as uuidv4 } from "uuid";

// export const generateSummary = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
//     if (!note) return res.status(404).json({ message: "Note not found" });

  
//     const prompt = `Summarize the following note in 2-3 concise sentences:\n\n${note.content}`;

//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 150,
//     });

//     const summary = aiResponse.choices[0].message.content.trim();

    
//     const updatedNote = await prisma.note.update({
//       where: { id: note.id },
//       data: { summary },
//     });

//     return res.status(200).json({ success: true, summary, note: updatedNote });
//   } catch (error) {
//     console.error("AI Summary Error:", error);
//     return res.status(500).json({ message: "Failed to generate summary", error: error.message });
//   }
// };


// export const suggestTags = async (req, res) => {
//   try {
//     const { id } = req.params;

 
//     const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
//     if (!note) return res.status(404).json({ message: "Note not found" });

   
//     const prompt = `Analyze the following note and suggest 3-5 single-word tags (like keywords) that describe its content:
//     \n\n${note.content}`;

   
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 100,
//     });

//     const rawTags = aiResponse.choices[0].message.content.trim();
//     const tags = rawTags.split(/,|\n/).map(tag => tag.trim()).filter(Boolean);

//     return res.status(200).json({ success: true, tags });
//   } catch (error) {
//     console.error("AI Tag Suggestion Error:", error);
//     return res.status(500).json({ message: "Failed to suggest tags", error: error.message });
//   }
// };

// export const suggestTagsFromContent = async (req, res) => {
//   try {
//     const { content } = req.body;
//     if (!content || !content.trim()) {
//       return res.status(400).json({ message: "Content is required." });
//     }

//     const prompt = `Extract 3-5 short, single-word or hyphenated tags that describe the following note. Lowercase, no #, comma separated.\n\n${content}`;

//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: prompt }],
//       max_tokens: 60,
//     });

//     const raw = aiResponse.choices?.[0]?.message?.content?.trim() || "";
//     const tags = raw
//       .split(/,|\n/)
//       .map((t) => t.trim().toLowerCase())
//       .filter(Boolean);

//     return res.status(200).json({ success: true, tags });
//   } catch (error) {
//     console.error("AI Tag Suggestion (content) Error:", error);
//     return res
//       .status(500)
//       .json({ message: "Failed to suggest tags", error: error.message });
//   }
// };


import { v4 as uuidv4 } from "uuid";

import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});


export const generateSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const cohereResponse = await cohere.summarize({
      text: note.content,
      length: "auto",
      format: "paragraph",
      extractiveness: "auto",
    });

    const summary = cohereResponse.body.summary;

    const updatedNote = await prisma.note.update({
      where: { id: note.id },
      data: { summary },
    });

    return res.status(200).json({ success: true, summary, note: updatedNote });
  } catch (error) {
    console.error("Cohere Summary Error:", error);
    return res.status(500).json({ message: "Failed to generate summary", error: error.message });
  }
};

export const suggestTags = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({ where: { id: parseInt(id) } });
    if (!note) return res.status(404).json({ message: "Note not found" });

    const prompt = `Extract 3-5 short, single-word or hyphenated tags that describe the following note. Lowercase, comma-separated.\n\n${note.content}`;

    const cohereResponse = await cohere.generate({
      model: "command-xlarge",
      prompt,
      max_tokens: 60,
      temperature: 0.6,
    });

    const raw = cohereResponse.body.generations[0].text.trim();
    const tags = raw.split(/,|\n/).map(tag => tag.trim().toLowerCase()).filter(Boolean);

    return res.status(200).json({ success: true, tags });
  } catch (error) {
    console.error("Cohere Tag Suggestion Error:", error);
    return res.status(500).json({ message: "Failed to suggest tags", error: error.message });
  }
};

export const suggestTagsFromContent = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required." });
    }

    const prompt = `Extract 3-5 short, single-word or hyphenated tags that describe the following note. Lowercase, comma-separated.\n\n${content}`;

    const cohereResponse = await cohere.generate({
      model: "command-xlarge",
      prompt,
      max_tokens: 60,
      temperature: 0.6,
    });

    const raw = cohereResponse.body.generations[0].text.trim();
    const tags = raw
      .split(/,|\n/)
      .map(t => t.trim().toLowerCase())
      .filter(Boolean);

    return res.status(200).json({ success: true, tags });
  } catch (error) {
    console.error("Cohere Tag Suggestion (content) Error:", error);
    return res.status(500).json({ message: "Failed to suggest tags", error: error.message });
  }
};


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


export const createNote = async (req, res) => {
  try {
    const { title, content, tags, pinned, favorite } = req.body;
    const userId = req.user?.id; // Extracted from auth middleware

    if (!title || !content || !userId) {
      return res
        .status(400)
        .json({ message: "Title, content, and userId are required" });
    }

    // Normalize tags
    let tagArray = [];
    if (Array.isArray(tags)) tagArray = tags;
    else if (typeof tags === "string") {
      tagArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

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
    return res
      .status(500)
      .json({ message: "Failed to create note", error: error.message });
  }
};


export const getNotes = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    if (!authUserId) {
      return res.status(401).json({ message: "Unauthorized." });
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
    return res
      .status(500)
      .json({ message: "Failed to fetch notes", error: error.message });
  }
};





export const updateNote = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;
    const noteId = toInt(id);
    if (!noteId) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    // Fetch existing to support partial update & user ownership
    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) {
      return res.status(404).json({ message: "Note not found." });
    }
    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized to edit this note." });
    }

    const {
      title,
      content,
      tags,
      pinned,
      favorite,
    } = req.body;

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
    return res
      .status(500)
      .json({ message: "Failed to update note", error: error.message });
  }
};



export const deleteNote = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;
    const noteId = toInt(id);
    if (!noteId) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const existing = await prisma.note.findUnique({ where: { id: noteId } });
    if (!existing) {
      return res.status(404).json({ message: "Note not found." });
    }
    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized to delete this note." });
    }

    await prisma.note.delete({ where: { id: noteId } });

    return res
      .status(200)
      .json({ success: true, message: "Note deleted" });
  } catch (error) {
    console.error("Delete Note Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to delete note", error: error.message });
  }
};



export const togglePin = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;
    const noteId = toInt(id);
    if (!noteId) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
    });
    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { pinned: !existing.pinned },
    });

    return res.status(200).json({ success: true, note: updated });
  } catch (error) {
    console.error("togglePin error:", error);
    return res
      .status(500)
      .json({ message: "Failed to toggle pin", error: error.message });
  }
};



export const toggleFavorite = async (req, res) => {
  try {
    const authUserId = req.user?.id;
    const { id } = req.params;
    const noteId = toInt(id);
    if (!noteId) {
      return res.status(400).json({ message: "Invalid note id." });
    }

    const existing = await prisma.note.findUnique({
      where: { id: noteId },
    });
    if (!existing) {
      return res.status(404).json({ message: "Note not found" });
    }
    if (authUserId && existing.userId !== authUserId) {
      return res.status(403).json({ message: "Not authorized." });
    }

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: { favorite: !existing.favorite },
    });

    return res.status(200).json({ success: true, note: updated });
  } catch (error) {
    console.error("toggleFavorite error:", error);
    return res
      .status(500)
      .json({ message: "Failed to toggle favorite", error: error.message });
  }
};


export const createShareLink = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    // // Ensure auth user matches note owner
    // if (!req.user || note.userId !== req.user.id) {
    //   return res.status(403).json({ message: "Not authorized" });
    // }
//     if (!req.user || parseInt(note.userId) !== parseInt(req.user.id)) {
//   return res.status(403).json({ message: "Not authorized" });
// }


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

// Retrieve a shared note
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