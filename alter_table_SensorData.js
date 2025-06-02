require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
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
