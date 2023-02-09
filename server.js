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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "assets/notes.html"));
});

app.get("/api/notes", (req, res) => {
  console.info("request recieved");
  readFromFile("./db/notes.json").then((data) => res.json(JSON.parse(data)));
});

app.post("/api/notes", (req, res) => {
  fs.readFile("notes.json", "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes.push(req.body);
    fs.writeFile("notes.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.send("Note saved");
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("notes.json", "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== req.params.id);
    fs.writeFile("notes.json", JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.send("Note deleted");
    });
  });
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
