<template>
    <div>
        <p>
            Curricular Complexity:
            <span v-show="complexity != -1">{{ complexity }}</span>
        </p>
        <p>
            Credit Hours: <span v-show="complexity != -1">{{ credits }}</span>
        </p>
        <iframe
            id="curriculum"
            :src="iframeUrl"
            @load="onLoad"
            class="curriculum-visualization"
        />
    </div>
</template>

<script>
export default {
    name: "DegreePlanViz",
    props: ["degreePlan", "options"],
    data: () => ({
        iframeUrl: process.env.VUE_APP_IFRAME_URL,
        complexity: -1,
        credits: -1,
    }),
    mounted() {
        window.addEventListener("message", this.reveiveMessage);
    },
    beforeDestroy() {
        window.removeEventListener("message", this.reveiveMessage);
    },
    computed: {
        payload() {
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
                const { complexity, credits } = curriculum;
                this.complexity = complexity;
                this.credits = credits;
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

p {
    font-size: 20px;
    line-height: 0.6;
}
</style>
