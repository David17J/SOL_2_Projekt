class Note {
  constructor(id, title, content, createdAt = new Date()) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
  }
}

module.exports = Note;
