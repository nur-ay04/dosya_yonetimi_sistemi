const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();
const PORT = 3000;
const SECRET_KEY = process.env.JWT_SECRET;
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Dosyalar burada saklanacak

// Dosya yükleme ayarları (multer)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userFolder = `uploads/${req.user.username}`;
    fs.mkdirSync(userFolder, { recursive: true });
    cb(null, userFolder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const userFolder = `uploads/${req.user.username}`;
    const filePath = path.join(userFolder, file.originalname);
    if (fs.existsSync(filePath)) {
      cb(new Error('Bu dosya zaten mevcut.'), false);
    } else {
      cb(null, true);
    }
  }
});

// JSON dosyaları
const usersFile = './users.json';
const filesFile = './files.json';

function loadJSON(filename) {
  try {
    return JSON.parse(fs.readFileSync(filename));
  } catch {
    return [];
  }
}

function saveJSON(filename, data) {
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
}

// Kayıt
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const users = loadJSON(usersFile);
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ message: 'Kullanıcı zaten var' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);
  users.push({ username, password: hashedPassword });
  saveJSON(usersFile, users);
  res.json({ message: 'Kayıt başarılı' });
});

// Giriş
app.post('/login', async(req, res) => {
  const { username, password } = req.body;
  const users = loadJSON(usersFile);
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token,username });
});

// JWT kontrol middleware
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ message: 'Token gerekli' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Geçersiz token' });
    req.user = decoded;
    next();
  });
}

// Dosya yükleme
app.post('/upload', verifyToken, (req, res) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    const files = loadJSON(filesFile);
    if (files.find(f => f.username === req.user.username && f.filename === req.file.originalname)) {
      return res.status(400).json({ message: 'Bu dosya zaten kayıtlı.' });
    }

    files.push({
      username: req.user.username,
      filename: req.file.originalname,
      filepath: `/uploads/${req.user.username}/${req.file.originalname}`
    });
    saveJSON(filesFile, files);
    res.json({ message: 'Dosya yüklendi' });
  });
});

// Listeleme
app.get('/files', verifyToken, (req, res) => {
  const files = loadJSON(filesFile);
  const userFiles = files.filter(f => f.username === req.user.username);
  res.json(userFiles);
});

// Silme
app.delete('/files/:filename', verifyToken, (req, res) => {
  let files = loadJSON(filesFile);
  const filename = req.params.filename;
  const fileIndex = files.findIndex(f => f.username === req.user.username && f.filename === filename);

  if (fileIndex === -1) return res.status(404).json({ message: 'Dosya bulunamadı' });

  const filePath = `uploads/${req.user.username}/${filename}`;
  fs.unlinkSync(filePath); // Fiziksel dosyayı sil
  files.splice(fileIndex, 1);
  saveJSON(filesFile, files);
  res.json({ message: 'Dosya silindi' });
});


app.listen(PORT, () => {
  console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
