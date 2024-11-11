SELECT 
    d.machine, 
    d.*, 
    mg.*, 
    p.lot_number, 
    p.product, 
    p.batch_size, 
    p.start_product, 
    p.finish_product,
    COALESCE(gram_counts.gramCount, 0) AS gramCount,
    COALESCE(pcs_counts.pcsCount, 0) AS pcsCount,
    d_connection.last_connect
FROM 
    devices AS d
INNER JOIN 
    machine_group AS mg 
    ON d.group = mg.group
LEFT JOIN 
    production AS p 
    ON d.machine = p.machine 
    AND NOW() BETWEEN p.start_product AND p.finish_product
LEFT JOIN (
    SELECT 
        machine, 
        COUNT(CASE WHEN result = 'PASS' THEN 1 END) AS gramCount
    FROM 
        mode_gram
    WHERE 
        timestamp BETWEEN (
            SELECT MIN(start_product) 
            FROM production 
            WHERE NOW() BETWEEN start_product AND finish_product
        ) 
        AND (
            SELECT MAX(finish_product) 
            FROM production 
            WHERE NOW() BETWEEN start_product AND finish_product
        )
    GROUP BY 
        machine
) AS gram_counts 
ON d.machine = gram_counts.machine 
AND p.machine IS NOT NULL
LEFT JOIN (
    SELECT 
        machine, 
        COUNT(pcs) AS pcsCount
    FROM 
        mode_pcs
    WHERE 
        result = 'PASS'
        AND timestamp BETWEEN (
            SELECT MIN(start_product) 
            FROM production 
            WHERE NOW() BETWEEN start_product AND finish_product
        ) 
        AND (
            SELECT MAX(finish_product) 
            FROM production 
            WHERE NOW() BETWEEN start_product AND finish_product
        )
    GROUP BY 
        machine
) AS pcs_counts 
ON d.machine = pcs_counts.machine 
AND p.machine IS NOT NULL
LEFT JOIN (
    SELECT 
        machine, 
        MAX(connection) AS last_connect
    FROM 
        devices
    GROUP BY 
        machine
) AS d_connection 
ON d.machine = d_connection.machine
GROUP BY 
    d.machine
ORDER BY 
    d.machine;
