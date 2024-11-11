//********************* API WEB CONNECTION *********************//
const express = require('express');
const iconv = require('iconv-lite');

const router = express.Router();
const connection = require('../config/mysql_db');
const {
  DashboardQuery,
  SummaryGramQuery,
  SummaryPcsQuery,
  GramWeekQuery,
  PcsWeekQuery,
  GramDaysQuery,
  PcsDaysQuery,
  GramFiveMinutesQuery,
  PcsFiveMinutesQuery,
  GramQuery,
  PcsQuery,
} = require('./sql'); // นำเข้าคำสั่ง SQL

// Endpoint สำหรับสร้างข้อมูล กรัม
router.get('/dashboard', (req, res) => {
  connection.execute(DashboardQuery, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Dashboard)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

router.get('/production', (req, res) => {
  const query = `
    SELECT *
    FROM production
    ORDER BY timestamp DESC
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Production Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

router.post('/production/update', (req, res) => {
  const { id, machine, lot_number, product, batch_size, start_product, finish_product, notes } = req.body;
  console.log(req.body);

  if (id) {
    const query = `
      UPDATE production
      SET machine = ?, timestamp = NOW(), lot_number = ?, product = ?, batch_size = ?, start_product = ?, finish_product = ?, notes = ?
      WHERE id = ?;
    `;

    const notesTIS620 = iconv.encode(notes, 'tis620');

    const values = [machine, lot_number, product, batch_size, start_product, finish_product, notesTIS620, id];
    connection.execute(query, values, function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(Production Create)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('Serial number not found');
      }
    });
  } else {
    const query = `
      INSERT INTO production (machine, lot_number, product, batch_size, start_product, finish_product, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    const values = [machine, lot_number, product, batch_size, start_product, finish_product, notes];
    connection.execute(query, values, function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(Production Update)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('Serial number not found');
      }
    });
  }
});

router.post('/production/delete', (req, res) => {
  const { id } = req.body;

  if (id) {
    const query = `
      DELETE FROM production
      WHERE id = ?;
    `;

    connection.execute(query, [id], function (err, results) {
      if (err) {
        console.error('Error executing query', err);
        res.status(500).send('An error occurred');
      } else if (results) {
        console.log('(Production Delete)=>', results);
        res.status(201).send(results);
      } else {
        res.status(400).send('ID not found');
      }
    });
  } else {
    res.status(400).send('ID not found');
  }
});

router.get('/productLists', (req, res) => {
  const query = `
    SELECT *
    FROM products
    GROUP BY name ASC
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Product Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

router.post('/details', async (req, res) => {
  const { machine, start_product, finish_product } = req.body;

  console.log('(Details)=>', machine, start_product, finish_product);

  if (!machine || !start_product || !finish_product) {
    return res.status(400).json({ message: 'Missing parameter' });
  }

  const sammary = [machine, start_product, finish_product, machine, start_product, finish_product];
  const sammaryChart = [machine, start_product, finish_product];
  const values = [machine, start_product, finish_product];

  try {
    // สร้าง array ของ Promise
    const promises = [
      new Promise((resolve, reject) => {
        connection.execute(SummaryGramQuery, sammary, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.execute(SummaryPcsQuery, sammary, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.execute(GramDaysQuery, sammaryChart, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.execute(PcsDaysQuery, sammaryChart, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.execute(GramQuery, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
      new Promise((resolve, reject) => {
        connection.execute(PcsQuery, values, (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        });
      }),
    ];

    // ใช้ Promise.all เพื่อรอผลลัพธ์ทั้งหมด
    const [summaryGramResults, summaryPcsResults, gramChartResults, pcsChartResults, gramResults, pcsResults] = await Promise.all(promises);

    // ส่งผลลัพธ์ทั้งหมดกลับไปในรูปแบบ JSON
    res.status(200).json({
      summaryGram: summaryGramResults[0],
      summaryPcs: summaryPcsResults[0],
      gramChart: gramChartResults,
      pcsChart: pcsChartResults,
      modeGram: gramResults,
      modePcs: pcsResults,
    });
  } catch (error) {
    console.error('Error executing queries:', error);
    res.status(500).send('An error occurred while fetching data');
  }
});

router.get('/machineLists', (req, res) => {
  const query = `
    SELECT *
    FROM devices
    GROUP BY machine
    ORDER BY machine
  `;

  connection.execute(query, function (err, results) {
    if (err) {
      console.error('Error executing query', err);
      res.status(500).send('An error occurred');
    } else if (results) {
      console.log('(Product Lists)=>', results);
      res.status(201).send(results);
    } else {
      res.status(400).send('Serial number not found');
    }
  });
});

module.exports = router;
