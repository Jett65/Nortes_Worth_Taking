const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require('./helpers/uuid');
const { consumers } = require("stream");


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

app.get("/api/notes",(req,res,next) => {
    fs.readFile("./db/db.json","utf8",(err,data) => {
        const parsedData = JSON.parse(data);
        console.log(parsedData);
        res.status(200).json(parsedData);
    });
});

app.post("/api/notes",(req,res) => {

    const newNote = {
        title: req.body.title,
        text: req.body.text,
        note_id: uuid()
    };

    fs.readFile("./db/db.json","utf8",(err,data) => {
        if (err) {
            console.log(err);
        } else {
            const prdata = JSON.parse(data);

            prdata.push(newNote);

            fs.writeFile("./db/db.json",JSON.stringify(prdata,null,4),(err) => {
                err ? console.log(err) : console.log("Note Added");
            });
        }

    });

});

app.delete("/api/notes",(req,res) => {
    res.send("test")
});

app.listen(PORT);
