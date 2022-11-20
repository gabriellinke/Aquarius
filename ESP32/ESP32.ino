#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "time.h"

/*inclusão das bibliotecas necessárias para sensor de temperatura*/
#include <OneWire.h>  
#include <DallasTemperature.h>

//==============================================================================================
// Defines dos pinos utilizados pelo ESP32 
//==============================================================================================
#define PIN_NIVEL 32
#define PIN_PH 34
#define PIN_TEMPERATURA 12
#define PIN_BASE 5
#define PIN_ACIDO 4
#define PIN_LUZ 19
#define PIN_AQUECEDOR 18
#define PIN_BOMBA 15

//==============================================================================================
// Defines das constantes utilizadas no programa
//==============================================================================================
#define NIVEL_MINIMO 2200
#define VAZAO_BOMBA 33.33 // cm³/s -- 2l/min = 33.33
#define OFFSET_ATIVACAO_PH 0.5
#define OFFSET_ATIVACAO_TEMPERATURA 2
#define OFFSET_NOTIFICACAO_PH 0.8
#define OFFSET_NOTIFICACAO_TEMPERATURA 5

//==============================================================================================
// Declaração das variáveis do programa
//==============================================================================================
String estadoLuz = "off"; // on ou off - estado que indica se a luz está ligada ou desligada
String estadoAquecedor = "off"; // on ou off - estado que indica se o aquecedor está ligado ou desligado
String estadoBomba = "off"; // on ou off - estado que indica se a bomba está ligada ou desligada
float temperatura = 25; // Temperatura atual
float temperaturaDesejada = 25; // Temperatura que a água deve ter
float ph = 7; // pH atual
float phDesejado = 7; // pH que a água deve ter
int nivelAgua = 2000; // nível de água atual
int medidasComNivelAbaixo = 0; // quantas medidas foram realizadas com o nível de água estando abaixo do nível
int horaAtual = 0; // hora atual
int minutoAtual = 0; // minuto atual
int horaLigar = 13; // hora que a luz deve ser ligada
int minutoLigar = 0; // minuto que a luz deve ser ligada
int horaDesligar = 14; // hora que a luz deve ser desligada
int minutoDesligar = 5; // minuto que a luz deve ser desligada
float altura = 1; // Altura do aquário em cm
float largura = 1; // Largura do aquário em cm
float comprimento = 1; // Comprimento do aquário em cm
unsigned long timestampValvulas = 4294967295;
unsigned long timestampNotificacaoPH = 4294967295;
unsigned long timestampNotificacaoTemperatura = 4294967295;

//==============================================================================================
// Configurações WiFi, temperatura e tempo
//==============================================================================================
/* Configurações WiFi */
AsyncWebServer server(80);
const char *ssid = "NET_2GC41029";
const char *password = "4BC41029";

// Resposta para quando não for encontrada a rota requisitada
void notFound(AsyncWebServerRequest *request)
{
  request->send(404, "application/json", "{\"message\":\"Not found\"}");
}

/* Configurações tempo */
const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = -3600*3;
const int   daylightOffset_sec = -3600*3;

/* Configurações sensor de temperatura */
OneWire oneWire(PIN_TEMPERATURA);  /*Protocolo OneWire*/
DallasTemperature sensors(&oneWire); /*encaminha referências OneWire para o sensor*/

//==============================================================================================
// Funções
//==============================================================================================
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

int ph_value; // Variável utilizada para ler o pino e pegar o valor do pH
// Faz a leitura do sensor de pH e atualiza o valor da variável ph
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

  //ph = a*media + b;

  Serial.print("PH:");
  Serial.print(media);
  Serial.print("\n");
  //ph = media;
}

// Faz a leitura do sensor de temperatura e atualiza o valor da variável temperatura
void atualizaSensorTemperatura(){
   sensors.requestTemperatures(); /* Envia o comando para leitura da temperatura */

   Serial.print("A temperatura e: "); /* Printa "A temperatura é:" */
   temperatura = sensors.getTempCByIndex(0);
   Serial.print(temperatura); /* Endereço do sensor */
   Serial.print("\n");
}

// Faz a leitura do sensor de nível de água e atualiza o valor da variável nivelAgua
void atualizaSensorNivelAgua(){
  int value = analogRead(PIN_NIVEL);
  nivelAgua = value;

  Serial.print("O nivel de agua e: ");
  Serial.println(value);
  Serial.print("\n");
}

// Faz leitura de todos os sensores do projeto
void atualizaSensores(){
  atualizaSensorPh();
  atualizaSensorTemperatura();
  atualizaSensorNivelAgua();
  Serial.print("\n");
}

// Atualiza as variáveis horaAtual e minutoAtual com o horário atual
void atualizaHorario(){
  struct tm timeinfo;
  if(!getLocalTime(&timeinfo)){
    Serial.println("Failed to obtain time");
  }
  horaAtual = timeinfo.tm_hour;
  minutoAtual = timeinfo.tm_min;
}


// Function that gets current epoch time
unsigned long getTimestamp() {
  time_t now;
  return time(&now);
}


// Verifica se está no horário de deixar a luz ligada. Se está, liga a luz e, se não está, desliga a luz
void verificaLuz(){
  int timestampAtual = minutoAtual + 60*horaAtual;
  int timestampLigar = minutoLigar + 60*horaLigar;
  int timestampDesligar = minutoDesligar + 60*horaDesligar;

  if(timestampDesligar < timestampLigar){
    timestampDesligar += 24*60;
    timestampAtual += 24*60;
  }
  if(timestampAtual >= timestampLigar  && timestampAtual < timestampDesligar ){
    ligarLuz();
  } else {
    desligarLuz();
  }
}

void verificaNivel(){
  if(nivelAgua < NIVEL_MINIMO){
    medidasComNivelAbaixo++;
    if(medidasComNivelAbaixo >= 3) {
      medidasComNivelAbaixo = 0;
      int tempo = ((largura*comprimento)/VAZAO_BOMBA)*1000; //
      ligarBomba();
      delay(tempo);
      desligarBomba();  
    }
  } else {
      medidasComNivelAbaixo = 0;
  }
}

void verificaTemperatura(){
  if(temperatura < temperaturaDesejada - OFFSET_ATIVACAO_TEMPERATURA){
    ligarAquecedor();
  } else {
    desligarAquecedor();
  }
}

void verificaPH(){
  unsigned long timestampNow = getTimestamp(); // Pego o timestamp de agora
  if(timestampValvulas < timestampNow){ // Já posso fazer novas alterações no pH?
    if(ph < phDesejado - OFFSET_ATIVACAO_PH){
      ligarValvulaBase();
      timestampValvulas = getTimestamp() + 4*60*60; // Espera 4h pra pingar outra gota
    } else if (ph > phDesejado + OFFSET_ATIVACAO_PH) {
      ligarValvulaAcido();
      timestampValvulas = getTimestamp() + 4*60*60; // Espera 4h pra pingar outra gota
    }
  }
}

void verificaNotificacao(){

}

void printLocalTime()
{
  atualizaHorario();
  Serial.print("Horas: ");
  Serial.print(horaAtual);
  Serial.print("\tMinutos: ");
  Serial.print(minutoAtual);
  Serial.print("\n");
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
  Serial.print("MAC Address: ");  
  Serial.println(WiFi.macAddress());

  //init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();


  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<100> data;

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

    altura = data["altura"];
    largura = data["largura"];
    comprimento = data["comprimento"];
    temperaturaDesejada = data["temperatura"];
    phDesejado = data["ph"];
    horaLigar = data["horaLigar"];
    horaDesligar = data["horaDesligar"];
    minutoLigar = data["minutoLigar"];
    minutoDesligar = data["minutoDesligar"];

    request->send(200);
  });

  server.addHandler(handler);
  server.onNotFound(notFound);
  server.begin();
}

void sendPostRequest() {
//Check WiFi connection status
  if(WiFi.status()== WL_CONNECTED){
    WiFiClient client;
    HTTPClient http;
  
    // Your Domain name with URL path or IP address with path
    http.begin(client, "http://192.168.0.13:3000/update-info");
    
    // If you need Node-RED/server authentication, insert user and password below
    //http.setAuthorization("REPLACE_WITH_SERVER_USERNAME", "REPLACE_WITH_SERVER_PASSWORD");
    
    
    // If you need an HTTP request with a content type: application/json, use the following:
    http.addHeader("Content-Type", "application/json");
    http.addHeader("Authorization", "key=AAAA9FpWgyU:APA91bFXbera0I3OPrfVGrcXvauVglB6l69VPdqm6Y-uqptf5M22STJngg6GyX5AA0YigqKmam2-WR6pfqtc_iuLf0jprzSpPSf1Gtp9brUC414FB7kJ5FjgniW9SLADS-UGusPThZco");
    int httpResponseCode = http.POST("{\"to\":\"/topics/aquarius\",\"notification\": { \"title\":\"Notificação de testes\",\"body\":\"Notificação enviada pelo ESP32\"}}");
   
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
      
    // Free resources
    http.end();
  }
}
 
    
void loop()
{
  atualizaSensores();
  atualizaHorario();
  verificaLuz();
  verificaNivel();
  verificaTemperatura();
  verificaPH();
  verificaNotificacao();
  sendPostRequest();
  delay(5000);
}
