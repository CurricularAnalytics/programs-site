<template>
    <div>
        <h1>{{ programName }}</h1>
        <md-progress-bar
            v-show="loading"
            md-mode="indeterminate"
        ></md-progress-bar>
        <degree-plan-viz
            v-if="hasDegreePlan"
            v-show="!loading"
            :degreePlan="!loading && degreePlan"
            :options="vizOptions"
            :key="key"
        />
    </div>
</template>

<script>
import DegreePlanViz from "./DegreePlanViz.vue";

export default {
    components: { DegreePlanViz },
    name: "Analytics",
    data: () => ({ key: 0 }),
    mounted() {
        this.$store.dispatch("setDegreePlan");
    },
    computed: {
        degreePlan() {
            this.forceRerender();
            return this.$store.getters.degreePlan;
        },
        programName() {
            return this.$store.state.programName;
        },
        vizOptions() {
            return {};
        },
        hasDegreePlan() {
            return Object.keys(this.degreePlan).length > 0;
        },
        loading() {
            return this.$store.state.loading;
        },
    },
    methods: {
        forceRerender() {
            this.key += 1;
        },
    },
};
</script>

<style lang="scss" scoped>
h1 {
    font-size: 28px !important;
    line-height: 1;
}
</style>
