const sql = require('mssql');

const config = {
    user: 'adminESP32',
    password: '@Q1W2E3R4',
    server: 'esp32-sensor-server.database.windows.net',
    database: 'ESP32SensorDB',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function alterTable() {
    try {
        await sql.connect(config);
        console.log('Conectado!');

        const result = await sql.query(`
            ALTER TABLE SensorData
            ALTER COLUMN temperatura FLOAT NULL;

            ALTER TABLE SensorData
            ALTER COLUMN umidade FLOAT NULL;

            ALTER TABLE SensorData
            ALTER COLUMN created_at DATETIME NOT NULL;
        `);

        console.log('Alterações aplicadas com sucesso!');

    } catch (err) {
        console.error('Erro ao executar alterações:', err);
    } finally {
        await sql.close();
    }
}

alterTable();
