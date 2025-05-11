import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { KanbanBoard, KanbanService } from 'src/app/services/kanban.service';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
    selector: 'app-kanbanboard',
    templateUrl: './kanbanboard.component.html',
    styleUrls: ['./kanbanboard.component.css'],
})
export class KanbanboardComponent {

    currentBoard$: BehaviorSubject<KanbanBoard | null> = new BehaviorSubject<KanbanBoard | null>(null);
    currentTask$: BehaviorSubject<TaskTree | null> = new BehaviorSubject<TaskTree | null>(null);
    showEditModal = false;

    constructor(private taskSvc: TaskService, private kanbanSvc: KanbanService) {
        this.kanbanSvc.getCurrentBoard().subscribe(this.currentBoard$);
        this.taskSvc.watchCurrentTask().subscribe(this.currentTask$);
    }

    allowDrop($event: DragEvent) {
      $event.preventDefault();
      $event.stopPropagation();
    }

    onDrop($event: DragEvent, columnId: number) {
      $event.preventDefault();
      $event.stopPropagation();
      const stringData = $event.dataTransfer?.getData('text');
      if (stringData) {
        const data = JSON.parse(stringData);
        if (data.kanbanDraggedTask) {
          const boardId = this.currentBoard$.value?.boardId;
          const taskId = data.kanbanDraggedTask;
          const sourceColumn = data.kanbanDragSourceColumn;
          const targetColumn = columnId;
          if (!boardId) return;
          this.kanbanSvc.moveTaskFromColumnIntoColumn(boardId, taskId, sourceColumn, targetColumn).subscribe();
        }
      }
    }

    onDragStart($event: DragEvent, taskId: number, columnId: number) {
        $event.dataTransfer?.setData('text', JSON.stringify({ 'kanbanDraggedTask': taskId, 'kanbanDragSourceColumn': columnId }));
    }

    focusOn(taskId: number) {
        if (this.currentTask$.value?.id === taskId) this.showEditModal = true;
        else this.taskSvc.loadAndSwitch(taskId);
    }
}
