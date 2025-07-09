const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendMail(to, subject, html) {
  const mailOptions = {
    from: `"Disbrava Ford" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = sendMail;
