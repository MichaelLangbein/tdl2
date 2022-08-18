import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {

  public tasks: any[] = [];

  constructor(private taskSvc: TaskService) { }

  ngOnInit(): void {
    this.taskSvc.upcoming().pipe(
      map(tasks => {
        return tasks.map(t => {
          return {
            ...t,
            deadline: new Date(t.deadline!)
          };
        })
      })
    ).subscribe(tasks => this.tasks = tasks);
  }

}
