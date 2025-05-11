import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KanbanService } from 'src/app/services/kanban.service';

@Component({
  selector: 'app-kanban-create',
  templateUrl: './kanban-create.component.html',
  styleUrls: ['./kanban-create.component.css']
})
export class KanbanCreateComponent {

  constructor(private kanbanSvc: KanbanService) {}

  public showCreateBoardForm = false;

  public createBoardForm = new FormGroup({
      title: new FormControl('title', [Validators.required, Validators.minLength(2)]),
      columns: new FormControl('backlog, ongoing, waiting, done', [Validators.required, Validators.minLength(2)])
  });
  
  public createBoard() {
    const title = this.createBoardForm.value.title;
    const columns = this.createBoardForm.value.columns?.split(",").map(s => s.trim());
    if (title && columns && columns.length > 0) {
      this.kanbanSvc.createBoard(title, columns);
      this.showCreateBoardForm = false;
    }
  }

}
