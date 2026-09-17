import os
import pyautogui
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis do arquivo .env
load_dotenv()

# Puxa as credenciais com segurança
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def buscar_ultimo_alerta():
    try:
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Busca o alerta mais recente da tabela alertas_tempo_real
        resposta = supabase.table('alertas_tempo_real').select('*').order('criado_em', desc=True).limit(1).execute()
        
        if resposta.data:
            return resposta.data[0]
        return None
    except Exception as e:
        print(f"Erro ao conectar com o Supabase: {e}")
        return None

def mostrar_popup():
    alerta = buscar_ultimo_alerta()

    if alerta:
        # Puxando os dados da sua tabela
        tipo = alerta.get('tipo', 'Alerta')
        prioridade = str(alerta.get('prioridade', 'Desconhecida')).upper()
        municipio = alerta.get('municipio', 'Local não especificado')
        endereco = alerta.get('endereco', 'Endereço não informado')
        descricao = alerta.get('descricao', 'Sem detalhes adicionais.')
        status = alerta.get('statusatual', 'Ativo')

        # Montando o título da janela e o corpo da mensagem
        titulo = f"[{prioridade}] Alerta de {tipo} - {municipio}"
        mensagem = (
            f"⚠️ ATENÇÃO: {tipo.upper()} ⚠️\n\n"
            f"📍 Localização: {municipio}\n"
            f"📌 Endereço/Região: {endereco}\n"
            f"🚨 Nível de Prioridade: {prioridade}\n"
            f"🔄 Status Atual: {status}\n\n"
            f"ℹ️ Descrição do Ocorrido:\n{descricao}\n\n"
            f"Por favor, mantenha-se em segurança e siga as orientações locais."
        )

        # Exibindo o pop-up com as informações
        pyautogui.alert(text=mensagem, title=titulo, button='Estou Ciente')
    else:
        # Mensagem caso o banco esteja vazio ou não retorne nada
        pyautogui.alert(
            text="Nenhum alerta recente registrado no sistema no momento.", 
            title="Pluvite - Monitoramento", 
            button='Fechar'
        )

if __name__ == "__main__":
    mostrar_popup()