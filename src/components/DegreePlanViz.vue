<template>
    <div>
        <p>
            Curricular Complexity:
            <span v-show="complexity != -1">{{ complexity }}</span>
        </p>
        <p>
            Credit Hours: <span v-show="complexity != -1">{{ credits }}</span>
        </p>
        <p>
            <button @click="handleDownload()">Download</button>
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
import CSVBuilder from "../services/CSVBuilder";

export default {
    name: "DegreePlanViz",
    props: ["degreePlan", "options"],
    data: () => ({
        iframeUrl: process.env.VUE_APP_IFRAME_URL,
        complexity: -1,
        credits: -1,
        curriculum_terms: {}
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
        handleDownload() {
            console.log(this.degreePlan);
            const programName = this.$store.state.programName;
            const institutionName = this.$store.state.universityFullName;
            const degreeType = this.$store.state.degreeType;
            const systemType = "Semester";
            const cip = this.$store.state.cip;
            const terms = this.curriculum_terms;
            const csvString = CSVBuilder.create(programName, institutionName, degreeType, systemType, cip, terms).build();
            
            const anchor = document.createElement('a');
            anchor.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csvString)}`;
            anchor.target = "_blank";
            anchor.download = `${institutionName} - ${programName} (${degreeType}).csv`;
            anchor.click();
        },
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
                const { complexity, credits, curriculum_terms } = curriculum;
                this.complexity = complexity;
                this.credits = credits;
                this.curriculum_terms = curriculum_terms;
            }
        },
    },
};
</script>

<style lang="scss" scoped>
md-button {
    margin-left: 0;
}

.curriculum-visualization {
    width: 100%;
    border: none;
}

p {
    font-size: 20px;
    line-height: 0.6;
}
</style>
