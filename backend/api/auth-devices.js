require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const connection = require('../config/mysql_db');

// Middleware สำหรับตรวจสอบ JWT
exports.authenticateDevicesToken = function (req, res, next) {
  const token = req.headers['authorization']?.split('Bearer ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Update device.last_connect if authentication is successful
    const query = 'UPDATE devices SET connection = NOW() WHERE serial_number = ?';
    connection.execute(query, [user.serial_number], (updateError, results) => {
      if (updateError) {
        console.error('Error updating last_connect:', updateError);
        return res.sendStatus(500); // Internal server error
      }

      next();
    });
  });
};
