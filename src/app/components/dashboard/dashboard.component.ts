import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Project } from 'src/app/models/project';
import { Team } from 'src/app/models/team';
import { ProjectsService } from 'src/app/services/projects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ProjectsService]
})
export class DashboardComponent implements OnInit {

  projects: Array<Project> = [];
  teams: Array<Team> = [];
  members: Array<{ id: number, name: string }> = [];

  constructor(private projectSvc: ProjectsService) { }

  ngOnInit(): void {
    //fetch the projects and teams from JSON files
    //proceed only after both the calls are over
    forkJoin({ projects: this.projectSvc.getProjects(), teams: this.projectSvc.getTeams() }).subscribe(({ projects, teams }) => {
      projects = projects.map(project => { return new Project(project) });
      this.projects = projects;
      this.projects.sort((a, b) => { return new Date(a.startDate) < new Date(b.startDate) ? -1 : 1 })
      this.teams = teams.map(team => { return new Team(team.name, team.members) });
      let allMembers: Array<string> = [];

      //converting to flat array and assuming that names are unique
      teams.forEach((team, index) => { allMembers = [...allMembers, ...team.members]; });
      allMembers.forEach((member, index) => { this.members.push({ id: index, name: member }) });

      this.projects.forEach(project => { project.updateParticipantIds(allMembers) });
    })
  }
}
