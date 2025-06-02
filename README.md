# Sistema de Monitoramento com ESP32 e Azure SQL

Este projeto implementa um sistema de monitoramento que coleta dados de sensores do ESP32 e os armazena em um banco de dados Azure SQL através do Node-RED.

## Arquitetura do Sistema

```
ESP32 (Sensor) → MQTT → Node-RED → Azure SQL Database
```

## Componentes do Sistema

### Hardware Necessário
- ESP32 com sensor DHT (temperatura e umidade)
- Conexão com internet

### Software e Serviços
- Node.js e npm
- Node-RED instalado
- Servidor MQTT (local ou em nuvem)
- Conta Azure com subscrição ativa

### Dependências Node.js
- `mssql`: Para conexão com Azure SQL Database
- `dotenv`: Para gerenciamento de variáveis de ambiente
- `node-red-contrib-mssql`: Para integração Node-RED com SQL Server
- `node-red-contrib-moment`: Para manipulação de datas

## Configuração do Ambiente

### 1. Instalação de Dependências
```bash
npm install mssql dotenv node-red-contrib-mssql node-red-contrib-moment
```

### 2. Configuração do Banco de Dados

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

### 3. Configuração do Node-RED

1. Importe o fluxo do arquivo `nodered_flow.json`
2. Configure as credenciais do broker MQTT e Azure SQL nos respectivos nós
3. O fluxo está configurado para:
   - Receber dados via MQTT
   - Processar e formatar os dados
   - Inserir no Azure SQL Database
   - Monitorar status das conexões

## Formato dos Dados

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
   - Use arquivo `.env` para armazenar credenciais
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
| Falha na autenticação MQTT | Confirme credenciais no Node-RED |
| Dados não chegam ao banco | Verifique logs do Node-RED e formato do JSON |
| Erro de SSL/TLS | Confirme configurações de criptografia |

## Scripts Úteis

O projeto inclui scripts para testar e gerenciar o banco de dados:

- `test_connection.js`: Testa a conexão com o banco e exibe registros
- `test_connection_2.js`: Verifica a estrutura da tabela
- `alter_table_SensorData.js`: Script para alterações na tabela

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

Distribuído sob a licença MIT.

---

Desenvolvido para monitoramento de sensores com ESP32 e Azure SQL Database.
