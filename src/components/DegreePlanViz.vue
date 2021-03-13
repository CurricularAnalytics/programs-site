<template>
    <iframe
        id="curriculum"
        src="//curricula-api-embed.damoursystems.com/"
        v-on:load="onLoad"
        class="curriculum-visualization"
    />
</template>

<script>
export default {
    name: "DegreePlanViz",
    props: ["degreePlan"],
    mounted() {
        window.addEventListener("message", this.reveiveMessage);
    },
    beforeDestroy() {
        window.removeEventListener("message", this.reveiveMessage);
    },
    methods: {
        onLoad(e) {
            e.currentTarget.contentWindow.postMessage(this.degreePlan, "*");
        },
        reveiveMessage(e) {
            const height = e.data.height;
            const curriculumIframe = document.getElementById("curriculum");

            if (height !== undefined) {
                curriculumIframe.style.height = 100 + height + "px";
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.curriculum-visualization {
    width: 100%;
    border: none;
}
</style>
