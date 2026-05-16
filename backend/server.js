const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());

/* ==========================
   CADASTRO
========================== */

app.post("/register", async (req, res) => {

  try {

    const {
      nome,
      idade,
      senha,
      role
    } = req.body;

    const usuarioExiste = await db("users")
      .where({
        nome,
        role
      })
      .first();

    if (usuarioExiste) {

      return res.status(400).json({
        erro: "Usuário já existe"
      });
    }

    const dados = {
      nome,
      role
    };

    if (role === "aluno") {
      dados.idade = idade;
    }

    if (role === "professor") {
      dados.senha = senha;
    }

    const resultado = await db("users").insert(dados);

    res.json({
      sucesso: true,
      id: resultado[0]
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro no cadastro"
    });
  }
});

/* ==========================
   LOGIN
========================== */

app.post("/login", async (req, res) => {

  try {

    const {
      nome,
      idade,
      senha,
      role
    } = req.body;

    const user = await db("users")
      .where({
        nome,
        role
      })
      .first();

    if (!user) {

      return res.status(404).json({
        erro: "Usuário não encontrado"
      });
    }

    if (role === "aluno") {

      if (String(user.idade) !== String(idade)) {

        return res.status(401).json({
          erro: "Idade incorreta"
        });
      }
    }

    if (role === "professor") {

      if (user.senha !== senha) {

        return res.status(401).json({
          erro: "Senha incorreta"
        });
      }
    }

    res.json(user);

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro no login"
    });
  }
});

/* ==========================
   SALVAR RESPOSTAS
========================== */

app.post("/salvar-resposta", async (req, res) => {

  try {

    const {
      aluno_id,
      pergunta,
      resposta_dada,
      correta,
      pontos
    } = req.body;

    await db("respostas").insert({
      aluno_id,
      pergunta,
      resposta_dada,
      correta,
      pontos
    });

    res.json({
      sucesso: true
    });

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro ao salvar resposta"
    });
  }
});

/* ==========================
   DASHBOARD PROFESSOR
========================== */

app.get("/dashboard-professor", async (req, res) => {

  try {

    const dados = await db("respostas")
      .join(
        "users",
        "respostas.aluno_id",
        "=",
        "users.id"
      )
      .select(
        "users.nome",
        "respostas.id",
        "respostas.pergunta",
        "respostas.resposta_dada",
        "respostas.correta",
        "respostas.pontos",
        "respostas.data"
      )
      .orderBy("respostas.id", "desc");

    res.json(dados);

  } catch (erro) {

    console.log(erro);

    res.status(500).json({
      erro: "Erro ao carregar dashboard"
    });
  }
});

/* ==========================
   CONFIGURAÇÃO DINÂMICA DA PORTA (PRODUÇÃO / LOCAL)
========================== */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor do Portal Mágico rodando na porta ${PORT}`);
});