const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco
const db = mysql.createConnection({
  host: "localhost", // Meu host
  user: "root",     // Meu usuario
  password: "",    // Minha senha
  database: ""    // Bnaco de dados
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    return;
  }
  console.log("MySQL conectado!");
});

// Rota de cadastro
app.post("/register", (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ error: "Preencha todos os campos" });

  // salva senha em texto puro
  db.query("INSERT INTO usuarios (usuario, senha) VALUES (?, ?)", [usuario, senha], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ error: "Usuário já existe" });
      }
      return res.status(500).json({ error: "Erro no servidor" });
    }
    res.json({ message: "Usuário registrado com sucesso!" });
  });
});

// Rota de login
app.post("/login", (req, res) => {
  const { usuario, senha } = req.body;
  if (!usuario || !senha) return res.status(400).json({ error: "Preencha todos os campos" });

  db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    if (results.length === 0) return res.status(401).json({ error: "Usuário não encontrado" });

    const user = results[0];

    // compara direto com a senha salva
    if (senha !== user.senha) return res.status(401).json({ error: "Senha incorreta" });

    res.json({ message: "Login realizado com sucesso!" });
  });
});

// Rota Recuperar senha
app.post("/forgot", (req, res) => {
  const { usuario } = req.body;
  if (!usuario) return res.status(400).json({ error: "Informe o usuário" });

  db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario], (err, results) => {
    if (err) return res.status(500).json({ error: "Erro no servidor" });
    if (results.length === 0) return res.status(404).json({ error: "Usuário não encontrado" });

    const user = results[0];
    res.json({ message: `Sua senha é: ${user.senha}` });
  });
});

// Iniciar servidor
app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000`);
});