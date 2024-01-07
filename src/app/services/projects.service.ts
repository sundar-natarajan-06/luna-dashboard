import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/project';
import { Observable } from 'rxjs/internal/Observable';
import { Team } from '../models/team';

@Injectable()
export class ProjectsService {

  constructor(private http: HttpClient) { }

  getProjects(): Observable<Array<Project>> {
    return this.http.get<Array<Project>>("/assets/data/projects.json");
  }

  getTeams(): Observable<Array<Team>> {
    return this.http.get<Array<Team>>("/assets/data/teams.json");
  }
}
