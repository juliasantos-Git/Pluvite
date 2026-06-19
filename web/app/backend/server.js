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

    // Por enquanto todo login vai pra tela do cidadão
    // (quando fizer a prefeitura, aqui vai checar a tabela prefeitura)
    res.status(200).json({
      message: "Login realizado com sucesso!",
      tipo: "cidadao",
      token: data.session.access_token,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// 3. ALERTAS (mantido igual)
app.get("/api/alertas", async (req, res) => {
  try {
    const { data, error } = await supabase.from("alertas_tempo_real").select("*");
    if (error) return res.status(500).json([]);
    return res.json(data || []);
  } catch (err) {
    return res.status(500).json([]);
  }
});

// 4. ATUALIZAR STATUS (mantido igual)
app.patch("/api/alertas/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status_atual } = req.body;

<<<<<<< HEAD
=======
    // ✅ ALTERAÇÃO: Remove o deslocamento do frontend para usar o ID correspondente na tabela "alertas_tempo_real"
    const idRealdoBanco = parseInt(id) - 100;

>>>>>>> 0b93366fb658994cb361f38de577136246cc380a
    const { data, error } = await supabase
      .from("alertas_tempo_real")
      .update({ orientacao: status_atual })
      .eq("id", idRealdoBanco);

    if (error) return res.status(400).json({ error: error.message });
    return res.json({ message: "Status atualizado!", data });
  } catch (err) {
    return res.status(500).json({ error: "Erro interno" });
  }
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));