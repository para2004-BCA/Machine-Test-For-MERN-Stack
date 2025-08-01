// routes/uploadRouter.js
const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const distributeAndSave = require('../Controllers/distributAndSave');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/csv', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  let data = [];

  try {
    if (ext === '.csv') {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row.FirstName && row.Phone) {
            data.push({
              firstName: row.FirstName,
              phone: row.Phone,
              notes: row.Notes || '',
            });
          }
        })
        .on('end', async () => {
          await distributeAndSave(data, res);
          fs.unlinkSync(filePath);
        });
    } else if (ext === '.xlsx' || ext === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsed = xlsx.utils.sheet_to_json(sheet);

      data = parsed.map((row) => ({
        firstName: row.FirstName,
        phone: row.Phone,
        notes: row.Notes || '',
      }));

      await distributeAndSave(data, res);
      fs.unlinkSync(filePath);
    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Invalid file format' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error processing file' });
  }
});

module.exports = router;
