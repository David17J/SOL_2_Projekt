class Note {
  constructor(id, title, description = "", status = "offen") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.status = status;
  }
}

module.exports = Note;
