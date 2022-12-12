const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("./helpers/uuid.js");

const PORT = process.env.PORT || 3001;

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

app.post("/api/notes",(req,res,next) => {

    const newNote = {
        title: req.body.title,
        text: req.body.text,
        note_id: uuid()
    };

    fs.readFile("./db/db.json","utf8",(err,data) => {
        if (err) {
            console.log(err);
        } else {
            const prData = JSON.parse(data);

            prData.push(newNote);

            fs.writeFile("./db/db.json",JSON.stringify(prData,null,4),(err) => {
                err ? console.log(err) : console.log("Note Added");
            });
        }
        next()
    });

});

app.delete("/api/notes/:id",(req,res,next) => {
    const trashNote = req.params.id;
    console.log(trashNote);

    fs.readFile("./db/db.json",(err,data) => {
        if (err) {
            console.log(err);
        } else {
            const prData = JSON.parse(data);

            for (let i = 0; i < prData.length; i++) {
                console.log(prData[i].note_id)
                if (prData[i].note_id === trashNote) {
                    console.log("Yes")
                    prData.splice([i],1);
                } else{console.log("NO")}
            }

            fs.writeFile("./db/db.json",JSON.stringify(prData,null,4),(err) => {
                err ? console.log(err) : console.log("Note Deleted");
            });
        }
    });
    next();
});

app.listen(PORT,() => {
    console.log(`Sever listening on PORT: ${PORT}`)
});