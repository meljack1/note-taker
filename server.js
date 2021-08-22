const express = require("express");
const path = require('path');
const apiRoutes = require("./routes/notes.js");

const PORT = process.env.port || 3001;
const app = express();

// Middleware - accept json and url encoded data, and take static assets from ./public
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use("/api/notes", apiRoutes)

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);