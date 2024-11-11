//********************* API ESP32 CONNECTION *********************//
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const connection = require('../config/mysql_db');

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

// esp32 first connect query id
router.post('/', (req, res) => {
  const { serial_number } = req.body; // รับ serial_number
  console.log(serial_number);

  if (!serial_number) {
    return res.status(400).json({ message: 'Missing serial number' });
  }

  const timestamp = new Date();
  connection.execute(`UPDATE devices SET last_connect=? WHERE serial_number=?;`, [timestamp, serial_number], cb);

  function cb(err, results) {
    console.log(results);
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results.affectedRows) {
      // สร้างโทเคนพร้อมกำหนดเวลาหมดอายุ (เช่น 1 ชั่วโมง)
      const accessToken = jwt.sign({ serial_number: user.serial_number }, JWT_SECRET, { expiresIn: '2h' });
      res.json({ accessToken });
      
    } else {
      res.status(400).send('Serial number incorrect');
    }
  }
});

module.exports = router;
