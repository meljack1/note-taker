const express = require("express");
const fs = require('fs');
const router = express.Router();
const util = require('util');
const uuid = require('../helpers/uuid');

router.get("/", (req, res) =>{
  console.log(`${req.method} request has been received.`);
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => console.log("Error:", err));
});

router.post('/', (req, res) => {
  console.info(`${req.method} request received to add a new note`);

  const { title, text } = req.body;

  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };

    readAndAppend(newNote, './db/db.json');
    res.json(`Note added successfully!`);
  } else {
    res.error('Error in adding note.');
  }
});

router.delete('/:id', (req, res) => {
  console.log(`${req.method} request has been received.`);
  readFromFile('./db/db.json')
    .then((data) => {
      const notes = JSON.parse(data);
      const filteredNotes = notes.filter(note => note.id !== req.params.id)
      res.json(filteredNotes);
      writeToFile("./db/db.json", filteredNotes);
    })
    .catch((err) => console.log("Error:", err));
})

const readFromFile = util.promisify(fs.readFile);

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

module.exports = router;