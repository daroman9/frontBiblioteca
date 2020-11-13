import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import Home from "./views/Home.vue";
import Inicio from "./views/Inicio.vue";
import Material_Prestamo from "./components/Material_Prestamo.vue";
import Areas from "./components/Areas.vue";
import Tipo_Material from "./components/Tipo_Material.vue";
import Dispositivos from "./components/Dispositivos.vue";
import Editoriales from "./components/Editoriales.vue";
import Prestamos from "./components/Prestamos.vue";
import Usuarios from "./components/Usuarios.vue";
import Login from "./components/Login.vue";

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
            path: "/usuarios",
            name: "usuarios",
            component: Usuarios,
            meta: {
                libre: true,
            },
        },
        {
            path: "/material_prestamo",
            name: "material_prestamo",
            component: Material_Prestamo,
            meta: {
                libre: true,
            },
        },
        {
            path: "/areas",
            name: "areas",
            component: Areas,
            meta: {
                libre: true,
            },
        },
        {
            path: "/tipo_material",
            name: "tipo_material",
            component: Tipo_Material,
            meta: {
                libre: true,
            },
        },
        {
            path: "/dispositivos",
            name: "dispositivos",
            component: Dispositivos,
            meta: {
                libre: true,
            },
        },
        {
            path: "/editoriales",
            name: "editoriales",
            component: Editoriales,
            meta: {
                libre: true,
            },
        },
        {
            path: "/prestamos",
            name: "prestamos",
            component: Prestamos,
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