const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const { getFolderStructure } = require('./Utils/folderManager');
const { createFile } = require('./Utils/createFile');
//const { convertFilePathToUrl } =require('./Utils/generateURL')



// ✅ Fix `__dirname` for CommonJS (only needed in ES Modules, so we remove it)
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure uploads directory
const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_');
    cb(null, `${Date.now()}_${sanitizedName}`);
  },
});
const upload = multer({ storage });

// ✅ File upload endpoint
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });
    res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
});

// ✅ Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));



//Document as static content
const documentsPath = path.resolve(__dirname, '../Documents');
// Add cache control (optional)
app.use('/documents', express.static(documentsPath, {
  maxAge: '1d',
  setHeaders: (res, path) => {
    if (path.endsWith('.pdf')) {
      res.set('Content-Type', 'application/pdf');
    }
  }
}));
// ✅ Create folder API
app.post('/api/create-folder', (req, res) => {
  try {
    const { date } = req.body;
    if (!date) return res.status(400).json({ error: "Date is required" });

    const folderPath = getFolderStructure(date);
    res.status(200).json({ success: true, folderPath });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Create file API
app.post('/api/create-file', async (req, res) => {
  try {
    const { data, format, folderPath } = req.body;

    if (!data || !format || !folderPath) {
      return res.status(400).json({ error: "Data, format, and folderPath are required." });
    }

    const filePath = await createFile(data, format, folderPath);
    res.status(200).json({ success: true, filePath });
  } catch (error) {
    console.error("❌ Error creating file:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


// ✅ Generate URL API
/*app.post('/api/generate-url', (req, res) => {
  try {
    const { dateInput,fileArray } = req.body;
    if (!dateInput || !fileArray) return res.status(400).json({ error: "Some data are required" });

    const folderPath = convertFilePathToUrl(dateInput,fileArray);
    res.status(200).json({ success: true, folderPath });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});*/

// ✅ Handle undefined routes
app.use((req, res) => res.status(404).json({ success: false, error: 'Endpoint not found' }));

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
