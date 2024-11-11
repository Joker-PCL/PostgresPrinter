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
