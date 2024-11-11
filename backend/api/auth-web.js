require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware สำหรับตรวจสอบ JWT
exports.authenticateWebToken = function (req, res, next) {
  const token = req.cookies.authToken; // ดึงโทเค็นจากคุกกี้
  if (!token) return res.sendStatus(401).send('Access Denied');
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      res.clearCookie('authToken'); // ลบคุกกี้ที่เก็บโทเคน
      return res.sendStatus(403);
    }
    const newToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    // ตั้งค่าโทเค็นในคุกกี้ พร้อมด้วย expires และ httpOnly
    res.cookie('authToken', newToken, { httpOnly: true, maxAge: 3600000 }); // maxAge ตั้งค่าเป็น 1 ชั่วโมง
    next();
  });
};
