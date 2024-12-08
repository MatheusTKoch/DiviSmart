import { createWebHistory, createRouter } from "vue-router";

import HomeView from './components/Home.vue';
import NotFoundView from './components/NotFound.vue';

const routes = [
    {path: '/', name:'home', component: HomeView},
    {path: '/not-found', name:'notFound', component: NotFoundView},
    {path: '/:catchAll(.*)*', redirect: '/not-found'}
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;