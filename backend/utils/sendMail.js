// backend/utils/sendMail.js

const nodemailer = require('nodemailer');
require('dotenv').config();

async function sendMail(recipientEmail, pdfBuffer, surveyPdfBuffer = null) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const attachments = [
    {
      filename: 'engagement_duck23.pdf',
      content: pdfBuffer,
      contentType: 'application/pdf',
    },
  ];

  // Ajoute le second PDF seulement s'il est présent
  if (surveyPdfBuffer) {
    attachments.push({
      filename: 'mieux_vous_connaitre.pdf',
      content: surveyPdfBuffer,
      contentType: 'application/pdf',
    });
  }

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: [recipientEmail, process.env.MAIL_USER], // envoie au destinataire + copie à Duck23
    subject: 'PDF d’engagement DUCK23',
    text: 'Veuillez trouver ci-joint le PDF signé pour votre adhésion à l’association DUCK23.',
    attachments,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendMail;
