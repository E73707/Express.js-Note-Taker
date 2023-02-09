const express = require("express");
const path = require("path");
const fs = require("fs");
const util = require("util");
const data = require("./db/notes.json");
const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("assets"));
const readFromFile = util.promisify(fs.readFile);

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/notes.html"));
});

app.get("/api/notes", (req, res) => {
  readFromFile("./db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    res.send(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = { title: title, text: text, id: title.trim() };

    readFromFile("./db/notes.json", "utf8", (err, data) => {
      if (err) throw err;
      const parsedNotes = JSON.parse(data);
      parsedNotes.push(newNote);
      fs.writeFile("./db/notes.json", JSON.stringify(parsedNotes), (err) => {
        if (err) throw err;
        res.send("Note Saved");
      });
    });
  } else {
    res.status(500).json("Error in posting note");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  readFromFile("./db/notes.json", "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile("./db/notes.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.send("Note Deleted");
    });
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/index.html"));
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
