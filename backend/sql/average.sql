SELECT 
    p.batch_size,
    COUNT(mp.id) AS count_pcs,  -- นับจำนวนชิ้นทั้งหมด
    COUNT(mp.id) / 
        (IF(MAX(mp.timestamp) IS NOT NULL AND MIN(mp.timestamp) IS NOT NULL,
            TIME_TO_SEC(TIMEDIFF(MAX(mp.timestamp), MIN(mp.timestamp))) / 60,
            1)
      	) AS average_per_minute,
   ((p.batch_size - COUNT(mp.id)) / 
   (COUNT(mp.id) / 
        (IF(MAX(mp.timestamp) IS NOT NULL AND MIN(mp.timestamp) IS NOT NULL,
            TIME_TO_SEC(TIMEDIFF(MAX(mp.timestamp), MIN(mp.timestamp))) / 60,
            1)
      	) )
	) AS minutes_complete
FROM mode_pcs AS mp
LEFT JOIN production AS p 
ON p.machine = 'strip4'
AND NOW() BETWEEN p.start_product AND p.finish_product
WHERE mp.timestamp BETWEEN p.start_product AND p.finish_product
GROUP BY p.machine;
