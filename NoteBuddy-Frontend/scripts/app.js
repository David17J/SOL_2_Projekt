// const Note = require("./models/Note");
const notesDiv = document.getElementById("notes");
const formElement = document.getElementById("noteForm");

function loadNotes() {
    fetch("http://localhost:3000/api/notes")
        .then((res) => res.json())
        .then((notes) => {
            notesDiv.innerHTML = "";
            notes.forEach((note) => {
                const div = document.createElement("div");
                div.classList.add("todo-item"); // Klasse hinzufügen für Drag & Drop Styling
                div.setAttribute("draggable", "true"); // Drag & Drop aktivieren
                div.innerHTML = `
        <div class="todo" onclick="loadNote(${note.id})">
          <div class="header-container">
            <div>${note.title}</div>
            <div>
              <img alt="menu" height="20" width="20" src="assets/three-dots.svg"/>
              <img alt="green-check" height="25" width="25" src="assets/status-${note.status}.svg"/>
            </div>
          </div>
          <div style="display: flex ;  align-items: center; ">
            <img alt="calender" height="25" width="25" src="assets/calendar.png"/>Termin hinzufügen
          </div>
        </div>
        `
                notesDiv.appendChild(div);
            });
            addDragAndDropListeners();
        });
}

function loadNote(noteId) {
    fetch(`http://localhost:3000/api/notes/${noteId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Note not found');
            }
            return response.json();
        })
        .then((response) => {

            // Clear previous content
            formElement.innerHTML = '';
            let note = response.data;
            // Create and populate note element
            let noteElement = document.createElement('div');
            noteElement.className = 'note-detail';
            noteElement.innerHTML = `
                
                
        <div class="task-header" style="align-content: space-between">
            <h1 class="window-title">${note.title || 'No Title'}</h1>
            <button class="close-button" onclick="">×</button>
        </div>

        <div class="window-content" style="display: flex; flex-direction: column">
            <div class="task-header2" style="display: flex; flex-direction: row">
                <div class=Status: ${note.status || 'unknown'}>
                    <p>Status</p>
                </div>
                <div class="status-group">
                    <div class="status-icons">
                        <img alt="Status-Icons1" height="25" width="25" src="assets/status-abgeschlossen.svg">
                        <img alt="Status-Icons3" height="25" width="25" src="assets/status-inbearbeitung.svg">
                        <img alt="Status-Icons2" height="25" width="25" src="assets/status-offen.svg">
                        <div class="btn-group" role="group" aria-label="Basic example">
                           <button type="button" class="btn btn-primary">
                           <i class="bi bi-check2-circle"></i>
</button>
                           <button type="button" class="btn btn-primary">Middle</button>
                           <button type="button" class="btn btn-primary">Right</button>
                    </div>
                    </div>
                </div>
                <div class="add-date-button">
                    <span class="calendar-icon">📅</span>
                    Termin hinzufügen
                </div>
            </div>

            <div class=${note.description || 'No Description'}>
                <p>Aufgabenbeschreibung</p>
                <textarea id="textinput" class="task-description-input" placeholder="Beschreibung eingeben..."></textarea>
            </div>
        </div>
            `;

            formElement.appendChild(noteElement);

            // Optional: Show the container if it was hidden
            formElement.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error loading note:', error);
            alert('Failed to load note: ' + error.message);
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
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(note),
    })
        .catch((ex) => {
            console.log(ex);
        })
        .then(() => {
            // formElement.reset();
            loadNotes();
        });
}

// formElement.addEventListener("submit", (e) => {
//   e.preventDefault();
//   const title = document.getElementById("title").value;
//   const content = document.getElementById("content").value;
//   fetch("http://localhost:3000/api/notes", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title, content }),
//   }).then(() => {
//     formElement.reset();
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
