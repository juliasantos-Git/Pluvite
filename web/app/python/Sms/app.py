import os
from dotenv import load_dotenv
from supabase import create_client, Client
from twilio.rest import Client as TwilioClient

load_dotenv(dotenv_path='../.env')

# Puxa as credenciais
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_TOKEN = os.getenv("TWILIO_TOKEN")
TWILIO_PHONE = os.getenv("TWILIO_PHONE")
TWILIO_VERIFIED_NUMBER = os.getenv("TWILIO_VERIFIED_NUMBER")

def buscar_ultimo_alerta():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        resposta = supabase.table('alertas_tempo_real').select('*').order('criado_em', desc=True).limit(1).execute()
        if resposta.data:
            return resposta.data[0]
        return None
    except Exception as e:
        print(f"Erro ao conectar com o Supabase: {e}")
        return None

def enviar_sms():
    alerta = buscar_ultimo_alerta()

    if not alerta:
        print("Nenhum alerta encontrado no banco de dados para enviar.")
        return

    # Monta o texto do SMS
    tipo = alerta.get('tipo', 'Alerta')
    prioridade = str(alerta.get('prioridade', 'Desconhecida')).upper()
    municipio = alerta.get('municipio', 'Local não especificado')
    
    # Limita a descrição para o SMS não ficar gigante
    descricao = alerta.get('descricao', 'Sem detalhes.')[:100] + "..."
    
    mensagem_texto = (
        f"PLUVITE - {prioridade}\n"
        f"{tipo.upper()} em {municipio}.\n"
        f"Info: {descricao}\n"
        f"Fique em segurança!"
    )

    try:
        # Conecta ao Twilio e envia a mensagem
        cliente_twilio = TwilioClient(TWILIO_SID, TWILIO_TOKEN)
        mensagem = cliente_twilio.messages.create(
            body=mensagem_texto,
            from_=TWILIO_PHONE,
            to=TWILIO_VERIFIED_NUMBER
        )
        print(f"✅ SMS enviado com sucesso! SID: {mensagem.sid}")
    except Exception as e:
        print(f"❌ Erro ao enviar SMS: {e}")

if __name__ == "__main__":
    enviar_sms()