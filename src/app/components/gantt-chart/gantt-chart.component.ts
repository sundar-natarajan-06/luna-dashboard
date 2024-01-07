import { Component, Input, OnInit } from '@angular/core';
import { Gantt, Sort } from '@syncfusion/ej2-gantt';
import { Project } from 'src/app/models/project';
import { Team } from 'src/app/models/team';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.scss']
})
export class GanttChartComponent implements OnInit {

  @Input() projects: Array<Project> = [];
  @Input() teams: Array<Team> = [];
  @Input() members: Array<{ id: number, name: string }> = [];

  constructor() { }

  ngOnInit(): void {
    this.plotProjectGantt();
  }

  plotProjectGantt() {
    Gantt.Inject(Sort);

    // let tasks = Project.convertToTasks(this.projects);
    let gantt: Gantt = new Gantt({
      dataSource: this.projects,
      width: '100%',
      // height: '40%',
      taskFields: {
        id: 'id',
        name: 'title',
        startDate: 'startDate',
        endDate: 'launchDate',
        progress: 'progress',
        resourceInfo: 'participantIds',
      },
      columns: [
        //columns to be displayed in the table view 
        { field: 'title', headerText: 'Project', width: 200 },
        { field: 'startDate', headerText: 'Start Date', width: 110 },
        { field: 'launchDate', headerText: 'Launch Date', width: 110 },
        { field: 'progress', headerText: 'Progress', width: 10 },
        { field: 'blockedBy', headerText: 'Blocker' },
        { field: 'stage', headerText: 'Stage', width: 130 },
        { field: 'status', headerText: 'Status', width: 100 },
        { field: 'priority', headerText: 'Priority', width: 100 },
        { field: 'participantIds', headerText: 'Participants' }
      ], resourceFields: {
        id: 'id',
        name: 'name',
      },
      resources: this.members,
      allowSorting: true,
      toolbar: ['ZoomIn', 'ZoomOut', 'ZoomToFit'],
      labelSettings: {
        taskLabel: '${progress}%',
        leftLabel: 'stage',
        rightLabel: 'priority'
      },
      queryTaskbarInfo: (args: any) => {
        //if the project status is At risk, change the color of the progress bar to red else blue
        if (args.data['status'] == "At risk") {
          args.taskbarBgColor = "indianred";
          args.progressBarBgColor = "rgb(251 25 25 / 28%)";
        }
        else {
          args.taskbarBgColor = "rgb(0, 189, 174)";
          args.progressBarBgColor = "rgb(0 168 155)";
        }
      },
      timelineSettings: {
        timelineViewMode: 'Year',
        timelineUnitSize: 70
      },
      taskbarHeight: 20,
      rowHeight: 30
    });

    gantt.appendTo('#Gantt');
    gantt.fitToProject();
  }

}
