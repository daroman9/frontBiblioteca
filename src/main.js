import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
axios.defaults.baseURL =
    //"http://demonaranjo-prod.us-west-2.elasticbeanstalk.com/api";
    //"http://caracterizacion-dev.us-west-2.elasticbeanstalk.com/api/";
    "https://localhost:44337/api/";

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount("#app");