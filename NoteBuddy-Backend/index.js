const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Swagger-Konfiguration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notebuddy API",
      version: "1.0.0",
      description: "API für das Notebuddy-Projekt",
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
  },
  apis: ["./routes/*.js"], // Sucht Swagger-Kommentare in deinen Routen
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routen einbinden
const notesRouter = require("./routes/notes");
app.use("/api/notes", notesRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`NoteBuddy Backend läuft auf http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});

//Test
