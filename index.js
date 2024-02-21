const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
const multer = require("multer");
const path = require("path");

// local imports
const authRouter = require("./routes/auth.js");
const marketplaceRouter = require("./routes/marketplace.js");
const userRouter = require("./routes/user.js");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

dotenv.config();
const app = express();

const options = {
  key: fs.readFileSync(__dirname + "/certificates/privkey.pem"),
  cert: fs.readFileSync(__dirname + "/certificates/cert.pem"),
};

const server = https.createServer(options, app);

app.use(cors());
app.use(multer({ storage: fileStorage }).single("upload_file"));
app.use(express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.status(200);
  res.json("Hello World");
});

app.use(bodyParser.json());
app.use("/auth", authRouter);
app.use(marketplaceRouter);
app.use(userRouter);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  res.status(statusCode).json({ message, data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    process.env.NODE_ENV === "development"
      ? app.listen(process.env.PORT)
      : server.listen(process.env.PORT);
  })
  .catch((err) => console.log(err));
