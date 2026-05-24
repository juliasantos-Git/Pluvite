import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { supabase } from "./supabase.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/cadastrar-cidadao", async (req, res) => {
  try {

    const {
      nome,
      email,
      senha,
      cpf,
      telefone,
      cidade,
      pcd,
    } = req.body;

    // criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // enviar para o Supabase
    const { data, error } = await supabase
      .from("cidadao")
      .insert([
        {
          nome_completo: nome,
          email: email,
          senha: senhaHash,
          cpf: cpf,
          telefone: telefone,
          cidade: cidade,
          pcd: pcd,
        },
      ]);

    if (error) {
      console.log(error);

      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Cidadão cadastrado com sucesso!",
      data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erro interno do servidor",
    });

  }
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});

app.post("/cadastro-prefeitura", async (req, res) => {
  try {

    const {
      id_servidor,
      email,
      senha,
      cargo,
      re,
    } = req.body;

    // criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // inserir no Supabase
    const { data, error } = await supabase
      .from("prefeitura")
      .insert([
        {
          id_servidor: id_servidor,
          email: email,
          senha: senhaHash,
          cargo: cargo,
          re: re,
        },
      ]);

    if (error) {
      console.log(error);

      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json({
      message: "Servidor cadastrado com sucesso!",
      data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erro interno do servidor",
    });

  }
});

//login  
app.post("/login", async (req, res) => {

  try {

    const { email, senha } = req.body;

    // procurar usuário
    const { data, error } = await supabase
      .from("cidadao")
      .select("*")
      .eq("id_servidor", id_servidor)
      .single();

    if (error || !data) {
      return res.status(400).json({
        error: "Usuário não encontrado",
      });
    }

    // comparar senha
    const senhaCorreta = await bcrypt.compare(
      senha,
      data.senha
    );

    if (!senhaCorreta) {
      return res.status(400).json({
        error: "Senha incorreta",
      });
    }

    res.status(200).json({
      message: "Login realizado com sucesso!",
      usuario: data,
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Erro interno",
    });

  }

});