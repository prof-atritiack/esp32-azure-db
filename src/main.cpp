#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <DHTesp.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "config.h"

// Instâncias globais
WiFiClient espClient;
PubSubClient mqtt(espClient);
DHTesp dht;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_SERVER);

// Variáveis globais
unsigned long lastPublish = 0;
bool ledState = false;

// Protótipos de funções
void setupWiFi();
void setupMQTT();
void setupSensor();
void setupNTP();
void reconnectMQTT();
void publishSensorData();
void blinkLED();

void setup() {
    // Inicializa serial
    Serial.begin(115200);
    Serial.println("\nIniciando ESP32...");

    // Configura LED
    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, LOW);

    // Inicializa componentes
    setupWiFi();
    setupMQTT();
    setupSensor();
    setupNTP();
}

void loop() {
    // Reconecta ao MQTT se necessário
    if (!mqtt.connected()) {
        reconnectMQTT();
    }
    mqtt.loop();

    // Atualiza NTP
    timeClient.update();

    // Publica dados do sensor no intervalo definido
    if (millis() - lastPublish > PUBLISH_INTERVAL) {
        publishSensorData();
        lastPublish = millis();
        blinkLED();
    }
}

void setupWiFi() {
    Serial.print("Conectando ao WiFi");
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }

    Serial.println("\nWiFi conectado!");
    Serial.print("IP: ");
    Serial.println(WiFi.localIP());
}

void setupMQTT() {
    mqtt.setServer(mqtt_server, mqtt_port);
}

void setupSensor() {
    dht.setup(DHT_PIN, DHTesp::DHT22);
    Serial.println("Sensor DHT inicializado!");
}

void setupNTP() {
    timeClient.begin();
    timeClient.setTimeOffset(-3 * 3600); // GMT-3 para Brasil
    Serial.println("NTP inicializado!");
}

void reconnectMQTT() {
    while (!mqtt.connected()) {
        Serial.print("Conectando ao MQTT...");
        
        if (mqtt.connect(DEVICE_ID, mqtt_user, mqtt_password)) {
            Serial.println("Conectado!");
        } else {
            Serial.print("Falha, rc=");
            Serial.print(mqtt.state());
            Serial.println(" Tentando novamente em 5 segundos");
            delay(5000);
        }
    }
}

void publishSensorData() {
    TempAndHumidity data = dht.getTempAndHumidity();
    
    if (dht.getStatus() != 0) {
        Serial.println("Erro ao ler sensor DHT!");
        return;
    }

    StaticJsonDocument<JSON_BUFFER_SIZE> doc;
    
    doc["temperatura"] = data.temperature;
    doc["umidade"] = data.humidity;
    doc["modulo_id"] = DEVICE_ID;
    doc["ip"] = WiFi.localIP().toString();
    doc["mac"] = WiFi.macAddress();

    char buffer[JSON_BUFFER_SIZE];
    serializeJson(doc, buffer);

    if (mqtt.publish(mqtt_topic, buffer)) {
        Serial.println("Dados publicados com sucesso!");
        Serial.println(buffer);
    } else {
        Serial.println("Falha ao publicar dados!");
    }
}

void blinkLED() {
    ledState = !ledState;
    digitalWrite(LED_BUILTIN, ledState);
} 