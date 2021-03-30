<template>
    <md-list>
        <md-list-item v-for="college in colleges" :key="college.slug">
            <md-content>
                <h4>{{ college.name }}</h4>
                <program-list :programs="college.programs" />
            </md-content>
        </md-list-item>
    </md-list>
</template>

<script>
import ProgramList from "./ProgramList.vue";
export default {
    components: { ProgramList },
    computed: {
        colleges() {
            return this.$store.getters.colleges;
        },
    },
};
</script>

<style lang="scss" scoped>
.md-list-item-text {
    color: black !important;
    text-decoration: none !important;
}

.md-list-item-text:hover {
    cursor: pointer;
}
</style>
