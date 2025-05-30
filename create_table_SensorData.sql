CREATE TABLE SensorData (
    id INT IDENTITY(1,1) PRIMARY KEY,
    data_leitura DATE NOT NULL,
    hora_leitura TIME NOT NULL,
    temperatura FLOAT,
    umidade INT,
    modulo_id VARCHAR(50),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    created_at DATETIME DEFAULT GETDATE()
);
