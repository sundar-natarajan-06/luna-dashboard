import { Project } from "./project";

export const stages = ["Scoping", "Design", "Implementation", "Testing", "Launched", "Not Started"];
export const priority = ["P0", "P1", "P2"];

export class Team {
    name: string;
    members: Array<string>;
    membersWithProjectCount: Array<Member> = [];


    constructor(name: string, members: Array<string>) {
        this.name = name;
        this.members = members;
    }

    assignMembersWithProjectCount(projects: Array<Project>) {
        this.members.forEach(member => {
            let obj = { projects: projects.filter(project => project.getParticipants().indexOf(member) > -1), name: member }
            projects.forEach(project => {
                if (project.getParticipants().indexOf(member) > -1) {
                    // if (obj[project.priority as keyof Object]) {
                    //     if (obj[project.priority as keyof Object][project.stage as keyof Object])
                    //         (obj[project.priority as keyof Object][project.stage as keyof Object] as any).push(project);
                    //     else
                    //         (obj[project.priority as keyof Object][project.stage as keyof Object] as any) = [project];
                    // }
                    // else {
                    //     let x = {};
                    //     (x[project.stage as keyof Object] as any) = [project];
                    //     (obj[project.priority as keyof Object] as any) = x;
                    // }
                    if (obj[project.stage as keyof Object]) {
                        (obj[project.stage as keyof Object] as any).push(project);
                    }
                    else {
                        (obj[project.stage as keyof Object] as any) = [project];
                    }
                }
            })
            this.membersWithProjectCount?.push(obj);
        })
    }
}

class Member {
    name: string = "";
    projects: Array<Project> = [];
}