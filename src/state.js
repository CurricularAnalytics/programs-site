import { maxBy } from "lodash";
import { blackbriarInstance } from "./http";

export default {
    state: {
        universityLayouts: [],
    },
    mutations: {
        setUniversityLayouts(state, payload) {
            state.universityLayouts = payload;
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
    },
    getters: {
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
