const express = require("express");
const path = require("path");
const fs = require("fs");


const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/notes",(req,res) => {
    res.sendFile(path.join(__filename,"../public/notes.html"));
});

app.post("/notes",(req,res) => {
    console.log(req.body.title);
});

app.get("/api/notes:id",(req,res,next) => {
    // removes the : from the Id
    let noCol = req.params.id
    noCol = noCol.replace(":", "")

    fs.readFile(`./db/${noCol}.json`, function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
      });
});

app.post("/api/notes",(req,res) => {
    const newNote = [
        {
            title: req.body.title,
            text: req.body.text
        }
    ];

    const noteString = JSON.stringify(newNote);
    fs.writeFile(`./db/${req.body.title}.json`,noteString,(err) => {
        err ? console.log(err) : console.log("db added");
    });

});

app.listen(PORT);
