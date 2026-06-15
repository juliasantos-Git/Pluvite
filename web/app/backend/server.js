import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 1. ROTA: CADASTRAR CIDADÃO
app.post("/cadastrar-cidadao", async (req, res) => {
  try {
    const { nome, email, senha, cpf, telefone, cidade, pcd } = req.body;
    const fontHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("cidadao")
      .insert([{ nome_completo: nome, email, senha: fontHash, cpf, telefone, cidade, pcd }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Cidadão cadastrado com sucesso!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// 2. ROTA: CADASTRO PREFEITURA
app.post("/cadastro-prefeitura", async (req, res) => {
  try {
    const { id_servidor, email, senha, cargo, re } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);

    const { data, error } = await supabase
      .from("prefeitura")
      .insert([{ id_servidor, email, senha: senhaHash, cargo, re }]);

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json({ message: "Servidor cadastrado com sucesso!", data });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// 3. ROTA: LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const { data, error } = await supabase.from("cidadao").select("*").eq("email", email).single();

    if (error || !data) return res.status(400).json({ error: "Usuário não encontrado" });

    const senhaCorreta = await bcrypt.compare(senha, data.senha);
    if (!senhaCorreta) return res.status(400).json({ error: "Senha incorreta" });

    res.status(200).json({ message: "Login realizado com sucesso!", usuario: data });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// 4. ROTA: BUSCA OS ALERTAS DO SUPABASE
app.get("/api/alertas", async (req, res) => {
  try {
    const { data, error } = await supabase.from("alertas_tempo_real").select("*");
    if (error) return res.status(500).json([]);
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json([]);
  }
});

// 5. ROTA ATUALIZAR STATUS (Mudar de "Aguardando" para "Em Andamento" / "Concluído")
app.patch("/api/alertas/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status_atual } = req.body;

    // Atualiza a coluna 'orientacao' do seu banco que está segurando o estado temporário de texto
    const { data, error } = await supabase
      .from("alertas_tempo_real")
      .update({ orientacao: status_atual })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: "Status atualizado com sucesso!", data });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(3001, () => {
  console.log("Servidor rodando perfeitamente na porta 3001");
});