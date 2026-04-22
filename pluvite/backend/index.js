const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// --- ROTA DE LOGIN INTELIGENTE ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT id_usuario, tipo_usuario FROM Usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, results) => {
        if (err) return res.status(500).json({ error: "Erro no servidor" });
        if (results.length > 0) {
            // O Node envia o tipo_usuario para o Frontend decidir a página
            res.json({ tipo: results[0].tipo_usuario, id: results[0].id_usuario });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    });
});

// --- ROTA CADASTRO PREFEITURA ---
app.post('/cadastrar-prefeitura', (req, res) => {
    const { nome, email, senha, cargo, re } = req.body;
    
    db.query("INSERT INTO Usuarios (email, senha, tipo_usuario) VALUES (?, ?, 'prefeitura')", [email, senha], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar login" });
        
        const sqlPerfil = "INSERT INTO Prefeitura (nome_completo, cargo, re, usuario_id) VALUES (?, ?, ?, ?)";
        db.query(sqlPerfil, [nome, cargo, re, result.insertId], (err2) => {
            if (err2) return res.status(500).json({ error: "Erro ao criar perfil" });
            res.status(201).json({ message: "Prefeitura cadastrada!" });
        });
    });
});

// --- ROTA CADASTRO CIDADÃO ---
app.post('/cadastrar-cidadao', (req, res) => {
    const { nome, email, senha, cpf, telefone, bairro, pcd } = req.body;

    db.query("INSERT INTO Usuarios (email, senha, tipo_usuario) VALUES (?, ?, 'cidadao')", [email, senha], (err, result) => {
        if (err) return res.status(500).json({ error: "Erro ao criar login" });

        const sqlPerfil = "INSERT INTO Cidadao (nome_completo, cpf, telefone, bairro, pcd, usuario_id) VALUES (?, ?, ?, ?, ?, ?)";
        db.query(sqlPerfil, [nome, cpf, telefone, bairro, pcd, result.insertId], (err2) => {
            if (err2) return res.status(500).json({ error: "Erro ao criar perfil" });
            res.status(201).json({ message: "Cidadão cadastrado!" });
        });
    });
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));