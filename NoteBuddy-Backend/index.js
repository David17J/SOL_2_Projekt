const express = require("express");
const cors = require("cors");
const notesRoutes = require("./routes/notes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Routen
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
