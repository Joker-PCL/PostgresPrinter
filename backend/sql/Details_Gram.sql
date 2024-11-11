SELECT 
	mg.*
FROM mode_gram AS mg
LEFT JOIN production AS p 
ON p.machine = 'strip4'
AND NOW() BETWEEN p.start_product AND p.finish_product
WHERE mg.timestamp BETWEEN p.start_product AND p.finish_product