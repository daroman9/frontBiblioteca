import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";
import Inicio from "./views/Inicio.vue";
import Plantillas from "./components/Plantillas.vue";
import Categorias from "./components/Categorias.vue";
import Campos from "./components/Campos.vue";
import TablasCampos from "./components/TablasCampos.vue";
import Maestros from "./components/Maestros.vue";
import Maestros_Items from "./components/Maestros_Items.vue";
import Validaciones from "./components/Validaciones.vue";
import Login from "./components/Login.vue";


//Importaciones bibliotec
import Usuarios from "./components/Usuarios.vue";

Vue.use(Router);

var router = new Router({
    mode: "history",
    base: process.env.BASE_URL,
    routes: [{
            path: "/login",
            name: "home",
            component: Home,
            meta: {
                libre: true,
            },
        },
        {
            path: "/inicio",
            name: "inicio",
            component: Inicio,
            meta: {
                libre: true,
            },
        },
        {
            path: "/",
            name: "inicio",
            component: Inicio,
            meta: {
                libre: true,
            },
        },
        {
            path: "/plantillas",
            name: "plantillas",
            component: Plantillas,
            meta: {
                libre: true,
            },
        },
        {
            path: "/categorias",
            name: "categorias",
            component: Categorias,
            meta: {
                libre: true,
            },
        },
        {
            path: "/validaciones",
            name: "validaciones",
            component: Validaciones,
            meta: {
                libre: true,
            },
        },
        {
            path: "/maestros",
            name: "maestros",
            component: Maestros,
            meta: {
                libre: true,
            },
        },
        {
            path: "/maestros_items",
            name: "maestros_items",
            component: Maestros_Items,
            meta: {
                libre: true,
            },
        },
        {
            path: "/campos",
            name: "campos",
            component: Campos,
            meta: {
                libre: true,
            },
        },
        {
            path: "/tablasCampos",
            name: "tablasCampos",
            component: TablasCampos,
            meta: {
                libre: true,
            },
        },
        {
            path: "/login",
            name: "login",
            component: Login,
            meta: {
                libre: true,
            },
        },
        //Rutas Biblioteca
        {
            path: "/usuarios",
            name: "usuarios",
            component: Usuarios,
            meta: {
                libre: true,
            },
        },
    ],
});
router.beforeEach((to, from, next) => {
    if (to.matched.some((record) => record.meta.libre)) {
        next();
    } else {
        next({ name: "login" });
    }
});
export default router;