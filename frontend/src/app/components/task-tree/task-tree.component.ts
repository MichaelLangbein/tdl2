import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.css']
})
export class TaskTreeComponent implements OnInit {
  tree$: Observable<TaskTree | null>;
  activeTask$: Observable<TaskTree | null>;
  showCompletedTasks$: Observable<boolean>;

  constructor(private taskSvc: TaskService) {
    this.tree$ = this.taskSvc.watchTree();
    this.activeTask$ = this.taskSvc.watchCurrentTask();
    this.showCompletedTasks$ = this.taskSvc.watchShowCompletedTasks();
  }

  ngOnInit(): void {
  }

  public toggleShowCompletedTasks() {
    this.taskSvc.toggleShowCompletedTasks();
  }

}
