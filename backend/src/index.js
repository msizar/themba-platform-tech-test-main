import { config } from 'dotenv';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  submissionValidationRules,
  handleValidationErrors,
} from './validation/submissionValidator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.join(__dirname, '../../.env') });
const { BACKEND_PORT } = process.env;

const app = express();

app.use(express.json({ limit: '10mb' }));

const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

app.post('/api/submit', submissionValidationRules, handleValidationErrors, (req, res) => {
  const { name, message, file } = req.body;

  let filePath = null;

  if (file && file.data) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      filePath = path.join(UPLOADS_DIR, fileName);
      const buffer = Buffer.from(file.data, 'base64');
      fs.writeFileSync(filePath, buffer);
      filePath = `backend/uploads/${fileName}`;
    } catch (err) {
      return res.status(500).json({ error: 'Failed to save file' });
    }
  }

  return res.json({
    name,
    message,
    filePath,
    status: 'success',
  });
});

app.listen(BACKEND_PORT, () => {
  console.log(`Server running on port ${BACKEND_PORT}`);
});
