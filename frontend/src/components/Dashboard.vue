<template>
  <div class="min-h-screen bg-slate-100 p-8">

    <div class="max-w-7xl mx-auto">

      <!-- TOPO -->
      <div class="flex justify-between items-center mb-8">

        <div>
          <h1 class="text-4xl font-black text-purple-700">
            Dashboard Professor
          </h1>

          <p class="text-gray-500">
            Acompanhamento em tempo real
          </p>
        </div>

        <button
          @click="sair"
          class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
        >
          Sair
        </button>

      </div>

      <!-- TABELA -->
      <div class="bg-white rounded-3xl shadow-xl overflow-hidden">

        <table class="w-full">

          <thead class="bg-purple-600 text-white">

            <tr>

              <th class="p-5">
                Aluno
              </th>

              <th class="p-5">
                Pergunta
              </th>

              <th class="p-5">
                Resposta
              </th>

              <th class="p-5">
                Resultado
              </th>

              <th class="p-5">
                Pontos
              </th>

              <th class="p-5">
                Data
              </th>

            </tr>

          </thead>

          <tbody>

            <tr
              v-for="item in relatorio"
              :key="item.id"
              class="border-b text-center"
            >

              <td class="p-5 font-bold">
                {{ item.nome }}
              </td>

              <td class="p-5">
                {{ item.pergunta }}
              </td>

              <td class="p-5">
                {{ item.resposta_dada }}
              </td>

              <td class="p-5">

                <span
                  v-if="item.correta"
                  class="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold"
                >
                  Acertou
                </span>

                <span
                  v-else
                  class="bg-red-100 text-red-700 px-4 py-2 rounded-full font-bold"
                >
                  Errou
                </span>

              </td>

              <td class="p-5 font-bold">
                {{ item.pontos }}
              </td>

              <td class="p-5 text-sm">
                {{ formatar(item.data) }}
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </div>

  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const relatorio = ref([]);

const carregar = async () => {

  try {

    const res = await axios.get(
      "http://localhost:3000/dashboard-professor"
    );

    relatorio.value = res.data;

    console.log(res.data);

  } catch (err) {

    console.log(err);
  }
};

const formatar = (data) => {

  return new Date(data)
    .toLocaleString("pt-BR");
};

const sair = () => {

  localStorage.clear();

  location.reload();
};

onMounted(() => {

  carregar();

  setInterval(() => {

    carregar();

  }, 1000);
});
</script>