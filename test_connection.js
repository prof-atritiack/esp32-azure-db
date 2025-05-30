const sql = require('mssql');

// Configuração da conexão
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

async function testConnection() {
    try {
        await sql.connect(config);
        console.log('Conexão estabelecida com sucesso!\n');

        // Consulta para trazer todos os registros
        const result = await sql.query`
            SELECT 
                id,
                data_leitura,
                hora_leitura,
                temperatura,
                umidade,
                modulo_id,
                ip_address,
                mac_address,
                created_at
            FROM SensorData
            ORDER BY created_at DESC`;

        console.log(`=== Total de registros encontrados: ${result.recordset.length} ===`);
        result.recordset.forEach((record, index) => {
            console.log(`\nRegistro #${index + 1}:`);
            console.log('ID:', record.id);
            console.log('Data:', record.data_leitura?.toISOString().split('T')[0]);
            console.log('Hora:', record.hora_leitura?.toTimeString()?.split(' ')[0]);
            console.log('Temperatura:', record.temperatura, '°C');
            console.log('Umidade:', record.umidade, '%');
            console.log('Módulo ID:', record.modulo_id);
            console.log('IP:', record.ip_address);
            console.log('MAC:', record.mac_address);
            console.log('Criado em:', record.created_at?.toISOString());
            console.log('-'.repeat(40));
        });

    } catch (err) {
        console.error('Erro ao conectar ou consultar o banco:', err);
    } finally {
        await sql.close();
    }
}

testConnection();
