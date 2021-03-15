import Vue from "vue";
import Vuex from "vuex";
import {
    MdApp,
    MdList,
    MdContent,
    MdButton,
    MdToolbar,
    MdDrawer,
    MdIcon,
} from "vue-material/dist/components";
import "vue-material/dist/vue-material.min.css";
import App from "./App.vue";
import state from "./state";
import { blackbriarInstance, caInstance } from "./http";
import router from "./router";

require("dotenv").config();

Vue.config.productionTip = false;

// axios instances
Vue.prototype.$blackbriarInstance = blackbriarInstance;
Vue.prototype.$caInstance = caInstance;

// add vue material components
Vue.use(MdApp);
Vue.use(MdList);
Vue.use(MdContent);
Vue.use(MdButton);
Vue.use(MdToolbar);
Vue.use(MdDrawer);
Vue.use(MdIcon);

// vuex store
Vue.use(Vuex);
const store = new Vuex.Store(state);

// create a vue app
new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
