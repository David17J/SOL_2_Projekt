const notesDiv = document.getElementById("notes");
const form = document.getElementById("noteForm");

function loadNotes() {
  fetch("http://localhost:3000/api/notes")
    .then((res) => res.json())
    .then((data) => {
      notesDiv.innerHTML = "";
      data.forEach((note) => {
        const div = document.createElement("div");
        div.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
        notesDiv.appendChild(div);
      });
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const content = document.getElementById("content").value;
  fetch("http://localhost:3000/api/notes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  }).then(() => {
    form.reset();
    loadNotes();
  });
});

loadNotes();
