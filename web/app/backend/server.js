import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. CADASTRAR CIDADÃO
app.post("/cadastrar-cidadao", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Supabase Auth cria e já criptografa a senha
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
    });

    if (error) return res.status(400).json({ error: error.message });

    // Salva nome e email na tabela cidadao
    const { error: erroPerfil } = await supabase.from("cidadao").insert({
      auth_id: data.user.id,
      nome_completo: nome,
      email,
    });

    if (erroPerfil) return res.status(400).json({ error: erroPerfil.message });

    res.status(201).json({ message: "Cidadão cadastrado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// 2. LOGIN
app.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) return res.status(400).json({ error: "E-mail ou senha incorretos" });

    res.status(200).json({
      message: "Login realizado com sucesso!",
      tipo: "cidadao",
      token: data.session.access_token,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// 3. ALERTAS
app.get("/api/alertas", async (req, res) => {
  try {
    const { data, error } = await supabase.from("alertas_tempo_real").select("*");
    if (error) return res.status(500).json([]);
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json([]);
  }
});

// 4. ATUALIZAR STATUS (Tratando ID como String/UUID de forma correta)
app.patch("/api/alertas/:id/status", async (req, res) => {
  try {
    const { id } = req.params; // Mantido como string (UUID)
    const { status_atual } = req.body;

    const { data, error } = await supabase
      .from("alertas_tempo_real")
      .update({ orientacao: status_atual })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: "Status atualizado com sucesso!", data });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// 5. OBTER HISTÓRICO DE LOGS
app.get("/api/historico", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("historico_acoes")
      .select("*")
      .order("criado_at", { ascending: false });

    if (error) return res.status(500).json([]);
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json([]);
  }
});

// 6. ADICIONAR REGISTRO NO HISTÓRICO
app.post("/api/historico", async (req, res) => {
  try {
    const { alertaId, cidade, acao, corAcao } = req.body;

    const { data, error } = await supabase.from("historico_acoes").insert({
      alerta_id: alertaId, // UUID ou ID numérico compatível
      cidade,
      acao,
      cor_acao: corAcao,
    });

    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ message: "Ação salva no histórico!", data });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(3001, () => console.log("Servidor operacional na porta 3001"));