import { createWebHistory, createRouter } from "vue-router";

import HomeView from './components/Home.vue';
import NotFoundView from './components/NotFound.vue';
import RegisterView from './components/Register.vue';

const routes = [
    {path: '/', name:'home', component: HomeView},
    {path: '/register', name: 'register', component: RegisterView},
    {path: '/not-found', name:'notFound', component: NotFoundView},
    {path: '/:catchAll(.*)*', redirect: '/not-found'}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;