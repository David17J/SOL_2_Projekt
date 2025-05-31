const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const Note = require("../models/Note");

const DATA_FILE = path.join(__dirname, "../notes.json");

// Hilfsfunktionen
function loadNotes() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}
function saveNotes(notes) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(notes, null, 2));
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           description: Die ID der Note
 *         title:
 *           type: string
 *           description: Der Titel der Note
 *         description:
 *           type: string
 *           description: Beschreibung der Note
 *         status:
 *           type: string
 *           description: Status (offen, in Bearbeitung, fertig)
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Holt alle Notizen
 *     tags: [Notes]
 *     responses:
 *       200:
 *         description: Eine Liste aller Notizen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 */
router.get("/", (req, res) => {
  const notes = loadNotes();
  res.json(notes);
});

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Neue Notiz anlegen
 *     tags: [Notes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       201:
 *         description: Die erstellte Notiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 */
router.post("/", (req, res) => {
  const notes = loadNotes();
  const { title, description, status } = req.body;
  const newNote = new Note(Date.now(), title, description, status || "offen");
  notes.push(newNote);
  saveNotes(notes);
  res.status(201).json(newNote);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Notiz bearbeiten
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Die ID der Note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Note'
 *     responses:
 *       200:
 *         description: Die bearbeitete Notiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       404:
 *         description: Notiz nicht gefunden
 */
router.put("/:id", (req, res) => {
  const notes = loadNotes();
  const noteIndex = notes.findIndex((n) => n.id == req.params.id);
  if (noteIndex === -1) return res.status(404).send("Notiz nicht gefunden.");

  const { title, description, status } = req.body;
  notes[noteIndex] = { ...notes[noteIndex], title, description, status };
  saveNotes(notes);
  res.json(notes[noteIndex]);
});

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Notiz löschen
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Die ID der Note
 *     responses:
 *       204:
 *         description: Erfolgreich gelöscht (kein Inhalt)
 */
router.delete("/:id", (req, res) => {
  let notes = loadNotes();
  notes = notes.filter((n) => n.id != req.params.id);
  saveNotes(notes);
  res.status(204).end();
});

module.exports = router;
