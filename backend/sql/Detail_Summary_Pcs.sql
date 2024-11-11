SELECT 
	p.batch_size,
    COUNT(CASE WHEN mp.result = 'PASS' THEN 1 END) AS pass_count,
    COUNT(CASE WHEN mp.result = 'FAIL' THEN 1 END) AS fail_count,
    (COUNT(*) / 
        (
		  IF(
		  		MAX(mp.timestamp) IS NOT NULL 
		  		AND MIN(mp.timestamp)  IS NOT NULL
		  		AND mp.result = 'PASS',
            TIME_TO_SEC(TIMEDIFF(MAX(mp.timestamp), MIN(mp.timestamp))) / 60,
            1)
        )
    ) AS average_per_minute,
    (COUNT(CASE WHEN mp.result = 'PASS' THEN 1 END) * 100.0 / COUNT(*)) AS pass_percentage,
    (COUNT(CASE WHEN mp.result = 'FAIL' THEN 1 END) * 100.0 / COUNT(*)) AS fail_percentage
FROM mode_pcs AS mp
LEFT JOIN production AS p 
ON p.machine = 'strip4'
AND NOW() BETWEEN p.start_product AND p.finish_product
WHERE mp.timestamp BETWEEN p.start_product AND p.finish_product
GROUP BY p.machine;
