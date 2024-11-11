SELECT 
    MONTHNAME(timestamp) AS month,     -- แสดงชื่อเดือน
    YEAR(timestamp) AS year,                -- แสดงปี
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,  -- นับจำนวน PASS
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count   -- นับจำนวน FAIL
FROM 
    mode_gram
WHERE 
    timestamp >= DATE_FORMAT(CURDATE() ,'%Y-01-01')  -- เริ่มนับจากวันที่ 1 มกราคมของปีปัจจุบัน
    AND timestamp < DATE_FORMAT(CURDATE() + INTERVAL 1 YEAR ,'%Y-01-01')  -- จบที่วันที่ 1 มกราคมของปีถัดไป
GROUP BY 
    YEAR(timestamp), MONTH(timestamp)  -- จัดกลุ่มตามปีและเดือน
ORDER BY 
    YEAR(timestamp), MONTH(timestamp);  -- จัดเรียงตามปีและเดือน
