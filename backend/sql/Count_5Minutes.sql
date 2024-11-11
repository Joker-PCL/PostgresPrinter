SELECT 
	TIMESTAMP AS minutes,
    DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i') AS five_minutes,
    COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN result = 'FAIL' THEN 1 END) AS fail_count
FROM 
    mode_gram
WHERE 
    machine = 'strip6'
    AND timestamp BETWEEN '2024-10-18 06:30:00' AND '2024-10-30 16:38:00'
GROUP BY 
    five_minutes
ORDER BY 
    minutes;
