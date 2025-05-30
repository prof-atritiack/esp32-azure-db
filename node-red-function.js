// Processar dados do sensor
const now = new Date();

// Formatar data e hora
const data = now.toISOString().split('T')[0];
const hora = now.toTimeString().split(' ')[0];

// Criar objeto com dados formatados
msg.payload = {
    data_leitura: data,
    hora_leitura: hora,
    temperatura: msg.payload.temperatura,
    umidade: msg.payload.umidade,
    modulo_id: msg.payload.modulo_id,
    ip_address: msg.payload.ip,
    mac_address: msg.payload.mac
};

// Criar query SQL parametrizada
msg.query = `
    INSERT INTO SensorData 
    (data_leitura, hora_leitura, temperatura, umidade, modulo_id, ip_address, mac_address) 
    VALUES 
    (@data_leitura, @hora_leitura, @temperatura, @umidade, @modulo_id, @ip_address, @mac_address)
`;

return msg; 