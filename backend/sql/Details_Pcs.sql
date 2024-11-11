SELECT 
	mp.*
FROM mode_pcs AS mp
LEFT JOIN production AS p 
ON p.machine = 'strip4'
AND NOW() BETWEEN p.start_product AND p.finish_product
WHERE mp.timestamp BETWEEN p.start_product AND p.finish_product