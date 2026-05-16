<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat" style="background-image: url('/fronteira-de-jardim-de-infancia-brincalhao-com-rabiscos-de-lapis_107791-32012.avif');">

    <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">

      <h1 class="text-3xl font-black text-center text-orange-500 mb-6">
        BEM-VINDO 🚀
      </h1>

      <div class="flex gap-3 justify-center mb-6">

        <button
          @click="role = 'aluno'"
          :class="role === 'aluno'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200'"
          class="px-5 py-2 rounded-full font-bold"
        >
          Sou Aluno
        </button>

        <button
          @click="role = 'professor'"
          :class="role === 'professor'
            ? 'bg-purple-500 text-white'
            : 'bg-gray-200'"
          class="px-5 py-2 rounded-full font-bold"
        >
          Sou Professor
        </button>

      </div>

      <div class="flex gap-2 mb-6 justify-center">

        <button
          @click="modo = 'login'"
          :class="modo === 'login'
            ? 'bg-green-500 text-white'
            : 'bg-gray-200'"
          class="px-4 py-2 rounded-xl font-bold"
        >
          Entrar
        </button>

        <button
          @click="modo = 'cadastro'"
          :class="modo === 'cadastro'
            ? 'bg-orange-500 text-white'
            : 'bg-gray-200'"
          class="px-4 py-2 rounded-xl font-bold"
        >
          Cadastrar
        </button>

      </div>

      <input
        v-model="form.nome"
        type="text"
        placeholder="Digite seu nome"
        class="w-full p-4 border-2 rounded-xl mb-4"
      />

      <input
        v-if="role === 'aluno'"
        v-model="form.idade"
        type="number"
        placeholder="Digite sua idade"
        class="w-full p-4 border-2 rounded-xl mb-4"
      />

      <input
        v-if="role === 'professor'"
        v-model="form.senha"
        type="password"
        placeholder="Digite sua senha"
        class="w-full p-4 border-2 rounded-xl mb-4"
      />

      <button
        @click="acao"
        class="w-full bg-green-500 hover:bg-green-600 text-white font-black py-4 rounded-2xl"
      >
        {{ modo === 'login'
          ? 'ENTRAR'
          : 'CADASTRAR' }}
      </button>

      <p
        v-if="erro"
        class="text-red-500 font-bold mt-4 text-center"
      >
        {{ erro }}
      </p>

    </div>

  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import axios from "axios";

const emit = defineEmits(["logado"]);

const role = ref("aluno");

const modo = ref("login");

const erro = ref("");

const form = reactive({
  nome: "",
  idade: "",
  senha: ""
});

// PASSO 1: Configuração da URL da API dinâmica (Produção / Local)
const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/* ==========================
   CADASTRAR
========================== */

const cadastrar = async () => {

  try {

    // Ajustado para usar a variável urlBase com Template Literals
    const res = await axios.post(
      `${urlBase}/register`,
      {
        nome: form.nome,
        idade: form.idade,
        senha: form.senha,
        role: role.value
      }
    );

    /* LOGIN AUTOMÁTICO */

    localStorage.setItem(
      "alunoNome",
      form.nome
    );

    localStorage.setItem(
      "alunoId",
      res.data.id
    );

    emit("logado", {
      id: res.data.id,
      nome: form.nome,
      role: role.value
    });

  } catch (err) {

    erro.value =
      err.response?.data?.erro
      || "Erro no cadastro";
  }
};

/* ==========================
   LOGIN
========================== */

const login = async () => {

  try {

    // Ajustado para usar a variável urlBase com Template Literals
    const res = await axios.post(
      `${urlBase}/login`,
      {
        nome: form.nome,
        idade: form.idade,
        senha: form.senha,
        role: role.value
      }
    );

    localStorage.setItem(
      "alunoNome",
      res.data.nome
    );

    localStorage.setItem(
      "alunoId",
      res.data.id
    );

    emit("logado", res.data);

  } catch (err) {

    erro.value =
      err.response?.data?.erro
      || "Erro no login";
  }
};

/* ==========================
   AÇÃO
========================== */

const acao = () => {

  erro.value = "";

  if (modo.value === "login") {

    login();

  } else {

    cadastrar();
  }
};
</script>