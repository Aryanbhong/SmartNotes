const express = require("express");
const auth = require("../middleware/auth");
const { createNote, getNotes, updateNote, deleteNote, toggleFavorite,togglePin , generateSummary, suggestTags, suggestTagsFromContent ,createShareLink, getSharedNote } = require("../controlers/noteControler");

const router = express.Router();
router.post("/", auth, createNote);
router.get("/", auth, getNotes);
router.post("/:id/share", createShareLink);
router.put("/:id", auth, updateNote);
router.delete("/:id", auth, deleteNote);
router.patch("/:id/favorite", toggleFavorite);
router.patch('/:id/pin', togglePin);
router.post("/:id/summary", generateSummary);
router.post("/:id/suggest-tags", suggestTags);
router.post("/suggest-tags", suggestTagsFromContent); // NEW for unsaved notes
router.get("/shared/:shareId", getSharedNote);


module.exports = router;
