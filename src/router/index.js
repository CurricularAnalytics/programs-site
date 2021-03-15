import Vue from "vue";
import Router from "vue-router";
import Analytics from "../components/Analytics.vue";

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        {
            path: "/:programName/:period/:id",
            name: "root",
            component: Analytics,
        },
    ],
});
