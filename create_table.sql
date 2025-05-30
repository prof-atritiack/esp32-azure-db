CREATE TABLE SensorData (
    id INT IDENTITY(1,1) PRIMARY KEY,
    data_leitura DATE NOT NULL,
    hora_leitura TIME NOT NULL,
    temperatura DECIMAL(5,2),
    umidade DECIMAL(5,2),
    modulo_id VARCHAR(50),
    ip_address VARCHAR(15),
    mac_address VARCHAR(17),
    created_at DATETIME DEFAULT GETDATE()
);

-- Criar índices para melhor performance
CREATE INDEX idx_data_hora ON SensorData(data_leitura, hora_leitura);
CREATE INDEX idx_modulo ON SensorData(modulo_id); 