SELECT 
    DAYNAME(timestamp) AS day,  -- แสดงชื่อวัน
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_gram
WHERE 
    machine = 'strip4'
    AND timestamp >= DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY)  -- วันจันทร์ของสัปดาห์นี้
    AND timestamp < DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) + INTERVAL 7 DAY  -- วันอาทิตย์ของสัปดาห์นี้
GROUP BY 
    DAYNAME(timestamp)  -- จัดกลุ่มตามชื่อวัน
ORDER BY 
    FIELD(DAYNAME(timestamp), 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');  -- จัดเรียงตามลำดับวัน
