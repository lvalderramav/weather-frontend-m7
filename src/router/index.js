// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import DetailView from "../views/DetailView.vue";
import AppLogin from "../views/AppLogin.vue";
import AppRegistro from "../views/AppRegistro.vue";
import MisPreferencias from "../views/MisPreferencias.vue";

const routes = [
    {
        path: "/",
        name: "home",
        component: HomeView,
    },
    {
        path: "/detalle/:id",
        name: "detalle",
        component: DetailView,
        props: true,
    },
    {
        path: "/login",
        name: "login",
        component: AppLogin,
    },
    {
        path: "/registro",
        name: "registro",
        component: AppRegistro,
    },
    {
        path: "/preferencias",
        name: "preferencias",
        component: MisPreferencias,
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
