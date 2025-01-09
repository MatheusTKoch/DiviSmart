import { createWebHistory, createRouter } from "vue-router";

import HomeView from './components/Home.vue';
import NotFoundView from './components/Utilitarios/NotFound.vue';
import RegisterView from './components/Forms/Register.vue';
import LoginView from './components/Forms/Login.vue';
import CarteiraView from './components/Utilitarios/Carteira.vue';
import DividendosView from './components/Utilitarios/Dividendos.vue';
import RelatoriosView from './components/Utilitarios/Relatorios.vue';

const routes = [
    {path: '/', name:'home', component: HomeView},
    {path: '/register', name: 'register', component: RegisterView},
    {path: '/login', name: 'login', component: LoginView},
    {path: '/menu', name: 'menu', children:[
        {path: '/menu/carteira', component: CarteiraView},
        {path: '/menu/dividendos', component: DividendosView},
        {path: '/menu/relatorios', component: RelatoriosView},]},
    {path: '/not-found', name:'notFound', component: NotFoundView},
    {path: '/:catchAll(.*)*', redirect: '/not-found'}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;