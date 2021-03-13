const express = require("express");
var cors = require("cors");
const path = require("path");

const port = 8000;

const app = express();
app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/curriculum.json"));
});

app.listen(port, () => console.log(`Listening on ${port}`));
