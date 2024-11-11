require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const JWT_SECRET = process.env.JWT_SECRET;

const connection = require('./config/mysql_db');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');

const { authenticateDevicesToken } = require('./api/auth-devices');
const { authenticateWebToken } = require('./api/auth-web');
const app = express();

// ใช้ body-parser สำหรับ JSON
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN, // แทนที่ด้วย URL ของคุณ
  credentials: true // เปิดใช้งานการส่งข้อมูลรับรอง
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 นาที
  max: 100000, // จำกัด 100 คำขอต่อ IP
});
app.use(limiter);

const device_handshake = require('./api/handshake');
const device = require('./api/devices');
const poli = require('./api/web');
app.use('/handshake', device_handshake);
app.use('/poli', authenticateWebToken, poli);
app.use('/api', authenticateDevicesToken, device);

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    connection.execute('SELECT * FROM users WHERE BINARY username=?', [username], (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(401).json({ message: 'ไม่พบข้อมูลผู้ใช้งาน' });
      }
      const user = results[0];
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) {
          return res.status(403).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
        }
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('authToken', token, { httpOnly: true }); // ตั้งค่าโทเค็นในคุกกี้
        res.status(200).json({ auth: true });
      });
    });
  } else {
    res.status(400).json({ message: 'Username and password are required' });
  };
});

app.post('/logout', (req, res) => {
  res.clearCookie('authToken'); // ลบคุกกี้ที่เก็บโทเคน
  res.status(200).send('Logged out');
});

// จัดการ promise ที่ไม่ได้ถูกจับ
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => console.log('Listening on port 3000'));
