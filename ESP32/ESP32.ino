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
#define PIN_BASE 26
#define PIN_ACIDO 27
#define PIN_LUZ 14
#define PIN_AQUECEDOR 12
#define PIN_BOMBA 25


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

  Serial.println("\n\nO nível de água é: ");
  Serial.println(value);
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

  pinMode(PIN_BASE, OUTPUT);
  pinMode(PIN_ACIDO, OUTPUT);
  pinMode(PIN_LUZ, OUTPUT);
  pinMode(PIN_AQUECEDOR, OUTPUT);
  pinMode(PIN_BOMBA, OUTPUT);
}

void loop()
{
  atualizaSensores();
  ligarLuz();
  delay(5000);
  desligarLuz();
  atualizaSensores();
  delay(1000);
  ligarAquecedor();
  delay(5000);
  desligarAquecedor();
  atualizaSensores();
  delay(1000);
  ligarValvulaBase();
  atualizaSensores();
  delay(5000);
  ligarValvulaAcido();
  atualizaSensores();
  delay(5000);
  ligarBomba();
  delay(1000);
  desligarBomba();
  atualizaSensores();
  delay(10000); 
}
