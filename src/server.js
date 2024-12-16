const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for cross-origin requests
app.use(cors());

// Set up the storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './assets'); // Save files to the 'assets' folder
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
    const imagePath = `/assets/${req.file.filename}`;
    res.status(200).json({ imagePath }); // Return the image path
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload image.' });
  }
});

app.use('/assets', express.static(path.join(__dirname, 'assets'))); // Serve the assets folder

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
