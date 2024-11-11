//********************* API ESP32 CONNECTION *********************//
require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const connection = require('../config/mysql_db');

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

router.post('/', (req, res) => {
  const { serial_number } = req.body; // รับ serial_number
  console.log(serial_number);

  if (!serial_number) {
    return res.status(400).json({ message: 'Missing serial number' });
  }

  connection.execute(
    'UPDATE devices SET connection = NOW() WHERE serial_number = ?',
    [serial_number],
    function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        return res.status(500).send('An error occurred');
      }

      connection.execute(
        'SELECT machine FROM devices WHERE serial_number = ?',
        [serial_number],
        function (err, rows) {
          if (err) {
            console.error('Error executing query', err);
            return res.status(500).send('An error occurred');
          }

          if (rows.length > 0) {
            const accessToken = jwt.sign({ serial_number: serial_number }, JWT_SECRET);
            res.json({ accessToken, machineName: rows[0].machine }); // ส่งค่า accessToken พร้อมข้อมูล device
          } else {
            res.status(400).send('Serial number incorrect');
          }
        }
      );
    }
  );
});

module.exports = router;
