import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export interface TaskTree {
  id: number,
  parent: number | null,
  title: string,
  description: string,
  started: Date,
  completed: Date | null,
  secondsActive: number,
  attachments: any[],
  children: TaskTree[]
}

export interface TaskRow {
  id: number,
  parent: number | null,
  title: string,
  description: string,
  started: Date,
  completed: Date | null,
  secondsActive: number
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private currentTask$: BehaviorSubject<TaskTree | null>;
  private fullTree$: BehaviorSubject<TaskTree | null>;
  
  constructor(private http: HttpClient) {
    this.currentTask$ = new BehaviorSubject<TaskTree | null>(null);
    this.fullTree$ = new BehaviorSubject<TaskTree | null>(null);
  }

  public getSubtree(id = 1, depth = 3) {
    this.http.get<TaskTree>(`http://localhost:1410/subtree/${id}/${depth}`).subscribe((tree: TaskTree) => {
      this.fullTree$.next(tree);
      this.currentTask$.next(tree);
    });
  }

  
  createTask(title: string, description: string, parent: number | null) {
    this.http.post<TaskRow>(`http://localhost:1410/tasks/create`, { title, description, parent }).subscribe((response: TaskRow) => {
      const newTask = {
        ... response,
        attachments: [],
        children: []
      };
      this.currentTask$.value?.children.push(newTask);
      this.currentTask$.next(newTask);
    })
  }

  watchTree(): Observable<TaskTree | null> {
    return this.fullTree$;
  }

  watchCurrentTask(): Observable<TaskTree | null> {
    return this.currentTask$;
  }

  switchCurrentTask(task: TaskTree) {
    this.update(this.currentTask$.value!);
    this.currentTask$.next(task);
  }

  update(task: TaskTree) {
    this.http.patch<TaskRow>(`http://localhost:1410/tasks/update`, {
      id: task.id,
      title: task.title,
      description: task.description,
      parent: task.parent,
      secondsActive: task.secondsActive,
      completed: task.completed
    }).subscribe((updated: TaskRow) => {
      const newTree = this.updateState(updated);
      this.fullTree$.next(newTree);
    });
  }

  deleteTask(tree: TaskTree) {
    const parentId = tree.parent;
    if (!parentId) return;
    const parent = this.getTask(parentId);
    if (!parent) return;
    this.http.delete<TaskRow>(`http://localhost:1410/tasks/delete/${tree.id}`).subscribe((prnt: TaskRow) => {
      const newTree = this.removeBranch(tree.id);
      this.fullTree$.next(newTree);
      this.switchCurrentTask(parent);
    });
  }

  private getTask(id: number): TaskTree | undefined {
    const tree = this.fullTree$.value;
    const task = getFirstWhere((node) => node.id === id, tree!);
    return task;
  }

  private removeBranch(id: number): TaskTree | null {
    const tree = this.fullTree$.value;
    doFirstWhere(
      (node: TaskTree) => node.children.map(c => c.id).includes(id),
      tree!,
      (node: TaskTree) => node.children = node.children.filter(c => c.id !== id)
    );
    return tree;
  }

  private updateState(updated: TaskRow): TaskTree | null {
    const tree = this.fullTree$.value;
    doFirstWhere(
      (node: TaskTree) => node.children.map(c => c.id).includes(updated.id),
      tree!,
      (node: TaskTree) => {
        node.title = updated.title;
        node.description = updated.description;
        node.completed = updated.completed;
        node.parent = updated.parent;
        node.secondsActive = updated.secondsActive;
      }
    );
    return tree;
  }

}



function getWhere(predicate: (node: TaskTree) => boolean, tree: TaskTree) {

}

function getFirstWhere(predicate: (node: TaskTree) => boolean, tree: TaskTree): TaskTree | undefined {
  if (predicate(tree)) return tree;
  for (const child of tree.children) {
    const hit = getFirstWhere(predicate, child);
    if (hit) return hit;
  }
  return undefined;
}

function doFirstWhere(predicate: (node: TaskTree) => boolean, tree: TaskTree, action: (node: TaskTree) => void) {
  if (predicate(tree)) {
    action(tree);
    return true;
  }
  for (const child of tree.children) {
    const hit = doFirstWhere(predicate, child, action);
    if (hit) return true;
  }
  return false;
}