<template>
    <md-list>
        <md-list-item v-for="program in programs" :key="program.layoutId">
            <router-link
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
            >
        </md-list-item>
    </md-list>
</template>

<script>
export default {
    name: "ProgramList",
    props: ["programs"],
};
</script>
