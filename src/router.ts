import { createWebHistory, createRouter } from "vue-router";

import HomeView from "./components/Home.vue";
import NotFoundView from "./components/Utilitarios/NotFound.vue";
import RegisterView from "./components/Forms/Register.vue";
import ForgotPasswordView from "./components/Forms/ForgotPassword.vue";
import ResetPasswordView from "./components/Forms/ResetPassword.vue";
import MenuView from "./components/Utilitarios/Menu.vue";
import CarteiraView from "./components/Utilitarios/Carteira.vue";
import DividendosView from "./components/Utilitarios/Dividendos.vue";
import RelatoriosView from "./components/Utilitarios/Relatorios.vue";

const routes = [
  { path: "/", name: "home", component: HomeView },
  { path: "/register", name: "register", component: RegisterView },
  { path: "/forgot-password", name: "forgot-password", component: ForgotPasswordView },
  { path: "/reset-password", name: "reset-password", component: ResetPasswordView },
  {
    path: "/menu",
    name: "menu",
    component: MenuView,
    children: [
      { path: "", name: "menuHome", component: MenuView },
      { path: "carteira", name: "carteira", component: CarteiraView },
      { path: "carteira/:cID", name: "carteiraAtivos", component: CarteiraView, props: true },
      { path: "dividendos", name: "dividendos", component: DividendosView },
      { path: "relatorios", name: "relatorios", component: RelatoriosView },
    ],
  },
  { path: "/not-found", name: "notFound", component: NotFoundView },
  { path: "/:catchAll(.*)*", redirect: "/not-found" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
