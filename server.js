const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
const pdfParse = require('pdf-parse');
const textract = require('textract');
const app = express();
const port = 3000;

// Middleware
app.use(fileUpload());
app.use(express.static('public'));

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// Upload endpoint
app.post('/upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.file;
    const fileType = file.mimetype;

    if (fileType === 'application/pdf') {
        pdfParse(file.data).then(data => {
            const notes = generateNotes(data.text);
            res.json({ notes });
        });
    } else if (fileType === 'text/plain' || fileType.includes('wordprocessingml')) {
        textract.fromBufferWithName(file.name, file.data, function (error, text) {
            if (error) {
                return res.status(500).send('Error during text extraction');
            }
            const notes = generateNotes(text);
            res.json({ notes });
        });
    } else {
        res.status(400).send('Unsupported file type');
    }
});

function generateNotes(text) {
    // Simple logic to generate notes: extract the first sentence of each paragraph
    return text.split('\n\n')
               .map(paragraph => paragraph.split('. ')[0] + '.')
               .filter(sentence => sentence.length > 1 && sentence != '.')
               .join('\n');
}

app.listen(port, () => {
    console.log(`Note-Taker app listening at http://localhost:${port}`);
});
