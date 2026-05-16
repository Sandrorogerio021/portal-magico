<template>

  <div class="min-h-screen bg-yellow-50 flex flex-col items-center justify-center p-6">

    <div class="bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-xl mb-6 flex gap-6 items-center">

      <h2 class="font-black text-2xl">
        🌟 Pontos: {{ pontos }}
      </h2>

      <span class="font-bold text-lg">
        👦 {{ alunoNome }}
      </span>

      <button
        @click="sair"
        class="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold transition"
      >
        Sair
      </button>

    </div>

    <div class="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-xl text-center border-4 border-orange-300">

      <h1 class="text-4xl font-black text-purple-600 mb-8">
        🎮 DESAFIO DIVERTIDO
      </h1>

      <div class="bg-yellow-100 p-8 rounded-2xl mb-8 border-2 border-yellow-300 flex flex-col items-center justify-center gap-4">
        
        <span v-if="emojiDaForma" class="text-7xl animate-pulse select-none">
          {{ emojiDaForma }}
        </span>

        <h2 class="text-4xl font-black text-gray-700">
          {{ pergunta }}
        </h2>

      </div>

      <div class="grid grid-cols-2 gap-4">

        <button
          v-for="opcao in opcoes"
          :key="opcao"
          @click="responder(opcao)"
          class="bg-orange-400 hover:bg-orange-500 active:scale-95 transition-all text-white font-black text-3xl py-5 rounded-2xl shadow-lg"
        >
          {{ opcao }}
        </button>

      </div>

      <div
        v-if="feedback"
        class="mt-8 text-4xl font-black animate-bounce"
      >
        {{ feedback }}
      </div>

    </div>

  </div>

</template>

<script setup>

import { ref, onMounted } from "vue";

import axios from "axios";

import confetti from "canvas-confetti";

/* ==========================
   ESTADOS
========================== */

const pontos = ref(0);

const pergunta = ref("");

const respostaCorreta = ref("");

const opcoes = ref([]);

const feedback = ref("");

const emojiDaForma = ref("");

const alunoNome =
  localStorage.getItem("alunoNome");

const alunoId =
  localStorage.getItem("alunoId");

// PASSO 1: Configuração da URL da API dinâmica (Produção / Local)
const urlBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/* ==========================
   GERAR PERGUNTA
========================== */

const gerarPergunta = () => {

  emojiDaForma.value = "";

  const tipos = [
    "soma",
    "subtracao",
    "formas"
  ];

  const tipo =
    tipos[
      Math.floor(Math.random() * tipos.length)
    ];

  /* ======================
     MATEMÁTICA
  ====================== */

  if (
    tipo === "soma" ||
    tipo === "subtracao"
  ) {

    let n1 =
      Math.floor(Math.random() * 10);

    let n2 =
      Math.floor(Math.random() * 10);

    let resultado = 0;

    /* SOMA */

    if (tipo === "soma") {

      resultado = n1 + n2;

      pergunta.value =
        `Quanto é ${n1} + ${n2}?`;
    }

    /* SUBTRAÇÃO */

    else {

      if (n2 > n1) {

        [n1, n2] = [n2, n1];
      }

      resultado = n1 - n2;

      pergunta.value =
        `Quanto é ${n1} - ${n2}?`;
    }

    respostaCorreta.value =
      resultado;

    opcoes.value = [

      resultado,

      resultado + 1,

      resultado + 2,

      resultado - 1

    ].map(String).sort(
      () => Math.random() - 0.5
    );
  }

  /* ======================
     FORMAS GEOMÉTRICAS (COM DESENHOS)
  ===================== */

  else {

    const bancoFormas = [
      { nome: "CÍRCULO", lados: 0, dica: "parece uma bola de futebol", emoji: "🔴" },
      { nome: "TRIÂNGULO", lados: 3, dica: "parece uma asa-delta ou pedaço de pizza", emoji: "🔺" },
      { nome: "QUADRADO", lados: 4, dica: "tem quatro lados iguaizinhos", emoji: "🟪" },
      { nome: "LOSANGO", lados: 4, dica: "parece o formato de uma pipa", emoji: "🔷" },
      { nome: "PENTÁGONO", lados: 5, dica: "tem o formato parecido com uma casinha", emoji: "⬠" },
      { nome: "HEXÁGONO", lados: 6, dica: "tem o formato das colmeias de abelha", emoji: "⬡" },
      { nome: "HEPTÁGONO", lados: 7, dica: "é uma figura que possui sete lados", emoji: "🛑" },
      { nome: "OCTÓGONO", lados: 8, dica: "tem o mesmo formato de uma placa de PARE", emoji: "🛑" }
    ];

    const formaEscolhida = bancoFormas[Math.floor(Math.random() * bancoFormas.length)];
    
    emojiDaForma.value = formaEscolhida.emoji;

    const modeloPergunta = Math.random() > 0.5 ? "lados" : "identidade";

    if (modeloPergunta === "lados") {
      pergunta.value = `Quantos lados tem um ${formaEscolhida.nome}?`;
      respostaCorreta.value = String(formaEscolhida.lados);

      const num = formaEscolhida.lados;
      opcoes.value = [
        String(num),
        String(num + 1),
        String(num === 0 ? 2 : num - 1),
        String(num + 2)
      ].filter((value, index, self) => self.indexOf(value) === index);
      
      while(opcoes.value.length < 4) {
        opcoes.value.push(String(Math.floor(Math.random() * 10)));
      }

    } else {
      pergunta.value = `Qual forma geométrica ${formaEscolhida.dica}?`;
      respostaCorreta.value = formaEscolhida.nome;

      const outrasFormas = bancoFormas
        .filter(f => f.nome !== formaEscolhida.nome)
        .map(f => f.nome);
      
      const erradas = outrasFormas.sort(() => Math.random() - 0.5).slice(0, 3);
      
      opcoes.value = [formaEscolhida.nome, ...erradas];
    }

    opcoes.value.sort(() => Math.random() - 0.5);
  }
};

/* ==========================
   RESPONDER
========================== */

const responder = async (valor) => {

  const correta =
    String(valor) === String(respostaCorreta.value);

  /* ACERTOU */

  if (correta) {

    pontos.value += 10;

    feedback.value =
      "✅ ACERTOU!";

    confetti({

      particleCount: 150,

      spread: 100,

      origin: { y: 0.6 }

    });
  }

  /* ERROU */

  else {

    feedback.value =
      "❌ ERROU!";
  }

  /* SALVAR NO BANCO */

  try {

    // Utilizando a variável dinâmica urlBase
    await axios.post(
      `${urlBase}/salvar-resposta`,
      {

        aluno_id: alunoId,

        pergunta: pergunta.value,

        resposta_dada: String(valor),

        correta,

        pontos:
          correta ? 10 : 0

      }
    );

    console.log(
      "Resposta salva"
    );

  } catch (err) {

    console.log(err);
  }

  /* NOVA PERGUNTA */

  setTimeout(() => {

    feedback.value = "";

    gerarPergunta();

  }, 1500);
};

/* ==========================
   SAIR
========================== */

const sair = () => {

  localStorage.clear();

  location.reload();
};

/* ==========================
   INICIAR
========================== */

onMounted(() => {

  gerarPergunta();
});

</script>