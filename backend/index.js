// backend/index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const generatePDF = require('./utils/generatePDF');
const sendMail = require('./utils/sendMail');
const { generateDuck23SurveyPDF } = require('./utils/generateSurveyPDF');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      date,
      city,
      discord,
      statut,
      objectifs,
      participation,
      experience
    } = req.body;

    // Vérifie les champs obligatoires du PDF d'engagement
    if (!firstname || !lastname || !email || !date || !city || !discord) {
      return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
    }

    // Génère le PDF d’engagement
    const pdfBuffer = await generatePDF({ firstname, lastname, email, date, city, discord });

    // Génère le PDF "mieux nous connaître" (même si les réponses ne sont pas obligatoires)
    const surveyPdfBuffer = await generateDuck23SurveyPDF({
      statut,
      objectifs,
      participation,
      experience,
    });

    // Envoie les deux PDFs par mail
    await sendMail(email, pdfBuffer, surveyPdfBuffer);

    res.status(200).json({ message: 'PDFs générés et envoyés avec succès !' });
  } catch (error) {
    console.error('Erreur backend:', error);
    res.status(500).json({ error: 'Erreur lors du traitement de la demande.' });
  }
});

app.listen(PORT, () => console.log(`✅ Serveur prêt sur http://localhost:${PORT}`));
