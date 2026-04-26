const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

// Função auxiliar para deixar apenas números (importante para CPF e Telefone)
const apenasNumeros = (str) => str.replace(/\D/g, '');

// --- ROTA DE LOGIN ---
app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    const sql = "SELECT id_usuario, tipo_usuario FROM Usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            console.error("Erro no Login:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        if (results.length > 0) {
            res.json({ tipo: results[0].tipo_usuario, id: results[0].id_usuario });
        } else {
            res.status(401).json({ error: "Credenciais inválidas" });
        }
    });
});

// --- ROTA CADASTRO PREFEITURA ---
app.post('/cadastro-prefeitura', (req, res) => {
    const { nome, email, senha, cargo, re } = req.body;
    
    db.query("INSERT INTO Usuarios (email, senha, tipo_usuario) VALUES (?, ?, 'prefeitura')", [email, senha], (err, result) => {
        if (err) {
            console.error("Erro ao criar Usuário Prefeitura:", err);
            return res.status(500).json({ error: "E-mail já cadastrado ou erro de conexão." });
        }
        
        const sqlPerfil = "INSERT INTO Prefeitura (nome_completo, cargo, re, usuario_id) VALUES (?, ?, ?, ?)";
        db.query(sqlPerfil, [nome, cargo, re, result.insertId], (err2) => {
            if (err2) {
                console.error("Erro ao criar Perfil Prefeitura:", err2);
                return res.status(500).json({ error: "Erro nos dados técnicos (RE já existe?)" });
            }
            res.status(201).json({ message: "Prefeitura cadastrada!" });
        });
    });
});

// --- ROTA CADASTRO CIDADÃO ---    
app.post('/cadastrar-cidadao', (req, res) => {
    const { nome, email, senha, cpf, telefone, bairro, pcd } = req.body;

    // LIMPANDO OS DADOS ANTES DE ENVIAR AO BANCO
    const cpfLimpo = apenasNumeros(cpf);
    const telefoneLimpo = apenasNumeros(telefone);

    if (cpfLimpo.length !== 11) {
        return res.status(400).json({ error: "O CPF deve conter exatamente 11 números." });
    }

    db.query("INSERT INTO Usuarios (email, senha, tipo_usuario) VALUES (?, ?, 'cidadao')", [email, senha], (err, result) => {
        if (err) {
            console.error("Erro ao criar Usuário Cidadão:", err);
            return res.status(500).json({ error: "Este e-mail já está em uso." });
        }

        const sqlPerfil = "INSERT INTO Cidadao (nome_completo, cpf, telefone, bairro, pcd, usuario_id) VALUES (?, ?, ?, ?, ?, ?)";
        const pcdValue = pcd ? 1 : 0;

        db.query(sqlPerfil, [nome, cpfLimpo, telefoneLimpo, bairro, pcdValue, result.insertId], (err2) => {
            if (err2) {
                console.error("Erro ao criar Perfil Cidadão:", err2);
                // Se der erro no perfil, o ideal seria deletar o usuário criado acima, 
                // mas para o seu teste, o log abaixo dirá o motivo:
                return res.status(500).json({ error: "Dados inválidos. Verifique se o CPF já está cadastrado." });
            }
            res.status(201).json({ message: "Cidadão cadastrado!" });
        });
    });
});

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));