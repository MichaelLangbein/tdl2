import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-kanbanlist',
  templateUrl: './kanbanlist.component.html',
  styleUrls: ['./kanbanlist.component.css']
})
export class KanbanlistComponent {
  
  public boardItems$: Observable<{boardId: number, title: string}[]>;

  constructor(private kanbanSvc: KanbanService) {
    this.boardItems$ = this.kanbanSvc.getBoards();
  }
}
