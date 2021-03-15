<template>
    <div id="app">
        <Layout />
    </div>
</template>

<script>
import Layout from "./Layout.vue";

export default {
    name: "App",
    components: {
        Layout,
    },
    mounted() {
        this.$store.dispatch("setUniversityLayouts");
    },
};
</script>

<style lang="scss">
@import "~vue-material/dist/theme/engine";

@include md-register-theme(
    "default",
    (
        primary: #c41e3a,
        accent: #c41e3a,
        theme: light,
    )
);

@import "~vue-material/dist/theme/all";

#app,
html,
body {
    height: 100%;
    margin: 0px;
    padding: 0px;
}
</style>
