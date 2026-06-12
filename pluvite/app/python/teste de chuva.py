import requests
import pyautogui
from twilio.rest import Client

# --- CONFIGURAÇÕES ---
# OpenWeather
API_KEY_WEATHER = ""
CIDADE = "Taubate"
LINK_WEATHER = f"https://api.openweathermap.org/data/2.5/weather?q={CIDADE}&appid={API_KEY_WEATHER}&lang=pt_br"

# Twilio
ACCOUNT_SID = ""
AUTH_TOKEN = ""
NUMERO_TWILIO = "+15187222690"
NUMERO_DESTINO = "+5512974075279"

def enviar_alertas(descricao):
    # 1. Envio de SMS via Twilio
    cliente = Client(ACCOUNT_SID, AUTH_TOKEN)
    mensagem = cliente.messages.create(
        from_=NUMERO_TWILIO,
        to=NUMERO_DESTINO,
        body=f"ALERTA PROFISSIONAL: Risco de inundação em {CIDADE}. Condição: {descricao}"
    )
    print(f"SMS enviado: {mensagem.sid}")

    # 2. Notificação Pop-up via PyAutoGUI
    pyautogui.alert(text=f"ALERTA CRÍTICO!! Risco de inundação detectado: {descricao}", title="Aviso de Emergência")

# --- EXECUÇÃO ---
# --- EXECUÇÃO (VERSÃO DE TESTE CORRIGIDA) ---
try:
    requisicao = requests.get(LINK_WEATHER)
    requisicao_dic = requisicao.json()

    # --- SIMULAÇÃO DE TESTE (Alinhado corretamente) ---
    # id_climatico = requisicao_dic['weather'][0]['id'] # Comentado para teste
    id_climatico = 211 
    descricao = "TESTE: Tempestade severa detectada" 
    
    # IMPORTANTE: Comentei a linha abaixo para ela não sobrescrever o seu texto de teste
    # descricao = requisicao_dic['weather'][0]['description'] 
    
    temperatura = requisicao_dic['main']['temp'] - 273.15

    print(f"Status em {CIDADE}: {descricao} | {temperatura:.1f}°C")

    # LÓGICA DE PERIGO
    if 200 <= id_climatico <= 232 or 502 <= id_climatico <= 504:
        print("Perigo detectado! Iniciando protocolos de emergência...")
        enviar_alertas(descricao)
    else:
        print("Condições normais. Sem necessidade de alerta no momento.")

except Exception as e:
    print(f"Erro ao processar dados: {e}")
