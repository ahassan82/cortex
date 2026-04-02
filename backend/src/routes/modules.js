const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  listModules,
  createModule,
  getMyModules,
  getModule,
  updateModule,
  deleteModule,
} = require('../controllers/moduleController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `module-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['.zip', '.tar', '.gz', '.js', '.ts', '.json', '.md', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed. Accepted: .zip, .tar, .gz, .js, .ts, .json, .md, .txt'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.get('/', listModules);
router.get('/my', authenticate, getMyModules);
router.get('/:id', getModule);
router.post('/', authenticate, upload.single('file'), createModule);
router.patch('/:id', authenticate, upload.single('file'), updateModule);
router.delete('/:id', authenticate, deleteModule);

module.exports = router;
