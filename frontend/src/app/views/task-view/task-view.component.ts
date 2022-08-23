import { Component, OnInit } from '@angular/core';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {

  public showCompletedModal = false;
  public lastCompletedTask: TaskTree | null = null;

  constructor(private taskSvc: TaskService) { }

  ngOnInit(): void {
    let lastTask: TaskTree | null = null;
    this.taskSvc.watchCurrentTask().subscribe(task => {
      if (task) {
        if (lastTask) {
          if (task.completed && task.id === lastTask.id && lastTask.completed !== task.completed) {
            this.showCompletedModal = true;
            this.lastCompletedTask = task;
          }
        }

        lastTask = { ... task };
      }
    })
  }

}
