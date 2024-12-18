import express from 'express';
import multer from 'multer';
import path, { join } from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 5000;

// Enable CORS for cross-origin requests
app.use(cors());

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path for the uploads folder in the root of the project
const uploadsDir = join(__dirname, '..', 'public', 'uploads');

// Ensure that uploadsDir exists (create it if it doesn't)
import fs from 'fs';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up the storage engine for saving files in the 'public/uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save files to the correct uploads directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueSuffix); // Ensure unique filenames
  },
});

const upload = multer({ storage });

// API route to handle image uploads
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`; // URL path for the uploaded file
    res.status(200).json({ fileUrl }); // Return the file URL
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// Serve the 'public/uploads' folder statically
app.use('/uploads', express.static(uploadsDir));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
