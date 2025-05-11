import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  private currentBoard$ = new BehaviorSubject<KanbanBoard>({
    boardId: 1,
    title: "First board",
    created: new Date(),
    completed: undefined,
    columns: [
      {
        id: 1, 
        name: "waiting", 
        tasks: [
            {
              id: 2,
              title: "fdsafsd",
              description: "fdsafdsa",
              parent: 1,
              created: new Date().getTime(),
              completed: null,
              deadline: null,
              metadata: null,
              secondsActive: 10,
            }
        ]
      },
      {
        id: 2, 
        name: "busy", 
        tasks: [
            {
              id: 3,
              title: "fdsafsd",
              description: "fdsafdsa",
              parent: 2,
              created: new Date().getTime(),
              completed: null,
              deadline: null,
              metadata: null,
              secondsActive: 10,
            },
            {
              id: 5,
              title: "fdsafsd",
              description: "fdsafdsa",
              parent: 2,
              created: new Date().getTime(),
              completed: null,
              deadline: null,
              metadata: null,
              secondsActive: 10,
            }
        ]
      },
      {
        id: 3, 
        name: "done", 
        tasks: [
            {
              id: 4,
              title: "fdsafsd",
              description: "fdsafdsa",
              parent: 1,
              created: new Date().getTime(),
              completed: null,
              deadline: null,
              metadata: null,
              secondsActive: 10,
            }
        ]
      }
    ]
  })

  constructor(private apiSvc: ApiService) { }

  getBoards(): Observable<{boardId: number, title: string}[]> {
    return this.apiSvc.get("/kanban");
  }

  getCurrentBoard(): Observable<KanbanBoard> {
    return this.currentBoard$;
  }

  setCurrentBoard(boardId: number) {
    this.apiSvc.get<KanbanBoard>(`/kanban/${boardId}`).subscribe(board => this.currentBoard$.next(board));
  }

  createBoard(title: string, columns: string[]) {
    
  }

  moveTaskFromColumnIntoColumn(boardId: number, taskId: number, sourceColumnId: number, targetColumnId: number) {
    this.apiSvc.patch("/kanban/moveTask", {
      boardId,
      taskId, 
      sourceColumnId, 
      targetColumnId
    })
  }
}



export interface KanbanBoard {
  boardId: number,
  title: string,
  created: Date,
  completed?: Date,
  columns: KanbanColumn[]
}

export interface KanbanColumn {
  id: number,
  name: string,
  tasks: TaskRow[]
}

export interface TaskRow {
  id: number,
  title: string,
  description: string,
  parent: number,
  created: number,
  completed: number | null,
  secondsActive: number,
  deadline: number | null,
  metadata: string | null
}