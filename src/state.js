import { blackbriarInstance } from "./http";

export default {
    state: {
        universityLayouts: {},
        selectedProgramId: 0,
    },
    mutation: {
        setSelectedProgramId(state, payload) {
            state.selectedProgramId = payload;
        },
    },
    actions: {
        async setUniversityLayouts(state) {
            try {
                const res = await blackbriarInstance.get(
                    "/university-of-arizona/university_layouts.json"
                );
                state.universityLayouts = res.data;
                // console.log(state.universityLayouts);
            } catch (error) {
                console.log(error.response);
            }
        },
    },
    getters: {
        colleges(state) {
            return state.universityLayouts;
        },
    },
};
