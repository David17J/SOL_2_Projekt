const API_URL = "http://localhost:3000/api/notes";
const notesList = document.getElementById("notesList");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
let editId = null;

// Notizen laden und anzeigen
async function loadNotes() {
  const response = await fetch(API_URL);
  const notes = await response.json();
  notesList.innerHTML = notes
    .map(
      (note) => `
        <li class="note-item">
            <span>${note.content}</span>
            <div>
                <button class="edit-btn" onclick="editNote('${note._id}', '${note.content}')">Bearbeiten</button>
                <button class="delete-btn" onclick="deleteNote('${note._id}')">Löschen</button>
            </div>
        </li>
    `
    )
    .join("");
}

// Notiz hinzufügen/bearbeiten
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = noteInput.value.trim();
  if (!content) return;

  if (editId) {
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
    editId = null;
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });
  }

  noteInput.value = "";
  loadNotes();
});

// Notiz bearbeiten
function editNote(id, content) {
  editId = id;
  noteInput.value = content;
  noteInput.focus();
}

// Notiz löschen
async function deleteNote(id) {
  if (confirm("Notiz wirklich löschen?")) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadNotes();
  }
}

// Initial laden
loadNotes();
