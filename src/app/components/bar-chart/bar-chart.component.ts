import { Component, Input, OnInit } from '@angular/core';
import { Project } from 'src/app/models/project';
import { Team, priority, stages } from 'src/app/models/team';
import { Chart, StackingColumnSeries, Category, Legend, Tooltip, ILoadedEventArgs, ChartTheme, Highlight } from '@syncfusion/ej2-charts';
import { Browser } from '@syncfusion/ej2-base';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit {

  @Input() projects: Array<Project> = [];
  @Input() teams: Array<Team> = [];
  @Input() members: Array<{ id: number, name: string }> = [];

  priorityCtrl: FormControl = new FormControl(priority);
  stageCtrl: FormControl = new FormControl(stages);
  teamCtrl: FormControl = new FormControl();
  priorities: Array<string> = priority;
  stageMaster: Array<string> = stages;

  chartObj?: Chart;

  constructor() { }

  ngOnInit(): void {
    this.processTeamData();
    this.plotChart();
    this.teamCtrl.setValue(this.teams[0].name);
  }

  plotChart() {
    Chart.Inject(StackingColumnSeries, Category, Legend, Tooltip, Highlight);
    this.chartObj = new Chart({

      //Initializing Primary X Axis
      primaryXAxis: {
        majorGridLines: { width: 0 },
        minorGridLines: { width: 0 },
        majorTickLines: { width: 0 },
        minorTickLines: { width: 0 },
        interval: 1,
        lineStyle: { width: 0 },
        labelIntersectAction: 'Rotate45',
        valueType: 'Category'
      },
      //Initializing Primary Y Axis
      primaryYAxis:
      {
        title: 'No. of Projects',
        lineStyle: { width: 0 },
        majorTickLines: { width: 0 },
        majorGridLines: { width: 1 },
        minorGridLines: { width: 1 },
        minorTickLines: { width: 0 },
        labelFormat: '{value}',
      },
      chartArea: {
        border: {
          width: 0
        }
      },
      //Initializing Chart Series
      series:
        //datasource for the bar graph. object structure in below comment
        //   {
        //     type: 'StackingColumn',
        //     dataSource: [
        //       { x: 'Eng1', y: 2006366 },
        //       { x: 'Eng2', y: 2165566 },
        //       { x: 'Eng3', y: 2279503 },
        //       { x: 'Eng4', y: 2359756 },
        //       { x: 'Eng5', y: 2505741 }],
        //     xName: 'x', width: 2,
        //     yName: 'y', name: 'Scoping', columnWidth: 0.6, border: { width: 1, color: "white" }

        //   }

        stages.filter(stage => this.stageCtrl.value.indexOf(stage) > -1).map(stage => {
          return {
            type: 'StackingColumn',
            dataSource:
              //considering the first team by default. when the team changes using the filter, data will change in onFilterChanged
              this.teams[0].membersWithProjectCount.map(member => {
                return {
                  x: member.name,
                  y: member[stage as keyof Object]?.length || 0
                }
              })
            ,
            xName: 'x', width: 2,
            yName: 'y', name: stage, columnWidth: 0.6, border: { width: 1, color: "white" }
          }
        }),
      //Initializing Chart title
      // title: 'Project Distribution',
      //Initializing User Interaction Tooltip
      tooltip: {
        enable: true
      },
      width: Browser.isDevice ? '100%' : '75%',
      legendSettings: {
        enableHighlight: true
      },
      load: (args: ILoadedEventArgs) => {
        let selectedTheme: string = location.hash.split('/')[1];
        selectedTheme = selectedTheme ? selectedTheme : 'Material';
        args.chart.theme = <ChartTheme>(selectedTheme.charAt(0).toUpperCase() +
          selectedTheme.slice(1)).replace(/-dark/i, 'Dark').replace(/contrast/i, 'Contrast');
      },
      axisLabelRender: function (args) {
        args.text = args.text.replace("0000000", "0M").replace("000000", "M");
      }
    });
    this.chartObj.appendTo('#Bar');
  }

  processTeamData() {
    //push the projects, stage wise, into each member object of the team
    this.teams.forEach(team => team.assignMembersWithProjectCount(this.projects));
    console.log(this.teams);
  }

  onFilterChanged(ev: any) {
    let teamIndex = 0;
    //find out teamIndex to display the members of the selected team
    if (this.teamCtrl.value) {
      this.teams.forEach((ele, ind) => {
        if (ele.name == this.teamCtrl.value)
          teamIndex = ind;
      })
    }
    try {
      if (this.chartObj) {
        //use only the selected stages
        this.chartObj.series = stages.filter(stage => this.stageCtrl.value.indexOf(stage) > -1).map(stage => {
          return {
            type: 'StackingColumn',
            dataSource:
              this.teams[teamIndex].membersWithProjectCount.map(member => {
                return {
                  x: member.name,
                  //use only the selected priorities 
                  y: (member[stage as keyof Object] as any)?.filter((project: Project) => this.priorityCtrl.value.indexOf(project.priority) > -1)?.length || 0
                }
              })
            ,
            xName: 'x', width: 2,
            yName: 'y', name: stage, columnWidth: 0.6, border: { width: 1, color: "white" }
          }
        })
      }
    }
    catch (ex) {

    }
  }
}
