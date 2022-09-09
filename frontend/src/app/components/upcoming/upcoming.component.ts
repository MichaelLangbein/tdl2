import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, map, pairwise } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.css']
})
export class UpcomingComponent implements OnInit {

  public tasks$ = new BehaviorSubject<any[]>([]);

  constructor(private taskSvc: TaskService) { }

  ngOnInit(): void {
    this.setUpcoming();
    this.taskSvc.watchCurrentTask().pipe(pairwise()).subscribe(([lastTask, currentTask]) => {
      const deadlineSet   = currentTask?.id === lastTask?.id && currentTask?.deadline !== lastTask?.deadline;
      const taskCompleted = currentTask?.id === lastTask?.id && currentTask?.completed !== lastTask?.completed;
      if (deadlineSet || taskCompleted) {
        this.setUpcoming();
      }
    });
  }

  private setUpcoming() {
    this.taskSvc.upcoming().pipe(
      map(tasks => {
        return tasks.map(t => {
          return {
            ...t,
            deadline: new Date(t.deadline!)
          };
        })
      })
    ).subscribe(tasks => {
      this.tasks$.next(tasks);
    });
  }

}
