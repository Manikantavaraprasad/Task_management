// filepath: ./utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or your email service
  auth: {
    user: 'manikantavaraprasadpalavalasa@gmail.com',
    pass: 'cfeg sycv kmco sfvs',
  },
});

const sendNotificationEmail = async (to, subject, text) => {
  const mailOptions = {
    from: 'manikantavaraprasadpalavalasa@gmail.com',
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Notification email sent');
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
};

module.exports = { sendNotificationEmail };