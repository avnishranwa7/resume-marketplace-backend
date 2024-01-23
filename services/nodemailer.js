const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "avnishranwa7@gmail.com",
    pass: process.env.PASSWORD,
  },
});

const sendEmailVerification = (email) => {
  try {
    return transporter.sendMail({
      sender: "resume-marketplace@gmail.com",
      to: email,
      subject: "Verify email address for Resume-Marketplace",
      text: "Verify email address for Resume-Marketplace",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { sendEmailVerification };
