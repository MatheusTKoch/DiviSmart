import { createWebHistory, createRouter, RouteComponent } from "vue-router";

import HomeView from './components/Home.vue';
import NotFoundView from './components/NotFound.vue';
import RegisterView from './components/Register.vue';
import LoginView from './components/Login.vue';
import MenuView from "./components/Menu.vue";
import CarteiraView from './components/Carteira.vue';
import DividendosView from './components/Dividendos.vue';
import RelatoriosView from "./components/Relatorios.vue";

const routes = [
    {path: '/', name:'home', component: HomeView},
    {path: '/register', name: 'register', component: RegisterView},
    {path: '/login', name: 'login', component: LoginView},
    {path: '/menu', name: 'menu', component: MenuView, children:[
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