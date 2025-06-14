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
  var newNote2 = req.body;
  var note;
  if(newNote2.id === undefined){
    note = new Note(Date.now(), title, description, status || "offen");
    notes.push(note);
  }
  else{
    note = notes.find(n => n.id === id);
    newNote2.title = note.title;
    newNote2.status = note.status;
    newNote2.description = note.description;
  }
  saveNotes(notes);
  res.status(201).json(note);
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

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Notiz abrufen
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Die ID der Note
 *     responses:
 *       200:
 *         description: Erfolgreich geliefert
 */
router.get("/:id", (req, res) => {
  try {
    // 1. ID validieren
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Ungültige ID" });
    }

    // 2. Notes laden
    const notes = loadNotes();

    // 3. Note suchen (strict equality für Typensicherheit)
    const note = notes.find(n => n.id === id);

    if (!note) {
      return res.status(404).json({
        error: "Note nicht gefunden",
        suggestion: "Überprüfen Sie die ID oder laden Sie alle Notes mit GET /api/notes"
      });
    }

    // 4. Erfolgsantwort
    res.json({
      status: "success",
      data: {
        note:note
      }
    });

  } catch (error) {
    console.error("Fehler in /api/notes/:id:", error);
    res.status(500).json({
      error: "Interner Serverfehler",
      details: error.message
    });
  }
});

module.exports = router;
