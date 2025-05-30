import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {

  private currentBoard$ = new BehaviorSubject<KanbanBoard | null>(null);

  constructor(private apiSvc: ApiService) { }

  getBoards(): Observable<{id: number, title: string}[]> {
    return this.apiSvc.get("/kanban");
  }

  getCurrentBoard(): Observable<KanbanBoard | null> {
    return this.currentBoard$;
  }

  setCurrentBoard(boardId: number) {
    this.apiSvc.get<KanbanBoard>(`/kanban/${boardId}`).subscribe(board => this.currentBoard$.next(board));
  }

  createBoard(title: string, columnNames: string[]) {
    const created = new Date()
    this.apiSvc.post<KanbanBoard>("/kanban/create", {
      title, created, columnNames
    }).subscribe(board => this.currentBoard$.next(board));
  }

  moveTaskFromColumnIntoColumn(boardId: number, taskId: number, sourceColumnId: number, targetColumnId: number) {
    return this.apiSvc.patch<KanbanBoard>("/kanban/moveTask", {
      boardId,
      taskId, 
      sourceColumnId, 
      targetColumnId
    }).pipe(tap(board => this.currentBoard$.next(board)));
  }

  addTaskToColumn(boardId: number, columnId: number, taskId: number) {
    return this.apiSvc.patch<KanbanBoard>("/kanban/addTask/", {boardId, columnId, taskId}).pipe(tap(board => this.currentBoard$.next(board)));
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