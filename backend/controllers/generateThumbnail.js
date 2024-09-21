const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateThumbnail(filename) {
	const inputPath = path.join('uploads', filename);
	const outputPath = path.join('thumbnails', filename);

	const inputBuffer = fs.readFileSync(inputPath);

	sharp(inputBuffer).resize({ width: 350 }).toBuffer((err, buffer) => {
		if (err) {
			console.error('Erreur lors de la génération de la miniature:', err);
			return;
		}
		fs.writeFileSync(outputPath, buffer);
		console.log('Miniature générée avec succès:', outputPath);
	});
}

// Crée le dossier 'thumbnails' s'il n'existe pas
if (!fs.existsSync('thumbnails')) {
	fs.mkdirSync('thumbnails');
}

module.exports = generateThumbnail;
