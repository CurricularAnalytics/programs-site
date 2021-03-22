<template>
    <div>
        <h1>{{ collegeName }}</h1>
        <degree-plan-viz :degreePlan="degreePlan" :options="vizOptions" />
    </div>
</template>

<script>
import DegreePlanViz from "./DegreePlanViz.vue";

export default {
    components: { DegreePlanViz },
    name: "Analytics",
    data: () => ({
        menuVisible: false,
        degreePlan: {},
    }),
    created() {
        this.fetchDegreePlan();
    },
    computed: {
        collegeName() {
            return this.$route.params.programName;
        },
        programId() {
            return this.$route.params.id;
        },
        period() {
            return this.$route.params.period;
        },
        vizOptions() {
            return {};
        },
    },
    methods: {
        async fetchDegreePlan() {
            try {
                // fetch mapped degree plan from the API
                const res = await this.$caInstance.get("/curriculum.json");
                this.degreePlan = res.data;
            } catch (error) {
                console.log(error.response);
            }
        },
    },
};
</script>

<style lang="scss" scoped>
h1 {
    font-size: 30px !important;
}
</style>
