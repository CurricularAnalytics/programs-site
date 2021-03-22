const { default: axios } = require("axios");
const fs = require("fs");
// const program = require("./sample.json");

const COURSE_REQUIREMENT = "CourseRequirement";
const DEGREE_REQUIREMENT = "DegreeRequirement";
const FIRST_YEAR_COMPOSITION = "First-Year English Composition";
const cores = [
    "First-Year English Composition",
    "GE General Math Strand",
    "GE Substantial Math Strand",
    "GE Moderate Math Strand",
    "Tier I Individuals & Societies/150s",
    "Tier I Traditions & Cultures/160s",
    "Tier I Natural Sciences /170s",
    "Tier II Arts",
    "Tier II Humanities",
    "Tier II Natural Sciences",
    "Tier II Individual & Societies",
    "First Semester Second Language",
    "Second Semester Second Language",
    "Third Semester Second Language",
    "Fourth Semester Second Language",
    "Elective",
    "Minor",
    "Upper Division Elective",
    "Upper-Division Minor",
    "International Immersion",
    "Regional Study",
    "Second Language- 6th semester",
    "Second Language- 5th Semester",
    "AAS Required Course",
    "Tier II Arts and Humanities - CAST",
    "Tier II Individual & Societies - CAST Section 1",
    "Tier II Individual & Societies - CAST Section 2",
    "Tier II Natural Sciences - CAST",
];

const hardcoded_courses = {
    english_101: {
        id: 73818,
        name: "ENGL 101 - First-Year Composition",
        credit: 3,
        requisites: [],
    },
    english_102: {
        id: 78479,
        name: "ENGL 102 - First-Year Composition",
        credit: 3,
        requisites: [{ source_id: 73818, target_id: 78479, type: "prereq" }],
    },
};

const period = 108;
const layout_id = 7404; // CS BS

async function convert({ period, layout_id }) {
    const layout_url = `https://bb-arizona-assets.s3-us-west-2.amazonaws.com/json/universities/university-of-arizona/academic_periods/${period}/university_layouts/${layout_id}.json`;

    try {
        const res = await axios.get(layout_url);
        // console.log(res.data);
        const program = res.data;

        if (program.has_plans) {
            const course_set = new Set();
            let english_occured = false;

            const { period_degree_joins } = program;
            const major = period_degree_joins.find(
                (e) => e.degree_type.code === "MAJOR"
            );

            const { plan_period_joins } = major;
            const plan = plan_period_joins.find((e) => e.completed);

            const { plan_terms } = plan;

            const terms = plan_terms.map((term, i) => {
                const { name, plan_items } = term;

                // add all courses from this term into the course set
                plan_items.forEach((item) => {
                    const { requirement } = item;
                    if (
                        requirement !== null &&
                        requirement.type === COURSE_REQUIREMENT
                    ) {
                        course_set.add(requirement.course.id);
                    }
                });

                // construct the degree plan in the format used by the toolbox
                const items = plan_items.map((item) => {
                    const { requirement, credits, name, id } = item;

                    const isCourse =
                        requirement !== null &&
                        requirement.type === COURSE_REQUIREMENT;

                    let requisites = [];

                    // resolve prereqs and coreqs for the course
                    if (isCourse) {
                        const { prereq, coreq } = requirement.course;

                        requisites = [
                            ...req(course_set, prereq, requirement, false),
                            ...req(course_set, coreq, requirement, true),
                        ];
                    }

                    // always pick ENGL 101 and ENGL 102 for the frist year composition
                    if (!isCourse && name === FIRST_YEAR_COMPOSITION) {
                        if (!english_occured) {
                            english_occured = true;
                            return hardcoded_courses["english_101"];
                        } else {
                            return hardcoded_courses["english_102"];
                        }
                    }

                    return {
                        id: isCourse ? requirement.course.id : id,
                        name: isCourse ? requirement.course.full_name : name,
                        credits,
                        requisites,
                    };
                });

                return { id: i + 1, name, items };
            });

            const data = { terms };
            fs.writeFileSync(
                `${period}-${layout_id}.json`,
                JSON.stringify(data)
            );
            console.log(data);
        }
    } catch (error) {
        console.log(error.response);
    }
}

function OR(course_set, operands) {
    for (let i = 0; i < operands.length; i++) {
        if (operands[i].every((v) => course_set.includes(v.source_id))) {
            return operands[i];
        }
    }
    return [null];
}

function req(course_set, req, requirement, is_strict) {
    const reqs = construct_req(
        [...course_set],
        req,
        requirement.course.id,
        is_strict
    );

    if (reqs.includes(null)) {
        const type = is_strict ? "strict co-requisites" : "pre-requisites";
        // throw new Error(
        //     `Some ${type} are missing for course ${requirement.course.full_name}.`
        // );
        console.log(
            `Some ${type} are missing for course ${requirement.course.full_name}.`
        );
    }
    return reqs.filter((e) => e !== null);
}

function construct_req(course_set, req, target_id, is_strict = false) {
    if (req === null) {
        return [];
    }

    const { type } = req;

    // base case
    if (!["or", "and"].includes(type)) {
        if (type === "course") {
            const {
                course: { id },
                concurrency_ind,
            } = req;
            return [
                {
                    source_id: id,
                    target_id: target_id,
                    type: is_strict
                        ? "strict-creq"
                        : concurrency_ind
                        ? "coreq"
                        : "prereq",
                },
            ];
        }
        return []; // ignore custom and placement exam types
    }

    const { operands } = req;
    let courses = [];
    for (let i = 0; i < operands.length; i++) {
        if (type === "and") {
            courses = courses.concat(
                construct_req(course_set, operands[i], target_id, is_strict)
            );
        } else {
            courses.push(
                construct_req(course_set, operands[i], target_id, is_strict)
            );
        }
    }
    if (type === "or") {
        return OR(course_set, courses);
    }
    return courses;
}

convert({ period, layout_id });
