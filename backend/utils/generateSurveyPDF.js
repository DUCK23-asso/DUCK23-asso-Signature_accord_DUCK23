// backend/utils/generateSurveyPDF.js

const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateDuck23SurveyPDF(data) {
  const {
    statut = '',
    objectifs = [],
    participation = '',
    experience = ''
  } = data;

  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // Format A4
  const { width } = page.getSize();

  // Charger la police standard
  const font = await doc.embedFont(StandardFonts.Helvetica);

  // Logo Duck23
  const logoPath = path.join(__dirname, '../../docs/logo-duck23.png');
  const logoImage = fs.readFileSync(logoPath);
  const embeddedLogo = await doc.embedPng(logoImage);
  page.drawImage(embeddedLogo, {
    x: 100,
    y: 770,
    width: 100,
    height: 100,
  });

  // Titre principal
  const title = "Duck23 – Mieux vous connaître";
  page.drawText(title, {
    x: 40,
    y: 740,
    size: 20,
    font,
    color: rgb(0.1, 0.2, 0.6),
  });

  // Texte de contenu
  let y = 710;
  const lineHeight = 20;
  const writeLine = (text, size = 12, color = rgb(0, 0, 0)) => {
    page.drawText(text, { x: 40, y, size, font, color });
    y -= lineHeight;
  };

  writeLine(`1. Statut du membre :`);
  writeLine(`> ${statut || 'Non renseigné'}`);

  y -= 10;
  writeLine(`2. Objectifs en rejoignant Duck23 :`);
  if (objectifs.length === 0) {
    writeLine('> Aucun objectif sélectionné');
  } else {
    objectifs.forEach(obj => writeLine(`> - ${obj}`));
  }

  y -= 10;
  writeLine(`3. Participation à des projets :`);
  writeLine(`> ${participation || 'Non précisé'}`);

  y -= 10;
  writeLine(`4. Expérience en développement :`);
  writeLine(`> ${experience || 'Non précisée'}`);

  y -= 20;
  writeLine('---');
  writeLine('Ce document a été généré automatiquement lors de l’inscription à Duck23.');

  const pdfBytes = await doc.save();
  return pdfBytes;
}

module.exports = { generateDuck23SurveyPDF };
