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

            <md-app-drawer :md-active.sync="menuVisible" class="md-app-drawer">
                <md-toolbar class="md-transparent" md-elevation="0"
                    ><h2>Colleges</h2></md-toolbar
                >
                <college-list />
            </md-app-drawer>

            <md-app-content class="md-app-content">
                <md-content>
                    <!-- <router-view></router-view> -->
                    <analytics />
                </md-content>
            </md-app-content>
        </md-app>
    </div>
</template>

<script>
import Analytics from "./components/Analytics.vue";
import CollegeList from "./components/CollegeList.vue";

export default {
    components: { CollegeList, Analytics },
    name: "Layout",
    data: () => ({
        menuVisible: false,
    }),
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
}

.md-content {
    padding: 28px;
    padding-top: 4px;
    padding-bottom: 0px;
}
.md-app-drawer {
    width: fit-content;
}
.md-app {
    height: 100%;
}
</style>
