const express = require("express");
require("dotenv").config();
const app = express();
const fs = require("fs");
const fileUpload = require("express-fileupload");
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

app.set("view engine", "ejs");

app.use("/assets", express.static("assets"));
app.use("/image", express.static("images"));
app.use(fileUpload());
const types = ["", ".png", ".jpg", ".jpeg"];
let Rpath = "";
let Rtype = "";
app.post("/upload", (req, res) => {
  try {
    if (req.headers.key !== process.env.KEY) {
      return res.status(403).send({ status: 403, message: "Invalid token" });
    } else {
      if (!req.files) {
        res.status(404).send({
          status: 404,
          message: "No file uploaded",
        });
      } else {
        const name = makeid(10);
        let avatar = req.files.sharex;
        avatar.mv("./images/" + name);
        //send response
        res.send({
          status: 200,
          message: "File just got uploaded!",
          url: name,
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /$\nDisallow: /");
});
app.get("/:image", (req, res) => {
  types.forEach((i) => {
    if (fs.existsSync(`images/${req.path.slice(1)}${i}`)) {
      Rpath = req.path.slice(1);
      Rtype = i;
    }
  });
  if (
    fs.existsSync(`images/${req.path.slice(1)}`) ||
    fs.existsSync(`images/${req.path.slice(1)}.png`) ||
    fs.existsSync(`images/${req.path.slice(1)}.jpg`) ||
    fs.existsSync(`images/${req.path.slice(1)}.jpeg`)
  ) {
    res.render("image", {
      path: Rpath,
      type: Rtype,
    });
  } else {
    res.render("404", {
      path: req.path.slice(1),
    });
  }
});
app.get("/", (req, res) => {
  res.render("index", {
    path: req.path.slice(1),
  });
});

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on ${process.env.DOMAIN}, using port ${process.env.PORT}!`
  );
});
