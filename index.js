const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome!!");
});

app.listen(3000, (err) => {
  if (!err) {
    console.log("Server running...");
  } else {
    console.log("An error occured", err);
  }
});
