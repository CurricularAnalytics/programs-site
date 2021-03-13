<template>
    <div class="page-container">
        <md-app md-mode="reveal" class="md-app">
            <md-app-toolbar class="md-dense md-primary" md-elevation="0">
                <md-button
                    class="md-icon-button"
                    @click="menuVisible = !menuVisible"
                >
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">UA Degree Plan Analytics</span>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0"
                    ><h2>Colleges</h2></md-toolbar
                >
                <college-list />
            </md-app-drawer>

            <md-app-content class="md-app-content">
                <md-content
                    ><h1>{{ collegeName }}</h1>
                    <degree-plan-viz :degreePlan="degreePlan" />
                </md-content>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import CollegeList from "./CollegeList.vue";
import DegreePlanViz from "./DegreePlanViz.vue";

export default {
    components: { DegreePlanViz, CollegeList },
    name: "Layout",
    data: () => ({
        menuVisible: false,
        degreePlan: {},
    }),
    created() {
        this.getDegreePlan();
    },
    computed: {
        collegeName() {
            return "College of Science";
        },
    },
    methods: {
        async getDegreePlan() {
            try {
                const res = await this.$caInstance.get("/");
                this.degreePlan = res.data;
            } catch (error) {
                console.log(error.response);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.page-container {
    position: relative;
    border: 1px solid rgba(#000, 0.12);
    height: 100%;
}

.md-title {
    font-weight: 800 !important;
    font-size: 22px;
    background-color: "black !important";
}

.md-content {
    padding: 28px;
    padding-top: 4px;
    padding-bottom: 0px;
}

.md-app {
    height: 100%;
}
</style>
