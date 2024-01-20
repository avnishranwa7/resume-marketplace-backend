import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.status(200);
  res.send("Welcome!!!");
});

app.listen(80, (err) => {
  if (!err) {
    console.log("Server running...");
  } else {
    console.log("An error occured", err);
  }
});
