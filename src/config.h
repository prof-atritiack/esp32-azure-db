#ifndef CONFIG_H
#define CONFIG_H

// Configurações do WiFi
#ifdef WOKWI_SIMULATION
    const char* ssid = "Wokwi-GUEST";
    const char* password = "";
#else
    const char* ssid = "SEU_WIFI";
    const char* password = "SUA_SENHA";
#endif

// Configurações do MQTT
const char* mqtt_server = "seu_broker_mqtt.com";
const int mqtt_port = 1883;
const char* mqtt_user = "seu_usuario";
const char* mqtt_password = "sua_senha";
const char* mqtt_topic = "esp32/sensor_data";

// Configurações do sensor
const int DHT_PIN = 23;
const int DHT_TYPE = DHT22;  // ou DHT11, dependendo do seu sensor

// Configurações do dispositivo
const char* DEVICE_ID = "ESP32_001";
const unsigned long PUBLISH_INTERVAL = 30000;  // Intervalo de publicação em ms (30 segundos)

// Configurações do NTP
const char* NTP_SERVER = "pool.ntp.org";
const char* TZ_INFO = "BRT3BRST,M10.3.0/0,M2.3.0/0";  // Fuso horário do Brasil

// Buffer para JSON
const size_t JSON_BUFFER_SIZE = 256;

#endif // CONFIG_H 