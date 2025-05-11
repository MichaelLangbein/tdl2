import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanBoard, KanbanService } from 'src/app/services/kanban.service';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
    selector: 'app-kanbanboard',
    templateUrl: './kanbanboard.component.html',
    styleUrls: ['./kanbanboard.component.css'],
})
export class KanbanboardComponent {

    currentBoard$: Observable<KanbanBoard>;
    tree$: Observable<TaskTree | null>;

    constructor(private taskSvc: TaskService, private kanbanSvc: KanbanService) {
        this.currentBoard$ = this.kanbanSvc.getCurrentBoard();
        this.tree$ = this.taskSvc.watchTree();
    }

    allowDrop($event: DragEvent) {
      $event.preventDefault();
      $event.stopPropagation();
      const stringData = $event.dataTransfer?.getData('text');
      let taskId = undefined;
      if (stringData) {
        const data = JSON.parse(stringData);
        if (data.kanbanDraggedTask) {
          taskId = data.kanbanDraggedTask;
        }
      }
      if (!taskId) return false;
      return undefined;
    }

    onDrop($event: DragEvent, columnId: number) {
      $event.preventDefault();
      $event.stopPropagation();
      const stringData = $event.dataTransfer?.getData('text');
      if (stringData) {
        const data = JSON.parse(stringData);
        if (data.kanbanDraggedTask) {
          const taskId = data.kanbanDraggedTask;
          console.log(`dragged ${taskId} into column ${columnId}`);
        }
      }
    }

    onDragStart($event: DragEvent, taskId: number) {
        $event.dataTransfer?.setData('text', JSON.stringify({ 'kanbanDraggedTask': taskId }));
        console.log(`started dragging ${taskId}`);
    }

    focusOn(taskId: number) {
        console.log(`focussing on ${taskId}`)
    }
}
