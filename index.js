const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

// local imports
const authRouter = require("./routes/auth.js");

dotenv.config();
const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.status(200);
  res.json("Hello World");
});

app.use(bodyParser.json());
app.use("/auth", authRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
