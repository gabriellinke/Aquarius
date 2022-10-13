#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"

AsyncWebServer server(80);
const char *ssid = "JAIR_MHNET";
const char *password = "88018822";

void notFound(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"message\":\"Not found\"}");
}

/* ------------------------------------------------------------------------------------------------------------------ */
/* Variáveis do programa */
float temperatura = 10;
float ph = 7;
String estadoLuz = "off"; // on ou off
String estadoNivelAgua = "alto"; // alto, médio (quase chegando no momento de repor), baixo (momento de repor)

float temperaturaDesejada = 35;
float phDesejado = 9;

void updateTemperature(){
  if(temperatura < temperaturaDesejada ){
    temperatura += 0.10;
  }
}

void updatePh(){
  if(ph > phDesejado + 0.2){
    ph -= 0.05;
  } else if(ph < phDesejado - 0.2){
    ph += 0.05; 
  }
}

void updateInfo(float novaTemperatura, float novoPh, String novoEstadoLuz){
    if(novaTemperatura != NULL){
      temperaturaDesejada = novaTemperatura;
    } if(novoPh != NULL){
      phDesejado = novoPh;
    } if(novoEstadoLuz != NULL && novoEstadoLuz != "null"){
      estadoLuz = novoEstadoLuz;
    }
}

void setup()
{
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    Serial.printf("WiFi Failed!\n");
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<150> data;

    // Adiciona as informações do aquário na resposta
    data["temperatura"] = temperatura;
    data["ph"] = ph;
    data["estadoLuz"] = estadoLuz;
    data["estadoNivelAgua"] = estadoNivelAgua;
    data["temperaturaDesejada"] = temperaturaDesejada;
    data["phDesejado"] = phDesejado;
    
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
    updateInfo(data["temperatura"], data["ph"], data["estadoLuz"]);

    StaticJsonDocument<100> responseData;
    // Adiciona as informações do aquário na resposta
    responseData["estadoLuz"] = estadoLuz;
    responseData["temperaturaDesejada"] = temperaturaDesejada;
    responseData["phDesejado"] = phDesejado;

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
  updateTemperature();
  updatePh();
  sleep(1);
}
