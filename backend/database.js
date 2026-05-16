const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: "./database.sqlite"
  },
  useNullAsDefault: true
});

async function criarTabelas() {

  const existeUsers = await knex.schema.hasTable("users");

  if (!existeUsers) {

    await knex.schema.createTable("users", (table) => {

      table.increments("id").primary();

      table.string("nome");

      table.integer("idade");

      table.string("senha");

      table.string("role");

    });

    console.log("Tabela users criada");
  }

  const existeRespostas = await knex.schema.hasTable("respostas");

  if (!existeRespostas) {

    await knex.schema.createTable("respostas", (table) => {

      table.increments("id").primary();

      table.integer("aluno_id");

      table.string("pergunta");

      table.string("resposta_dada");

      table.boolean("correta");

      table.integer("pontos");

      table.timestamp("data").defaultTo(knex.fn.now());

    });

    console.log("Tabela respostas criada");
  }
}

criarTabelas();

module.exports = knex;