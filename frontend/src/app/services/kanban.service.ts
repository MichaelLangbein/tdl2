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

  getCurrentBoard(): Observable<KanbanBoard> {
    const board: KanbanBoard = {
      boardId: 1,
      title: "First board",
      created: new Date(),
      completed: undefined,
      parentTask: {
        id: 1,
        title: "fdsafsd",
        description: "fdsafdsa",
        parent: 0,
        created: new Date().getTime(),
        completed: null,
        deadline: null,
        metadata: null,
        secondsActive: 10,
      },
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
    };
  
    return of(board);
  }

  activate(boardId: number) {
    throw new Error('Method not implemented.');
  }
}



export interface KanbanBoard {
  boardId: number,
  title: string,
  created: Date,
  completed?: Date,
  parentTask: TaskRow,
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