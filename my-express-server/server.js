const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/contact", function (req, res) {
  res.send("This is the contact page.");
});

app.get("/about", function (req, res) {
  res.send("This is the about page.");
});

app.listen(3000, function () {
  console.log("Server started listening on port 3000");
});
