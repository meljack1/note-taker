const express = require("express");
const fs = require("fs");
const path = require('path');
const notesData = require('./db/db.json');
const uuid = require('./helpers/uuid');

const PORT = process.env.port || 3001;
const app = express();

// Middleware - accept json and url encoded data, and take static assets from ./public
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.get('/api/notes', (req, res) => res.json(notesData));

app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully!`);
  } else {
    res.error('Error in adding note.');
  }
});

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);
 
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);


 const writeToFile = (destination, content) =>
 fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
   err ? console.error(err) : console.info(`\nData written to ${destination}`)
 );
 
 const readAndAppend = (content, file) => {
 fs.readFile(file, 'utf8', (err, data) => {
   if (err) {
     console.error(err);
   } else {
     const parsedData = JSON.parse(data);
     parsedData.push(content);
     writeToFile(file, parsedData);
   }
 });
 };

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);