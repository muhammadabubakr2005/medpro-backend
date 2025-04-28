const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendResetEmail = async (to, subject, html) => {
  const mailOptions = {
    from: '"MedPro" <${process.env.EMAIL_USER}>',
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
};