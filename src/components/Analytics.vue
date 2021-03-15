<template>
    <div>
        <h1>{{ collegeName }}</h1>
        <degree-plan-viz :degreePlan="degreePlan" />
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
        // async fetchBBDegreePlan() {
        //     try {
        //         // fetch degree plan from blackbriar S3
        //         const res = await this.$blackbriarInstance.get(
        //             `university-of-arizona/academic_periods/${this.period}/university_layouts/${this.programId}.json`
        //         );
        //         this.$store.dispatch("setDegreePlan", res.data);
        //     } catch (error) {
        //         console.log(error.response);
        //     }
        // },
    },
};
</script>
