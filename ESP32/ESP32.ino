#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"

/*inclusão das bibliotecas necessárias*/
#include <OneWire.h>  
#include <DallasTemperature.h>

AsyncWebServer server(80);
const char *ssid = "NET_2GC41029";
const char *password = "4BC41029";

void notFound(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"message\":\"Not found\"}");
}

#define PIN_TEMPERATURA 15
#define PIN_NIVEL 2
#define PIN_PH 4
#define PIN_BASE 14
#define PIN_ACIDO 27
#define PIN_LUZ 25
#define PIN_AQUECEDOR 26
#define PIN_BOMBA 12


/* ------------------------------------------------------------------------------------------------------------------ */
/* Variáveis do programa */
float temperatura = 10;
float ph = 7;
float nivelAgua = 0;
String estadoLuz = "off"; // on ou off
String estadoAquecedor = "off"; // on ou off
String estadoBomba = "off"; // on ou off
String estadoNivelAgua = "médio"; // alto, médio (quase chegando no momento de repor), baixo (momento de repor)

/* Sensor de temperatura */
OneWire oneWire(PIN_TEMPERATURA);  /*Protocolo OneWire*/
/********************************************************************/
DallasTemperature sensors(&oneWire); /*encaminha referências OneWire para o sensor*/

void ligarValvulaBase(){
  
}

void ligarValvulaAcido(){
  
}

void updateInfo(String novoEstadoBomba, String novoEstadoAquecedor, String novoEstadoLuz, int ligarBase, int ligarAcido){
    if(novoEstadoBomba != NULL && novoEstadoBomba != "null"){
      estadoBomba = novoEstadoBomba;
    }
    if(novoEstadoAquecedor != NULL && novoEstadoAquecedor != "null"){
      estadoAquecedor = novoEstadoAquecedor;
    }
    if(novoEstadoLuz != NULL && novoEstadoLuz != "null"){
      estadoLuz = novoEstadoLuz;
    }
    if(ligarBase != NULL){
      if(ligarBase == 1){
        ligarValvulaBase();
      }
    }
    if(ligarAcido != NULL){
      if(ligarAcido == 1){
        ligarValvulaAcido();
      }
    }
}

void atualizaSensorPh(){
  
}

void atualizaSensorTemperatura(){
   Serial.print(" Requerimento de temperatura..."); 
   sensors.requestTemperatures(); /* Envia o comando para leitura da temperatura */
   Serial.println("Pronto");  /*Printa "Pronto" */
  /********************************************************************/
   Serial.print("A temperatura é: "); /* Printa "A temperatura é:" */
   temperatura = sensors.getTempCByIndex(0);
   Serial.print(temperatura); /* Endereço do sensor */
}

void atualizaSensorNivelAgua(){
  int value = analogRead(PIN_NIVEL);

  Serial.println("O nível de água é: ");
  Serial.println(value);
  delay(500);
}

void atualizaSensores(){
  atualizaSensorPh();
  atualizaSensorTemperatura();
  atualizaSensorNivelAgua();
}

void setup()
{
  Serial.begin(115200);

  pinMode(PIN_TEMPERATURA, INPUT_PULLUP);
  sensors.begin(); /*inicia biblioteca*/

  //pinMode(PIN_NIVEL, INPUT);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  /*while (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    Serial.printf("WiFi Failed!\n");
  }*/
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<200> data;

    // Adiciona as informações do aquário na resposta
    data["temperatura"] = temperatura;
    data["ph"] = ph;
    data["nivelAgua"] = nivelAgua;
    data["estadoNivelAgua"] = estadoNivelAgua;
    data["estadoLuz"] = estadoLuz;
    data["estadoBomba"] = estadoBomba;
    data["estadoAquecedor"] = estadoAquecedor;
    
    String response;
    serializeJson(data, response);
    Serial.println(response);
    request->send(200, "application/json", response);
  });
  
  AsyncCallbackJsonWebHandler *handler = new AsyncCallbackJsonWebHandler("/update-info", [](AsyncWebServerRequest *request, JsonVariant &json) {
    StaticJsonDocument<200> data;
    if (json.is<JsonArray>())
    {
      data = json.as<JsonArray>();
    }
    else if (json.is<JsonObject>())
    {
      data = json.as<JsonObject>();
    }

    // Atualiza os valores desejados
    updateInfo(data["estadoBomba"], data["estadoAquecedor"], data["estadoLuz"], data["ligarBase"], data["ligarAcido"]);

    StaticJsonDocument<150> responseData;
    // Adiciona as informações do aquário na resposta
    responseData["estadoLuz"] = estadoLuz;
    responseData["estadoBomba"] = estadoBomba;
    responseData["estadoAquecedor"] = estadoAquecedor;

    String response;
    serializeJson(responseData, response);
    Serial.println(response);
    request->send(200, "application/json", response);
  });
  
  server.addHandler(handler);
  server.onNotFound(notFound);
  server.begin();
}
void loop()
{
   
   float value = analogRead(2);
  Serial.println(value);
  delay(500);
/*  atualizaSensores();
  delay(500);*/
}
