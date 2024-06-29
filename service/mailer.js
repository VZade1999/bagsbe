const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.E_HOST,
  port: process.env.E_POST,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendMail = (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: subject,
    html: html,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendMail;
