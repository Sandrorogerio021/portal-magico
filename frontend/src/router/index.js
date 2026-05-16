import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Jogo from '../components/Jogo.vue'; // Verifique se renomeou o arquivo
import Dashboard from '../components/Dashboard.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/jogo', component: Jogo },
  { path: '/dashboard', component: Dashboard }
];

export default createRouter({
  history: createWebHistory(),
  routes
});