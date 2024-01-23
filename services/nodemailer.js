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

const sendEmailVerification = (email, token) => {
  try {
    let url;
    if (process.env.NODE_ENV === "production") url = process.env.FRONTEND_URL;
    else url = process.env.LOCAL_FRONTEND_URL;

    return transporter.sendMail({
      sender: "resume-marketplace@gmail.com",
      to: email,
      subject: "Verify email address for Resume-Marketplace",
      html:
        "Please click the attached link to verify your account " +
        url +
        "/complete-verification?token=" +
        token +
        "?email=" +
        email,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

module.exports = { sendEmailVerification };
