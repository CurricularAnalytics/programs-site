import Vue from "vue";
import Vuex from "vuex";
import "vue-material/dist/vue-material.min.css";
import VueMaterial from "vue-material";
import App from "./App.vue";
import state from "./state";
import { blackbriarInstance, caInstance } from "./http";

Vue.config.productionTip = false;

Vue.prototype.$blackbriarInstance = blackbriarInstance;
Vue.prototype.$caInstance = caInstance;

Vue.use(VueMaterial);

Vue.use(Vuex);
const store = new Vuex.Store(state);

new Vue({
    store,
    render: (h) => h(App),
}).$mount("#app");
