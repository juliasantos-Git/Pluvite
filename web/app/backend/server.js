const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-base'); // ou '@supabase/supabase-js' dependendo da sua versão

const app = express();
app.use(cors());
app.use(express.json());

// SUBSTITUA COM AS SUAS CREDENCIAIS REAIS DO SUPABASE
const SUPABASE_URL = "https://sua-url-do-supabase.supabase.co";
const SUPABASE_KEY = "seu-anon-key-do-supabase";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * 1. ROTA GET: Busca os alertas em tempo real relacionando com o cidadão
 * Resolve o problema de trazer o BAIRRO e o NOME do usuário da tabela vinculada.
 */
app.get('/api/alertas', async (req, res) => {
  try {
    // Faz o select na tabela alertas_tempo_real puxando a FK id_cidadao
    const { data, error } = await supabase
      .from('alertas_tempo_real')
      .select(`
        id,
        tipo,
        prioridade,
        municipio,
        endereco,
        descrição,
        statusatual,
        criado_em,
        cidadao:id_cidadao (
          nome_completo,
          bairro
        )
      `)
      .order('criado_em', { ascending: false });

    if (error) {
      console.error("Erro na consulta do Supabase:", error);
      return res.status(500).json({ error: error.message });
    }

    // Formata a resposta limpando a estrutura para o frontend consumir diretamente
    const respostaFormatada = data.map(alerta => {
      // Normalização de string para o status não quebrar por causa de maiúsculas/minúsculas
      let statusTratado = alerta.statusatual || 'Aguardando';
      const statusLower = statusTratado.toLowerCase();

      if (statusLower === 'visualizado') statusTratado = 'Visualizado';
      else if (statusLower === 'em andamento' || statusLower === 'em_andamento') statusTratado = 'Em Andamento';
      else if (statusLower === 'concluído' || statusLower === 'concluido') statusTratado = 'Concluído';
      else statusTratado = 'Aguardando';

      return {
        id: alerta.id,
        tipo: alerta.tipo,
        prioridade: alerta.prioridade,
        municipio: alerta.municipio,
        endereco: alerta.endereco,
        descricao: alerta.descrição || alerta.descricao || 'Sem descrição.',
        statusAtual: statusTratado,
        criado_em: alerta.criado_em,
        usuario: alerta.cidadao?.nome_completo || 'Cidadão Anônimo',
        bairro: alerta.cidadao?.bairro || 'Não Informado' // Pega o Bairro de dentro do relacionamento da tabela cidadao
      };
    });

    return res.json(respostaFormatada);
  } catch (err) {
    console.error("Erro interno no servidor:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/**
 * 2. ROTA PATCH: Atualiza o status do alerta no banco de dados
 * Garante que a coluna 'statusatual' receba a string correta
 */
app.patch('/api/alertas/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status_atual } = req.body; // Recebe o novo status enviado pelo front

  try {
    const { data, error } = await supabase
      .from('alertas_tempo_real')
      .update({ statusatual: status_atual }) // Atualiza na coluna correta tudo minúsculo do banco
      .eq('id', id)
      .select();

    if (error) {
      console.error("Erro ao atualizar status:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error("Erro ao processar atualização:", err);
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/**
 * 3. ROTA GET: Busca o histórico de logs/ações operacionais
 */
app.get('/api/historico', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('historico_operacional') // Certifique-se de que este é o nome exato da sua tabela de logs no Supabase
      .select('*')
      .order('criado_at', { ascending: false })
      .limit(20);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/**
 * 4. ROTA POST: Insere uma nova ação no histórico de logs
 */
app.post('/api/historico', async (req, res) => {
  const { alertaId, cidade, acao, corAcao } = req.body;

  try {
    const { data, error } = await supabase
      .from('historico_operacional')
      .insert([
        {
          alerta_id: alertaId,
          cidade: cidade,
          acao: acao,
          cor_acao: corAcao,
          criado_at: new Date().toISOString()
        }
      ])
      .select();

    if (error) {
      console.error("Erro ao gravar log:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } catch (err) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// Inicialização do Servidor na porta 3001
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor operacional rodando na porta http://localhost:${PORT}`);
});