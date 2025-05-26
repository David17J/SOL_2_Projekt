const express = require("express");
const router = express.Router();
const Note = require("../models/Note");

let notes = [];
let idCounter = 1;

// Alle Notizen abrufen
router.get("/", (req, res) => {
  res.json(notes);
});

// Neue Notiz erstellen
router.post("/", (req, res) => {
  const { title, content } = req.body;
  const newNote = new Note(idCounter++, title, content);
  notes.push(newNote);
  res.status(201).json(newNote);
});

// Eine Notiz löschen
router.delete("/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  notes = notes.filter((n) => n.id !== noteId);
  res.status(204).send();
});

// Eine Notiz aktualisieren
router.put("/:id", (req, res) => {
  const noteId = parseInt(req.params.id);
  const { title, content } = req.body;

  const note = notes.find((n) => n.id === noteId);
  if (!note) return res.status(404).json({ message: "Notiz nicht gefunden" });

  note.title = title;
  note.content = content;
  res.json(note);
});

module.exports = router;
