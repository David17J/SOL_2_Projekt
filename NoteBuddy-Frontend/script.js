const API_URL = "http://localhost:3000/api/notes";

// --- Utils ---
function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}
function openModal(html) {
  const modal = document.getElementById("modal");
  modal.innerHTML = `<div class="modal-content">${html}</div>`;
  modal.classList.remove("hidden");
  // Modal schließt sich bei Klick außerhalb
  modal.onclick = (e) => {
    if (e.target === modal) closeModal();
  };
}

// --- Notizen laden und anzeigen ---
async function loadNotes() {
  const res = await fetch(API_URL);
  const notes = await res.json();
  renderNotes(notes);
}
function renderNotes(notes) {
  const container = document.getElementById("notes-container");
  container.innerHTML = "";
  notes.forEach((note) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
            <div class="actions">
                <button title="Bearbeiten" onclick="editNote(${
                  note.id
                })">✏️</button>
                <button title="Löschen" onclick="deleteNote(${
                  note.id
                })">🗑️</button>
            </div>
            <h2>${note.title}</h2>
            <div class="desc">${note.description || ""}</div>
            <div class="meta">Status: ${note.status || "offen"}</div>
        `;
    container.appendChild(card);
  });
}

// --- Notiz erstellen ---
document.getElementById("add-note-btn").onclick = () => {
  openModal(`
        <h3>Neue Notiz</h3>
        <form id="note-form">
            <input required name="title" placeholder="Titel" style="width:98%"><br><br>
            <textarea name="description" placeholder="Beschreibung" rows="3" style="width:98%"></textarea><br><br>
            <select name="status">
                <option value="offen">offen</option>
                <option value="in Bearbeitung">in Bearbeitung</option>
                <option value="fertig">fertig</option>
            </select>
            <br><br>
            <button type="submit">Erstellen</button>
            <button type="button" onclick="closeModal()">Abbrechen</button>
        </form>
    `);
  document.getElementById("note-form").onsubmit = async function (e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const note = {
      title: fd.get("title"),
      description: fd.get("description"),
      status: fd.get("status"),
    };
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(note),
    });
    closeModal();
    loadNotes();
  };
};

// --- Notiz bearbeiten ---
window.editNote = async function (id) {
  const res = await fetch(API_URL);
  const notes = await res.json();
  const note = notes.find((n) => n.id == id);
  openModal(`
        <h3>Notiz bearbeiten</h3>
        <form id="note-form">
            <input required name="title" value="${
              note.title
            }" style="width:98%"><br><br>
            <textarea name="description" rows="3" style="width:98%">${
              note.description || ""
            }</textarea><br><br>
            <select name="status">
                <option value="offen" ${
                  note.status === "offen" ? "selected" : ""
                }>offen</option>
                <option value="in Bearbeitung" ${
                  note.status === "in Bearbeitung" ? "selected" : ""
                }>in Bearbeitung</option>
                <option value="fertig" ${
                  note.status === "fertig" ? "selected" : ""
                }>fertig</option>
            </select>
            <br><br>
            <button type="submit">Speichern</button>
            <button type="button" onclick="closeModal()">Abbrechen</button>
        </form>
    `);
  document.getElementById("note-form").onsubmit = async function (e) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newNote = {
      title: fd.get("title"),
      description: fd.get("description"),
      status: fd.get("status"),
    };
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    closeModal();
    loadNotes();
  };
};

// --- Notiz löschen ---
window.deleteNote = async function (id) {
  if (!confirm("Wirklich löschen?")) return;
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadNotes();
};

loadNotes();
