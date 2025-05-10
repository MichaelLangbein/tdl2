import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  constructor() { }

  getBoards(): Observable<{boardId: number, title: string}[]> {
    return of([{boardId: 1, title: "fdsa"}, {boardId: 2, title: "fdsafds"}]);
  }
  
}
