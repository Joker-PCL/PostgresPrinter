//********************* API ESP32 CONNECTION *********************//
const express = require('express');

const router = express.Router();
const connection = require('../config/mysql_db');


// Endpoint สำหรับสร้างข้อมูล กรัม
router.post('/modeGram', (req, res) => {
  const { timestamp, serial_number, operator1, operator2, min_weight, max_weight, weight, result } = req.body;
  console.log(req.body);

  const query = `
            INSERT INTO mode_gram (timestamp, serial_number, machine, operator1, operator2, min_weight, max_weight, weight, result)
            SELECT ?, ?, machine, ?, ?, ?, ?, ?, ?
            FROM devices
            WHERE serial_number = ?;
      `;
  const values = [timestamp, serial_number, operator1, operator2, min_weight, max_weight, weight, result, serial_number];

  connection.execute(query, values, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results.affectedRows) {
      res.status(201).send('Data inserted successfully');
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

// Endpoint สำหรับสร้างข้อมูล PCS
router.post('/modePcs', (req, res) => {
  const { timestamp, serial_number, operator1, operator2, primary_pcs, pcs, result } = req.body;
  console.log(req.body);
  
  const query = `
            INSERT INTO mode_pcs (timestamp, serial_number, machine, operator1, operator2, primary_pcs, pcs, result)
            SELECT ?, ?, machine, ?, ?, ?, ?, ?
            FROM devices
            WHERE serial_number = ?;
      `;
  const values = [timestamp, serial_number, operator1, operator2, primary_pcs, pcs, result, serial_number];

  connection.execute(query, values, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results.affectedRows) {
      res.status(201).send('Data inserted successfully');
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

module.exports = router;
