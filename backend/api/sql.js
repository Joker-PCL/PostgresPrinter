// Dashboard
const DashboardQuery = `
    -- ค้นหาข้อมูลล่าสุดจาก production
    SELECT 
        d.serial_number,
        d.machine, 
        d.machine_img,
        d_connection.last_connect,
        mg.group_image, 
        p.lot_number,
        p.product,
        p.batch_size,
        p.start_product,
        p.finish_product,

        -- นับจำนวนใน mode_gram
        (SELECT 
            COALESCE(COUNT(mode_gram.result), 0)
        FROM mode_gram
        WHERE mode_gram.machine = d.machine 
        AND mode_gram.result = 'PASS'
        AND mode_gram.timestamp BETWEEN p.start_product AND p.finish_product
        ) AS gramCount,

        -- นับจำนวนใน mode_pcs
        (SELECT 
            COALESCE(COUNT(mode_pcs.pcs), 0)
        FROM mode_pcs
        WHERE mode_pcs.machine = d.machine 
        AND mode_pcs.result = 'PASS'
        AND mode_pcs.timestamp BETWEEN p.start_product AND p.finish_product
        ) AS pcsCount

    FROM devices AS d
    INNER JOIN machine_group AS mg
    ON d.group = mg.group
    LEFT JOIN (
        SELECT *
        FROM production
        WHERE NOW() BETWEEN start_product AND finish_product
        GROUP BY machine
    ) AS p 
    ON d.machine = p.machine
    LEFT JOIN (
    SELECT machine,
        MAX(connection) AS last_connect
    FROM devices
    GROUP BY machine
    ) AS d_connection
    ON d.machine = d_connection.machine
    GROUP BY d.machine
    ORDER BY d.machine;
`;

// Details
const SummaryGramQuery = `
SELECT 
  p.batch_size,
    COUNT(CASE WHEN mode.result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN mode.result = 'FAIL' THEN 1 END) AS fail_count,
    (COUNT(*) / 
        (
      IF(
          MAX(mode.timestamp) IS NOT NULL 
          AND MIN(mode.timestamp)  IS NOT NULL
          AND mode.result = 'PASS',
            TIME_TO_SEC(TIMEDIFF(MAX(mode.timestamp), MIN(mode.timestamp))) / 60,
            1)
        )
    ) AS average_per_minute,
    (COUNT(CASE WHEN mode.result = 'PASS' THEN 1 END) * 100.0 / COUNT(*)) AS pass_percentage,
    (COUNT(CASE WHEN mode.result = 'FAIL' THEN 1 END) * 100.0 / COUNT(*)) AS fail_percentage
FROM mode_gram AS mode
LEFT JOIN production AS p 
ON p.machine = ?
AND ? = p.start_product AND ? = p.finish_product
WHERE 
mode.machine = ?
AND mode.timestamp BETWEEN ? AND ?
GROUP BY mode.machine;
`;

const SummaryPcsQuery = `
SELECT 
  p.batch_size,
    COUNT(CASE WHEN mode.result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN mode.result = 'FAIL' THEN 1 END) AS fail_count,
    (COUNT(*) / 
        (
      IF(
          MAX(mode.timestamp) IS NOT NULL 
          AND MIN(mode.timestamp)  IS NOT NULL
          AND mode.result = 'PASS',
            TIME_TO_SEC(TIMEDIFF(MAX(mode.timestamp), MIN(mode.timestamp))) / 60,
            1)
        )
    ) AS average_per_minute,
    (COUNT(CASE WHEN mode.result = 'PASS' THEN 1 END) * 100.0 / COUNT(*)) AS pass_percentage,
    (COUNT(CASE WHEN mode.result = 'FAIL' THEN 1 END) * 100.0 / COUNT(*)) AS fail_percentage
FROM mode_pcs AS mode
LEFT JOIN production AS p 
ON p.machine = ?
AND ? = p.start_product AND ? = p.finish_product
WHERE 
mode.machine = ?
AND mode.timestamp BETWEEN ? AND ?
GROUP BY mode.machine;
`;

// สรุปข้อมูลประจำสัปดาห์
const GramWeekQuery = `
SELECT 
    w.day,
    COALESCE(mg.pass_count, 0) AS pass_count,
    COALESCE(mg.fail_count, 0) AS fail_count
FROM 
    (SELECT 'Monday' AS day UNION ALL
     SELECT 'Tuesday' UNION ALL
     SELECT 'Wednesday' UNION ALL
     SELECT 'Thursday' UNION ALL
     SELECT 'Friday' UNION ALL
     SELECT 'Saturday' UNION ALL
     SELECT 'Sunday') w
LEFT JOIN 
    (
        SELECT 
            DAYNAME(timestamp) AS day,
            COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
            COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
        FROM 
            mode_gram
        WHERE 
            machine = ?
            AND timestamp >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND timestamp < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL 7 DAY
        GROUP BY 
            DAYNAME(timestamp)
    ) mg ON w.day = mg.day
ORDER BY 
    FIELD(w.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
`;

const PcsWeekQuery = `
SELECT 
    w.day,
    COALESCE(mg.pass_count, 0) AS pass_count,
    COALESCE(mg.fail_count, 0) AS fail_count
FROM 
    (SELECT 'Monday' AS day UNION ALL
     SELECT 'Tuesday' UNION ALL
     SELECT 'Wednesday' UNION ALL
     SELECT 'Thursday' UNION ALL
     SELECT 'Friday' UNION ALL
     SELECT 'Saturday' UNION ALL
     SELECT 'Sunday') w
LEFT JOIN 
    (
        SELECT 
            DAYNAME(timestamp) AS day,
            COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
            COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
        FROM 
            mode_pcs
        WHERE 
            machine = ?
            AND timestamp >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)
            AND timestamp < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL 7 DAY
        GROUP BY 
            DAYNAME(timestamp)
    ) mg ON w.day = mg.day
ORDER BY 
    FIELD(w.day, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');
`;

// สรุปข้อมูลประจำวัน
const GramDaysQuery = `
SELECT 
    DATE(timestamp) AS time,
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_gram
WHERE 
    machine = ?
    AND timestamp BETWEEN ? AND ?
GROUP BY 
    DATE(timestamp)
ORDER BY 
    DATE(timestamp);
`;

const PcsDaysQuery = `
SELECT 
    DATE(timestamp) AS time,
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_pcs
WHERE 
    machine = ?
    AND timestamp BETWEEN ? AND ?
GROUP BY 
    DATE(timestamp) 
ORDER BY 
    DATE(timestamp);
`;

// สรุปข้อมูลประจำวัน
const GramFiveMinutesQuery = `
SELECT 
	TIMESTAMP AS time,
    DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS five_minutes,
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_gram
WHERE 
    machine = ?
    AND timestamp BETWEEN ? AND ?
GROUP BY 
    five_minutes
ORDER BY 
    five_minutes;
`;

const PcsFiveMinutesQuery = `
SELECT 
	TIMESTAMP AS time,
    DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS five_minutes,
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_pcs
WHERE 
    machine = ?
    AND timestamp BETWEEN ? AND ?
GROUP BY 
    five_minutes
ORDER BY 
    five_minutes;
`;

// ตารางข้อมูล
const GramQuery = `
SELECT *
FROM mode_gram
WHERE machine = ?
AND timestamp BETWEEN ? AND ?;
`;

const PcsQuery = `
SELECT *
FROM mode_pcs
WHERE machine = ?
AND timestamp BETWEEN ? AND ?;
`;

module.exports = {
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
};
