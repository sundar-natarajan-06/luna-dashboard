import { GanttTask } from "./gantt-task";

export class Project {
    private title: string;
    priority: string;
    private progress: string;
    stage: string;
    private status: string;
    private labels: Array<string>;
    private risks: number;
    private _startDate!: string;
    private launchDate: string;
    private owner: string;
    private participants: Array<string>;
    private blockedBy: string;
    private blocking: string;
    private id: number;

    private participantIds: Array<number> = [];

    public set startDate(date: string) {
        this._startDate = date;
    }

    public get startDate() {
        return this._startDate;
    }

    constructor(input: Project) {
        this.title = input.title;
        this.priority = input.priority;
        this.progress = input.progress;
        this.stage = input.stage;
        this.status = input.status;
        this.labels = input.labels;
        this.risks = input.risks;
        this.startDate = input.startDate;
        this.launchDate = input.launchDate;
        this.owner = input.owner;
        this.participants = input.participants;
        this.blockedBy = input.blockedBy;
        this.blocking = input.blocking;
        this.id = input.id;
    }

    updateParticipantIds(allMembers: Array<string>) {
        this.participantIds = this.participants.map(ele => { return allMembers.indexOf(ele) });
        console.log("updated");
    }

    getParticipants() {
        return this.participants;
    }
}