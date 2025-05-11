import { Component } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { KanbanBoard, KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-kanbanlist',
  templateUrl: './kanbanlist.component.html',
  styleUrls: ['./kanbanlist.component.css']
})
export class KanbanlistComponent {
  
  public boardItems$: Observable<{id: number, title: string}[]>;
  public currentBoardId$: BehaviorSubject<number> = new BehaviorSubject(-1);

  constructor(private kanbanSvc: KanbanService) {
    this.boardItems$ = this.kanbanSvc.getBoards();
    this.kanbanSvc.getCurrentBoard().pipe(map(b => b?.boardId || -1)).subscribe(this.currentBoardId$);
  }

  activate(boardId: number) {
    this.kanbanSvc.setCurrentBoard(boardId);
  }
}
