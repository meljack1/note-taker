const express = require("express");
const fs = require('fs');
const router = express.Router();
const notesData = require('../db/db.json');
const uuid = require('../helpers/uuid');

router.get('/', (req, res) => {
  console.info(`${req.method} request has been received.`);
  res.json(notesData)
});

router.post('/', (req, res) => {
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