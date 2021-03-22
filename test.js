function OR(course_set, operands) {
    for (let i = 0; i < operands.length; i++) {
        if (operands[i].every((v) => course_set.includes(v.source_id))) {
            return operands[i];
        }
    }
    return [null];
}

function construct_req(course_set, req, target_id) {
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
                    type: concurrency_ind ? "coreq" : "prereq",
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
                construct_req(course_set, operands[i], target_id)
            );
        } else {
            courses.push(construct_req(course_set, operands[i], target_id));
        }
    }

    if (type === "or") {
        return OR(course_set, courses);
    }

    return courses;
}

const req = {
    type: "or",
    operands: [
        {
            type: "and",
            operands: [
                { type: "course", course: { id: 1 }, concurrency_ind: false },
                { type: "course", course: { id: 2 }, concurrency_ind: true },
                {
                    type: "or",
                    operands: [
                        {
                            type: "course",
                            course: { id: 3 },
                            concurrency_ind: false,
                        },
                        {
                            type: "course",
                            course: { id: 4 },
                            concurrency_ind: false,
                        },
                    ],
                },
            ],
        },
        {
            type: "and",
            operands: [
                { type: "course", course: { id: 5 }, concurrency_ind: false },
                { type: "course", course: { id: 6 }, concurrency_ind: false },
                { type: "course", course: { id: 7 }, concurrency_ind: false },
            ],
        },
    ],
};
const req1 = {
    type: "and",
    operands: [
        { type: "course", course: { id: 1 }, concurrency_ind: false },
        {
            type: "or",
            operands: [
                { type: "course", course: { id: 2 }, concurrency_ind: false },
                { type: "course", course: { id: 3 }, concurrency_ind: false },
                { type: "course", course: { id: 4 }, concurrency_ind: false },
            ],
        },
    ],
};

const course_set = [1];

console.log(construct_req(course_set, req1, 999));
