import { maxBy } from "lodash";
import { blackbriarInstance, caInstance } from "./http";

export default {
    state: {
        universityLayouts: [],
        degreePlan: {},
        programName: "Accounting",
        period: "108",
        planId: "7270",
        bbUrl: "bb-arizona-assets.s3-us-west-2.amazonaws.com",
        university: "university-of-arizona",
        loading: true,
    },
    mutations: {
        setUniversityLayouts(state, payload) {
            state.universityLayouts = payload;
        },
        setDegreePlan(state, payload) {
            state.degreePlan = payload;
        },
        setPeriod(state, payload) {
            state.period = payload;
        },
        setPlanId(state, payload) {
            state.planId = payload;
        },
        setProgramName(state, payload) {
            state.programName = payload;
        },
        setLoading(state, payload) {
            state.loading = payload;
        },
    },
    actions: {
        async setUniversityLayouts(state) {
            try {
                const res = await blackbriarInstance.get(
                    "/university-of-arizona/university_layouts.json"
                );
                state.commit("setUniversityLayouts", res.data);
            } catch (error) {
                console.log(error.response);
            }
        },
        async setDegreePlan(state) {
            try {
                state.commit("setLoading", true);
                const { bbUrl, university, period, planId } = state.state;
                const url = `/degree_plan?url=${bbUrl}&university=${university}&period=${period}&id=${planId}`;
                const res = await caInstance.get(url);
                state.commit("setDegreePlan", res.data);
                state.commit("setLoading", false);
            } catch (error) {
                console.log(error.response);
            }
        },
    },
    getters: {
        degreePlan(state) {
            return state.degreePlan;
        },
        colleges(state) {
            const colleges = {};
            state.universityLayouts.forEach(
                ({
                    college,
                    program,
                    university_layout_id,
                    academic_periods,
                    sub_program_level,
                    concentration,
                }) => {
                    const academicPeriod = maxBy(academic_periods, (o) => {
                        return o.id;
                    });

                    const { id, name } = college;
                    const { id: programId, name: programName } = program;
                    let fullName = programName;

                    if (concentration !== undefined) {
                        fullName += ` - ${concentration.name}`;
                    }

                    if (sub_program_level !== null) {
                        fullName += ` - (${sub_program_level.name})`;
                    }

                    const p = {
                        name: programName,
                        fullName,
                        academicPeriod,
                        layoutId: university_layout_id,
                        programId,
                        sub_program_level,
                        concentration,
                    };

                    if (id in colleges) {
                        const { programs } = colleges[id];
                        programs.push(p);
                    } else {
                        colleges[id] = {
                            name,
                            slug: name.replaceAll(" ", "-").toLowerCase(),
                            programs: [p],
                        };
                    }
                }
            );
            return colleges;
        },
    },
};
