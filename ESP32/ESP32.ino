#include <Arduino.h>
#include <WiFi.h>
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
#define NIVEL_MINIMO 200
#define VAZAO_BOMBA 2 // l/min
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
int horaAtual = 0; // hora atual
int minutoAtual = 0; // minuto atual
int horaLigar = 0; // hora que a luz deve ser ligada
int minutoLigar = 0; // minuto que a luz deve ser ligada
int horaDesligar = 0; // hora que a luz deve ser desligada
int minutoDesligar = 0; // minuto que a luz deve ser desligada
float altura = 1; // Altura do aquário em cm
float largura = 1; // Largura do aquário em cm
float comprimento = 1; // Comprimento do aquário em cm
// timerValvulas
// timerNotificacaoPH
// timerNotificacaoTemperatura

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
  ph = media;
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

// Verifica se está no horário de deixar a luz ligada. Se está, liga a luz e, se não está, desliga a luz
void verificaLuz(){
  int timestampAtual = minutoAtual + 60*horaAtual;
  int timestampLigar = minutoLigar + 60*horaLigar;
  int timestampDesligar = minutoDesligar + 60*horaDesligar;

  if(timestampDesligar < timestampLigar){
    timestampDesligar += 24*60;
    timestampAtual += 24*60;
  }
  if(timestampAtual >= timestampLigar  && timestampAtual <= timestampDesligar ){
    ligarLuz();
  } else {
    desligarLuz();
  }
}

void verificaNivel(){

}

void verificaTemperatura(){

}

void verificaPH(){

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

  //init and get the time
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
  printLocalTime();


  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    StaticJsonDocument<100> data;

    // Adiciona as informações do aquário na resposta
    data["temperatura"] = temperatura;
    data["ph"] = ph;
    data["nivelAgua"] = nivelAgua;

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