const nodemailer = require('nodemailer');

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email provider
  auth: {
    user: 'ameatrest@gmail.com',
    pass: 'ielhyqywqyyyetxy',
  },
});

// Send verification email
async function sendVerificationEmail(userEmail, verifyCode) {
  const verificationLink = `http://10.10.1.194:3000/verify-email?verifyCode=${verifyCode}`;

  const mailOptions = {
    from: 'ameatrest@gmail.com',
    to: userEmail,
    subject: 'Bank: Verify your email address',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };
