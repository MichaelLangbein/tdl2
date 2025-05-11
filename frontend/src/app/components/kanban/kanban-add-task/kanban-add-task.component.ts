import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { KanbanBoard, KanbanService } from 'src/app/services/kanban.service';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
  selector: 'app-kanban-add-task',
  templateUrl: './kanban-add-task.component.html',
  styleUrls: ['./kanban-add-task.component.css']
})
export class KanbanAddTaskComponent {

  public showAddView = false;
  public currentBoard$: Observable<KanbanBoard | null>;
  public currentTask$: Observable<TaskTree | null>;

  constructor(private taskSvc: TaskService, private kanbanSvc: KanbanService) {
    this.currentBoard$ = this.kanbanSvc.getCurrentBoard();
    this.currentTask$ = this.taskSvc.watchCurrentTask();
  }

  addTaskToColumn(boardId: number, taskId: number, targetColumnId: number) {
    this.kanbanSvc.addTaskToColumn(boardId, targetColumnId, taskId).subscribe(_ => this.showAddView = false);
  }
}
