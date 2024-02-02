const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../", "uploads"));
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage }).single("upload_file");
async function handleFileUpload(req, res) {
  return new Promise((res, rej) => {
    upload(req, res, (err) => {
      if (err) rej(err);

      res({ file: req.file, body: req.body });
    });
  });
}

module.exports = { handleFileUpload };
