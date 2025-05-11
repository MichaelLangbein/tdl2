import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanBoard, KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-kanbanlist',
  templateUrl: './kanbanlist.component.html',
  styleUrls: ['./kanbanlist.component.css']
})
export class KanbanlistComponent {
  
  public boardItems$: Observable<{boardId: number, title: string}[]>;
  currentBoard$: Observable<KanbanBoard>;

  constructor(private kanbanSvc: KanbanService) {
    this.boardItems$ = this.kanbanSvc.getBoards();
    this.currentBoard$ = this.kanbanSvc.getCurrentBoard();
  }

  activate(boardId: number) {
    this.kanbanSvc.setCurrentBoard(boardId);
  }
}
