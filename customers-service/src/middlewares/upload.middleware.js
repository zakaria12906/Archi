// src/middlewares/upload.middleware.js
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'src/uploads');
  },
  filename: (req, file, cb) => {
    // ex: avatar_accountId.png
    // ou : avatar_<Date.now()>.png
    const ext = path.extname(file.originalname); // .jpg, .png ...
    const accountId = req.params.accountId || 'unknown';
    cb(null, `avatar_${accountId}${ext}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
