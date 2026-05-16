<!-- frontend/src/App.vue -->
<template>
  <div class="min-h-screen bg-yellow-50 p-4">
    <Login v-if="tela === 'login'" @logado="onLogado" />
    <Jogo v-if="tela === 'jogo'" :user="userLogado" />
    <Dashboard v-if="tela === 'professor'" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Login from './components/Login.vue';
import Jogo from './components/Jogo.vue';
import Dashboard from './components/Dashboard.vue';

const tela = ref('login');
const userLogado = ref(null);

const onLogado = (u) => {
  userLogado.value = u;
  tela.value = u.role === 'aluno' ? 'jogo' : 'professor';
};
</script>