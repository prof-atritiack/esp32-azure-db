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
- Node.js e npm

### Dependências Node.js
- `mssql`: Para conexão com Azure SQL Database
- `dotenv`: Para gerenciamento de variáveis de ambiente
- `node-red-contrib-mssql`: Para integração Node-RED com SQL Server
- `node-red-contrib-moment`: Para manipulação de datas

## Configuração do Ambiente

### 1. Variáveis de Ambiente
1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
# Azure SQL Database Credentials
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SERVER=seu_servidor.database.windows.net
DB_NAME=nome_do_banco

# MQTT Broker Settings (se necessário)
MQTT_BROKER=
MQTT_USERNAME=
MQTT_PASSWORD=
```

2. Crie um arquivo `.env.example` como template (sem credenciais reais)
3. O arquivo `.env` já está configurado no `.gitignore` para não ser versionado

### 2. Instalação de Dependências
```bash
npm install mssql dotenv node-red-contrib-mssql node-red-contrib-moment
```

## Estrutura do Banco de Dados

A tabela `SensorData` possui a seguinte estrutura:

```sql
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

-- Índices para melhor performance
CREATE INDEX idx_data_hora ON SensorData(data_leitura, hora_leitura);
CREATE INDEX idx_modulo ON SensorData(modulo_id);
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

## Segurança e Boas Práticas

### Credenciais e Dados Sensíveis
1. **Variáveis de Ambiente**:
   - Use o arquivo `.env` para armazenar credenciais
   - Nunca comite o arquivo `.env` no controle de versão
   - Mantenha um `.env.example` como template
   
2. **Azure SQL Database**:
   - Configure regras de firewall para limitar acesso por IP
   - Use diferentes credenciais para desenvolvimento e produção
   - Implemente rotação regular de senhas
   - Considere usar Azure Key Vault para gerenciar segredos em produção

3. **Node-RED**:
   - Use o nó `environment` para gerenciar credenciais
   - Configure credenciais via interface administrativa
   - Habilite autenticação no dashboard
   - Use HTTPS para acesso à interface
   - Mantenha o Node-RED atualizado

4. **ESP32**:
   - Armazene credenciais WiFi/MQTT em arquivo separado
   - Use MQTT sobre TLS quando possível
   - Implemente atualização segura do firmware (OTA)
   - Evite expor informações sensíveis nos logs

### Monitoramento e Logs
- Implemente logs de auditoria para acessos ao banco
- Monitore tentativas de acesso não autorizadas
- Configure alertas para comportamentos anômalos
- Mantenha backups regulares dos dados

### Manutenção
- Atualize regularmente todas as dependências
- Monitore por vulnerabilidades conhecidas
- Faça revisões periódicas das configurações de segurança
- Documente todas as alterações de configuração

## Troubleshooting

### Problemas Comuns

| Problema | Solução |
|----------|---------|
| Erro de conexão com Azure | Verifique variáveis de ambiente e firewall |
| Falha na autenticação MQTT | Confirme credenciais no `.env` |
| Dados não chegam ao banco | Verifique logs do Node-RED e formato do JSON |
| Erro de SSL/TLS | Confirme configurações de criptografia |

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Distribuído sob a licença MIT.

---

Desenvolvido com ❤️ para aplicações de IoT com ESP32, Node-RED e Azure.
