# Sistema de Monitoramento com ESP32, Node-RED e Azure SQL

Este projeto implementa um sistema completo de monitoramento de sensores utilizando ESP32, Node-RED e Azure SQL Database. O sistema coleta dados de temperatura, umidade e informações do dispositivo, armazenando-os automaticamente na nuvem Azure.

## Arquitetura do Sistema

```
ESP32 (Sensor) → MQTT → Node-RED → Azure SQL Database
```

## Componentes Necessários

### Hardware
- ESP32 (qualquer modelo)
- Sensor de temperatura e umidade (DHT11, DHT22, ou similar)

### Software e Serviços
- Conta Azure com subscrição ativa
- Node-RED instalado
- Servidor MQTT (pode ser local ou serviço em nuvem)

### Dependências Node-RED
- `node-red-contrib-mssql`
- `node-red-contrib-moment`

## Estrutura do Banco de Dados

A tabela `SensorData` deve ser criada com a seguinte estrutura:

```sql
CREATE TABLE SensorData (
    id INT IDENTITY(1,1) PRIMARY KEY,
    data_leitura DATE NOT NULL,
    hora_leitura TIME NOT NULL,
    temperatura FLOAT,
    umidade FLOAT,
    modulo_id VARCHAR(50),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    created_at DATETIME NOT NULL DEFAULT GETDATE()
);
```

## Formato do JSON

O ESP32 deve publicar os dados no seguinte formato JSON:

```json
{
    "temperatura": 25.6,
    "umidade": 65.4,
    "modulo_id": "ESP32_001",
    "ip": "192.168.1.100",
    "mac": "AA:BB:CC:DD:EE:FF"
}
```

## Configuração

### 1. Azure SQL Database
1. Criar um servidor SQL na Azure.
2. Criar um banco de dados.
3. Executar o script SQL para criar a tabela `SensorData`.
4. Configurar as regras de firewall para permitir acesso.

### 2. Node-RED
1. Instalar os nós necessários:
   ```bash
   npm install node-red-contrib-mssql node-red-contrib-moment
   ```
2. Importar o fluxo Node-RED fornecido.
3. Configurar a conexão MSSQL com as credenciais e o servidor da Azure.
4. Verificar se a query está sendo definida **dentro do node `function`** e **não no MSSQL diretamente**, pois o uso de parâmetros (`@param`) pode falhar. Use query inline como abaixo:

#### Exemplo de função Node-RED (inserção inline):

```javascript
const now = new Date();
const dados = msg.payload;

const data = now.toISOString().split('T')[0];
const hora = now.toTimeString().split(' ')[0];

msg.payload = `
    INSERT INTO SensorData 
    (data_leitura, hora_leitura, temperatura, umidade, modulo_id, ip_address, mac_address) 
    VALUES 
    ('${data}', '${hora}', ${dados.temperatura}, ${dados.umidade}, 
    '${dados.modulo_id}', '${dados.ip}', '${dados.mac}')
`;

return msg;
```

### 3. ESP32
1. Configure as credenciais WiFi.
2. Configure o endereço do broker MQTT.
3. Publique os dados no tópico padrão, por exemplo: `"esp32/sensor_data"`.

## Segurança

- Nunca exponha credenciais do banco em código-fonte público.
- Use SSL/TLS em conexões MQTT sempre que possível.
- Proteja seu broker MQTT com autenticação.
- Mantenha o firmware do ESP32 atualizado.

## Monitoramento e Visualização

- Use os nós de debug no Node-RED para validar os dados recebidos e enviados.
- Para dashboards:
  1. Crie painéis no Node-RED com `ui_table`, `ui_chart`, etc.
  2. Conecte o banco à ferramentas como Power BI ou Grafana.
  3. Realize queries SQL como:

```sql
SELECT * FROM SensorData ORDER BY created_at DESC;
```

## Troubleshooting

### Problemas comuns

| Problema                         | Solução                                                                 |
|----------------------------------|-------------------------------------------------------------------------|
| Conexão com Azure falha          | Verifique string de conexão, firewall e credenciais                    |
| Dados não aparecem no banco      | Confirme formato JSON, tópico MQTT e query SQL no Node-RED             |
| MSSQL não reconhece parâmetros   | Evite `@param`. Use strings inline como mostrado acima                 |
| ESP32 não publica                | Verifique WiFi, broker MQTT e se está conectado corretamente            |

## Contribuição

Sinta-se à vontade para contribuir com este projeto via Pull Requests ou relatando issues!

## Licença

Distribuído sob a licença MIT.

---

Desenvolvido com ❤️ para aplicações de IoT com ESP32, Node-RED e Azure.
