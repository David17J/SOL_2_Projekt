// const Note = require("./models/Note");
const notesDiv = document.getElementById("notes");
const form = document.getElementById("noteForm");

function loadNotes() {
  fetch("http://localhost:3000/api/notes")
    .then((res) => res.json())
    .then((notes) => {
      notesDiv.innerHTML = "";
      notes.forEach((note) => {
        const div = document.createElement("div");
        div.classList.add("todo-item"); // Klasse hinzufügen für Drag & Drop Styling
        div.setAttribute("draggable", "true"); // Drag & Drop aktivieren
        div.innerHTML = `<h3>${note.title}</h3><p>${note.description}</p>`;
        notesDiv.appendChild(div);
      });
      addDragAndDropListeners();
    });
}

function createNote2() {
  const newNote = new Note(
    2323,
    "Einkaufsliste",
    "Hallo ich eine Beschreibung",
    status || "offen"
  );
  createNote(newNote);
}
function createNote(note) {
  fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(note),
  })
    .catch((ex) => {
      console.log(ex);
    })
    .then(() => {
      // form.reset();
      loadNotes();
    });
}
// form.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const title = document.getElementById("title").value;
//   const content = document.getElementById("content").value;
//   fetch("http://localhost:3000/api/notes", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title, content }),
//   }).then(() => {
//     form.reset();
//     loadNotes();
//   });
// });

// loadNotes();

class Note {
  constructor(id, title, description = "", status = "offen") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}
