import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskService, Task } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-tree',
  templateUrl: './task-tree.component.html',
  styleUrls: ['./task-tree.component.css']
})
export class TaskTreeComponent implements OnInit {
  tree$: Observable<Task | null>;
  activeTask$: Observable<Task | null>;

  constructor(private taskSvc: TaskService) {
    this.tree$ = this.taskSvc.watchTree();
    this.activeTask$ = this.taskSvc.watchCurrentTask();
  }

  ngOnInit(): void {
  }

}
