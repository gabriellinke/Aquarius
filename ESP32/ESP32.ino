#include <Arduino.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "time.h"

/*inclusão das bibliotecas necessárias para sensor de temperatura*/
#include <OneWire.h>  
#include <DallasTemperature.h>


//#define PIN_TEMPERATURA 35
#define PIN_NIVEL 32
#define PIN_PH 34
#define PIN_TEMPERATURA 12
//#define PIN_NIVEL 13
//#define PIN_PH 14
#define PIN_BASE 5
#define PIN_ACIDO 4
#define PIN_LUZ 19
#define PIN_AQUECEDOR 18
#define PIN_BOMBA 15


/* Configurações WiFi */
AsyncWebServer server(80);
const char *ssid = "NET_2GC41029";
const char *password = "4BC41029";

void notFound(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"message\":\"Not found\"}");
}

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = -3600*3;
const int   daylightOffset_sec = -3600*3;
int horaAtual = 0;
int minutoAtual = 0;

void printLocalTime()
{
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }
  horaAtual = timeinfo.tm_hour;
  minutoAtual = timeinfo.tm_min;
  Serial.print("Horas: ");
  Serial.print(horaAtual);
  Serial.print("\tMinutos: ");
  Serial.print(minutoAtual);
  Serial.print("\n");
}


/* ------------------------------------------------------------------------------------------------------------------ */
/* Variáveis do programa */
float temperatura = 10;
float ph = 7;
float nivelAgua = 0;
String estadoLuz = "off"; // on ou off
String estadoAquecedor = "off"; // on ou off
String estadoBomba = "off"; // on ou off
String estadoNivelAgua = "médio"; // alto, médio (quase chegando no momento de repor), baixo (momento de repor)

int ph_value;

/* Sensor de temperatura */
OneWire oneWire(PIN_TEMPERATURA);  /*Protocolo OneWire*/
/********************************************************************/
DallasTemperature sensors(&oneWire); /*encaminha referências OneWire para o sensor*/

void ligarValvulaBase(){
  digitalWrite(PIN_BASE, HIGH);
  delay(300);
  digitalWrite(PIN_BASE, LOW);
}

void ligarValvulaAcido(){
  digitalWrite(PIN_ACIDO, HIGH);
  delay(80);
  digitalWrite(PIN_ACIDO, LOW);
}

void ligarLuz(){
  digitalWrite(PIN_LUZ, HIGH);
}

void desligarLuz(){
  digitalWrite(PIN_LUZ, LOW);
}


void ligarBomba(){
  digitalWrite(PIN_BOMBA, HIGH);
}

void desligarBomba(){
  digitalWrite(PIN_BOMBA, LOW);
}

void ligarAquecedor(){
  digitalWrite(PIN_AQUECEDOR, HIGH);
}

void desligarAquecedor(){
  digitalWrite(PIN_AQUECEDOR, LOW);
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
  int buffer[1000];
  int i; 
  float media = 0;
  for(i = 0 ; i< 1000 ; i++){
    ph_value = analogRead(PIN_PH);
    buffer[i]= ph_value;
  }
  
  for(i = 0 ;i < 1000; i++){
    media = media + buffer[i];
  }
  media = media/1000.0;
  
  
  float a = -0.00341796875;
  float b = 17.6640625;

  float ph = a*media + b;

  Serial.print("PH:");
  Serial.print(media);
  Serial.print("\n");
}

void atualizaSensorTemperatura(){
   sensors.requestTemperatures(); /* Envia o comando para leitura da temperatura */

   Serial.print("A temperatura e: "); /* Printa "A temperatura é:" */
   temperatura = sensors.getTempCByIndex(0);
   Serial.print(temperatura); /* Endereço do sensor */
   Serial.print("\n");
}

void atualizaSensorNivelAgua(){
  int value = analogRead(PIN_NIVEL);

  Serial.print("O nivel de agua e: ");
  Serial.println(value);
  Serial.print("\n");
}

void atualizaSensores(){
  atualizaSensorPh();
  atualizaSensorTemperatura();
  atualizaSensorNivelAgua();
  Serial.print("\n");
}

void setup()
{
  Serial.begin(115200);

  pinMode(PIN_TEMPERATURA, INPUT_PULLUP);
  sensors.begin(); /*inicia biblioteca*/

  pinMode(PIN_BASE, OUTPUT);
  pinMode(PIN_ACIDO, OUTPUT);
  pinMode(PIN_LUZ, OUTPUT);
  pinMode(PIN_AQUECEDOR, OUTPUT);
  pinMode(PIN_BOMBA, OUTPUT);

  pinMode(ph_value, INPUT);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  while (WiFi.waitForConnectResult() != WL_CONNECTED)
  {
    Serial.printf("WiFi Failed!\n");
  }
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  //init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();


  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<80> data;

    // Adiciona as informações do aquário na resposta
    data["temperatura"] = temperatura;
    data["ph"] = ph;

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

    //Serial.println(data["temperatura"]);
    // Atualiza os valores desejados
    updateInfo(data["estadoBomba"], data["estadoAquecedor"], data["estadoLuz"], data["ligarBase"], data["ligarAcido"]);

    //StaticJsonDocument<100> responseData;
    // Adiciona as informações do aquário na resposta
    //responseData["estadoLuz"] = estadoLuz;
    //responseData["temperaturaDesejada"] = temperaturaDesejada;
    //responseData["phDesejado"] = phDesejado;

    //String response;
    //serializeJson(responseData, response);
    //Serial.println(response);
    request->send(200);
  });

  server.addHandler(handler);
  server.onNotFound(notFound);
  server.begin();
}

void loop()
{
  if(estadoLuz == "on")
    ligarLuz();
   else 
    desligarLuz();

  if(estadoBomba == "on")
    ligarBomba();
   else
    desligarBomba();

  if(estadoAquecedor == "on")
    ligarAquecedor();
  else
    desligarAquecedor();

  atualizaSensores();
  printLocalTime();
  delay(500);
}

// int ph_value;

// void setup() {
//   Serial.begin(115200);
//   pinMode(ph_value, INPUT); 
// }

// void loop() {
//   int buffer[1000];
//   int i; 
//   float media = 0;
//   for(i = 0 ; i< 1000 ; i++){
//     ph_value = analogRead(15);
//     buffer[i]= ph_value;
//   }
  
//   for(i = 0 ;i < 1000; i++){
//     media = media + buffer[i];
//   }
//   media = media/1000.0;
  
  
//   float a = -0.00341796875;
//   float b = 17.6640625;

//   float ph = a*media + b;

//   Serial.println(ph);
//   Serial.println(media);
//   delay(500);
// }
