export default class CSVBuilder {
    constructor(program, institution, degreeType, systemType, cip, terms) {
        console.log(terms)
        this.institution = institution;
        this.header = `Curriculum,${program}` + ",,,,,,,,\n"
            + `Institution,${institution}` + ",,,,,,,,\n"
            + `Degree Type,${degreeType}` + ",,,,,,,,\n"
            + `System Type,${systemType}` + ",,,,,,,,\n"
            + `CIP,${cip}` + ",,,,,,,,\n";
        this.terms = terms;
    }

    static create(program, institution, degreeType, systemType, cip, terms) {
        return new CSVBuilder(program, institution, degreeType, systemType, cip, terms);
    }

    build() {
        return this.header
                + "Courses" + ",,,,,,,,,\n"
                + "Course ID,Course Name,Prefix,Number,Prerequisites,Corequisites,Strict-Corequisites,Credit Hours,Institution,Canonical Name" + "\n"
                + this.buildCourses();
    }

    buildCourses() {
        const courseIdMap = {};
        let courseString = "";
        let counter = 1;
        console.log(this.terms);
        this.terms.forEach(({ curriculum_items }) => {
            curriculum_items.forEach((item) => {
                const { id, name, credits, curriculum_requisites } = item;
                courseIdMap[id] = counter;
                let courseName = ""
                let coursePrefix = "";
                let courseNum = "";
                let prereq = "";
                let coreq = "";
                let strictCoreq = "";
                let canonicalName = "";

                // handle course name and code
                if (name.match(/[A-Z]+\s\d{3}[A-Z]{0,1}\s-\s(.*)/)) {
                    const s1 = name.split(" - ");
                    const s2 = s1[0].split(" ");
                    coursePrefix = s2[0];
                    courseNum = s2[1];
                    courseName = s1.slice(1).join(" - ");
                } else {
                    courseName = name;
                }

                // handle course requisites
                curriculum_requisites.forEach((req) => {
                    const { source_id, type } = req;
                    const courseId = courseIdMap[source_id] ? courseIdMap[source_id] : "";
                    switch(type) {
                        case "prereq":
                            if (prereq === "") {
                                prereq = courseId;
                            } else {
                                prereq += courseId === "" ? "" + courseId : "";
                            }
                            break;
                        case "coreq":
                            if (coreq === "") {
                                coreq = courseId;
                            } else {
                                coreq += courseId === "" ? "" + courseId : "";
                            }
                            break;
                        case "strict-coreq":
                            if (strictCoreq === "") {
                                strictCoreq = courseId;
                            } else {
                                strictCoreq += courseId === "" ? "" + courseId : "";
                            }
                            break;
                        default:
                            break;
                    }
                })
                
                courseString += `${counter},"${courseName}",${coursePrefix},${courseNum},${prereq},${coreq},${strictCoreq},${credits},${this.institution},${canonicalName}\n`;
                counter ++;
            })
        })
        return courseString;
    }
}