<template>
    <iframe
        id="curriculum"
        :src="iframeUrl"
        @load="onLoad"
        class="curriculum-visualization"
    />
</template>

<script>
export default {
    name: "DegreePlanViz",
    props: ["degreePlan", "options"],
    data: () => ({
        iframeUrl: process.env.VUE_APP_IFRAME_URL,
    }),
    mounted() {
        window.addEventListener("message", this.reveiveMessage);
    },
    beforeDestroy() {
        window.removeEventListener("message", this.reveiveMessage);
    },
    computed: {
        payload() {
            console.log("sdsfddsfs");
            return {
                options: this.options,
                curriculum: this.degreePlan,
                format: "verbose",
                exportFormat: "verbose",
            };
        },
    },
    methods: {
        onLoad(e) {
            e.currentTarget.contentWindow.postMessage(this.payload, "*");
        },
        reveiveMessage(e) {
            const { height, curriculum } = e.data;

            const curriculumIframe = document.getElementById("curriculum");
            if (height !== undefined) {
                curriculumIframe.style.height = 100 + height + "px";
            }

            if (curriculum !== undefined) {
                console.log(curriculum);
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
