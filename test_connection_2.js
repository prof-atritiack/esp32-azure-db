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

async function checkTableStructure() {
    try {
        await sql.connect(config);
        console.log('Conectado com sucesso!\n');

        const result = await sql.query(`
            SELECT 
                COLUMN_NAME, 
                DATA_TYPE, 
                IS_NULLABLE, 
                COLUMN_DEFAULT
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = 'SensorData'
        `);

        console.log('=== Estrutura da Tabela SensorData ===');
        result.recordset.forEach(col => {
            console.log(`Coluna: ${col.COLUMN_NAME}`);
            console.log(`Tipo: ${col.DATA_TYPE}`);
            console.log(`Permite NULL: ${col.IS_NULLABLE}`);
            console.log(`Valor padrão: ${col.COLUMN_DEFAULT}`);
            console.log('-'.repeat(40));
        });

    } catch (err) {
        console.error('Erro ao consultar estrutura da tabela:', err);
    } finally {
        await sql.close();
    }
}

checkTableStructure();
