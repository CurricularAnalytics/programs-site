<template>
    <md-list>
        <md-list-item v-for="program in programs" :key="program.layoutId">
            <!-- <router-link
                :to="{
                    name: 'root',
                    params: {
                        id: program.layoutId,
                        period: program.academicPeriod.id,
                        programName: program.name,
                    },
                }"
                class="md-list-item-text"
                >{{ program.fullName }}</router-link
            > -->
            <button @click="handleOnClick(program)">
                {{ program.fullName }}
            </button>
        </md-list-item>
    </md-list>
</template>

<script>
export default {
    name: "ProgramList",
    props: ["programs"],
    methods: {
        handleOnClick(program) {
            // console.log(program);
            this.$store.commit("setPeriod", program.academicPeriod.id);
            this.$store.commit("setPlanId", program.layoutId);
            this.$store.commit("setProgramName", program.fullName);
            this.$store.commit("setCip", program.cip);
            this.$store.commit("setDegreeType", program.degreeType);
            this.$store.dispatch("setDegreePlan");
        },
    },
};
</script>
