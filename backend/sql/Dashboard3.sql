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
        
        -- Join the gram count
        COALESCE(gc.gramCount, 0) AS gramCount,

        -- Join the pcs count
        COALESCE(pc.pcsCount, 0) AS pcsCount

    FROM devices d
    INNER JOIN machine_group mg 
    ON d.group = mg.group
    LEFT JOIN (
        SELECT *
        FROM production
        WHERE NOW() BETWEEN start_product AND finish_product
        GROUP BY machine
    ) p 
    ON d.machine = p.machine

    -- แทนที่จะใช้ซับคิวรีใน timestamp ใช้ JOIN กับตาราง production ที่ได้ช่วงเวลาแล้ว
    LEFT JOIN (
        SELECT 
            mg.machine,
            COUNT(mg.result) AS gramCount
        FROM mode_gram mg
        JOIN production p 
            ON mg.machine = p.machine 
            AND mg.timestamp BETWEEN p.start_product AND p.finish_product
        WHERE mg.result = 'PASS'
        GROUP BY mg.machine
    ) gc 
    ON d.machine = gc.machine
    LEFT JOIN (
        SELECT 
            mp.machine,
            COUNT(mp.pcs) AS pcsCount
        FROM mode_pcs mp
        JOIN production p 
            ON mp.machine = p.machine 
            AND mp.timestamp BETWEEN p.start_product AND p.finish_product
        WHERE mp.result = 'PASS'
        GROUP BY mp.machine
    ) pc 
    ON d.machine = pc.machine
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
    GROUP BY d.machine;