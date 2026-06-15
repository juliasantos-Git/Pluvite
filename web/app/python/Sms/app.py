import os
from dotenv import load_dotenv
import requests
from supabase import create_client, Client
from twilio.rest import Client as TwilioClient

# Carrega as configurações do arquivo .env de forma segura
load_dotenv()

# 1. Configurações (Substitui pelos teus dados reais)

SUPABASE_URL = os.getenv("SUPABASE_URL")

SUPABASE_KEY = os.getenv("SUPABASE_KEY")

TWILIO_SID = os.getenv("TWILIO_SID")

TWILIO_TOKEN = os.getenv("TWILIO_TOKEN")

TWILIO_PHONE = os.getenv("TWILIO_PHONE")

TWILIO_VERIFIED_NUMBER = os.getenv("TWILIO_VERIFIED_NUMBER") # O número que aparece no teu banco

OPENWEATHER_KEY = os.getenv("OPENWEATHER_KEY")



# Inicialização

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

twilio_client = TwilioClient(TWILIO_SID, TWILIO_TOKEN)



def checar_clima_cidade(cidade):

    """Verifica as condições meteorológicas da cidade"""

    print(f"🔍 Buscando clima atual para a cidade: {cidade}...")

    

    url = f"https://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={OPENWEATHER_KEY}&units=metric&lang=pt_br"

    

    try:

        response = requests.get(url).json()

        

        if response.get("cod") == 200:

            id_clima = response["weather"][0]["id"]

            condicao = response["weather"][0]["description"].upper()

            temp = response["main"]["temp"]

            

            print(f"|-> Clima retornado pela API: {condicao} (ID: {id_clima}) | {temp}°C")

            

            # 🚨 MODO DE TESTE ATIVADO:

            # Removi a trava do clima para você conseguir ver o sistema funcionando!

            # Ele vai disparar o alerta para QUALQUER clima retornado.

            return {"risco": True, "condicao": condicao, "temp": f"{temp}°C"}

        else:

            print(f"❌ Erro na API do OpenWeather: {response.get('message')}")

            

    except Exception as e:

        print(f"❌ Erro ao conectar na API de clima: {e}")

            

    return {"risco": False}



def disparar_alertas():

    # Procura todos os registos da tua tabela 'cidadao'

    cidadaos = supabase.table("cidadao").select("*").execute().data

    

    for pessoa in cidadaos:

        nome = pessoa["nome_completo"]

        cidade = pessoa["cidade"]

        id_cidadao = pessoa["id_cidadao"]

        

        # Evita erro se a cidade estiver vazia no banco

        if not cidade:

            continue

            

        status_clima = checar_clima_cidade(cidade)

        

        if status_clima["risco"]:

            print(f"⚠️ Risco em tempo real detectado para {nome} em {cidade}!")

            

            # 1. Envio do SMS para a tua conta gratuita do Twilio

            mensagem_sms = f"Alerta Pluvite! Olá, {nome}. Risco detectado em {cidade}: {status_clima['condicao']}. Tome precauções imediatamente."

            twilio_client.messages.create(

                body=mensagem_sms,

                from_=TWILIO_PHONE,

                to=TWILIO_VERIFIED_NUMBER

            )

            print(f"[SMS] Enviado com sucesso para {TWILIO_VERIFIED_NUMBER}")

            

            # 2. Grava na tabela de tempo real usando os teus IDs

            alerta_data = {

                "id_cidadao": id_cidadao,

                "cidade_alerta": cidade,
                
                "condicao": status_clima["condicao"],

                "temperatura": status_clima["temp"]

            }

            supabase.table("alertas_tempo_real").insert(alerta_data).execute()

            print(f"[Supabase] Alerta inserido para {nome} no banco.")



if __name__ == "__main__":

    disparar_alertas()