import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, delay, filter, map, Observable, pairwise, switchMap } from 'rxjs';
import { TaskRow, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {

  public tasks$!: Observable<any[]>;

  constructor(private taskSvc: TaskService) { }

  ngOnInit(): void {
    this.tasks$ = this.taskSvc.watchCurrentTask()
      .pipe(
        // get last and current
        pairwise(),
        // check if update is required
        filter(([lastTask, currentTask]) => {
          const newView       = lastTask === null || currentTask === null;
          const deadlineSet   = currentTask?.id === lastTask?.id && currentTask?.deadline !== lastTask?.deadline;
          const taskCompleted = currentTask?.id === lastTask?.id && currentTask?.completed !== lastTask?.completed;
          return newView || deadlineSet || taskCompleted;
        }),
        // get upcoming
        switchMap(() => {
          return this.taskSvc.upcoming()
        }),
        // format
        map((upcomingTasks: TaskRow[]) => {
          return upcomingTasks.map(t => {
            return {
              ...t,
              deadline: new Date(t.deadline!)
            };
          })
        })
      );
  }


}
