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
  private lastSwitch = new Date();
  
  constructor(private http: HttpClient) {
    this.currentTask$ = new BehaviorSubject<TaskTree | null>(null);
    this.fullTree$ = new BehaviorSubject<TaskTree | null>(null);
  }

  public watchTree(): Observable<TaskTree | null> {
    return this.fullTree$;
  }

  public watchCurrentTask(): Observable<TaskTree | null> {
    return this.currentTask$;
  }

  public getSubtree(id = 1, depth = 3) {
    this.http.get<TaskTree>(`http://localhost:1410/subtree/${id}/${depth}`).subscribe((tree: TaskTree) => {
      this.fullTree$.next(tree);
      this.switchCurrentTask(tree);
    });
  }

  public addChildTaskToCurrentTask(title: string, description: string, parent: number | null) {
    this.http.post<TaskRow>(`http://localhost:1410/tasks/create`, { title, description, parent }).subscribe((response: TaskRow) => {
      const newTask = {
        ... response,
        attachments: [],
        children: []
      };
      if (this.fullTree$.value) {
        const newTree = addChildToTree(this.fullTree$.value, newTask);
        this.fullTree$.next(newTree);
      }
      this.switchCurrentTask(newTask);
    })
  }

  public editCurrentTask(title: string, description: string) {
    const currentTask = this.currentTask$.value;
    if (currentTask) {
      currentTask.title = title;
      currentTask.description = description;
      this.update(currentTask);
    }
  }

  public switchCurrentTask(task: TaskTree) {
    const currentTask = this.currentTask$.value;
    if (currentTask) {
      this.update(currentTask);
    }
    this.lastSwitch = new Date();
    this.currentTask$.next(task);
  }

  public update(task: TaskTree) {
    const timeDelta = Math.floor((new Date().getTime() - this.lastSwitch.getTime()) / 1000);
    task.secondsActive += timeDelta;

    this.http.patch<TaskRow>(`http://localhost:1410/tasks/update`, {
      id: task.id,
      title: task.title,
      description: task.description,
      parent: task.parent,
      secondsActive: task.secondsActive,
      completed: task.completed
    }).subscribe((updated: TaskRow) => {
      if (this.fullTree$.value) {
        const newTree = updateTaskInTree(this.fullTree$.value, updated);
        this.fullTree$.next(newTree);
      }
    });
  }

  public deleteTask(task: TaskTree) {
    const parentId = task.parent;
    if (!parentId) return;
    const parent = this.getTask(parentId);
    if (!parent) return;
    this.http.delete<TaskRow>(`http://localhost:1410/tasks/delete/${task.id}`).subscribe((prnt: TaskRow) => {
      const tree = this.fullTree$.value;
      if (tree) {
        const newTree = removeBranch(tree, task.id);
        this.fullTree$.next(newTree);
        this.switchCurrentTask(parent);
      }
    });
  }

  private getTask(id: number): TaskTree | undefined {
    const tree = this.fullTree$.value;
    const task = getFirstWhere((node) => node.id === id, tree!);
    return task;
  }

}


function removeBranch(tree: TaskTree, id: number): TaskTree | null {
  doFirstWhere(
    (node: TaskTree) => node.children.map(c => c.id).includes(id),
    tree,
    (node: TaskTree) => node.children = node.children.filter(c => c.id !== id)
  );
  return tree;
}

function updateTaskInTree(tree: TaskTree, toUpdate: TaskRow) {
  doFirstWhere(
    node => node.id === toUpdate.id,
    tree,
    node => {
      node.title = toUpdate.title;
      node.description = toUpdate.description;
      node.completed = toUpdate.completed;
      node.parent = toUpdate.parent;
      node.secondsActive = toUpdate.secondsActive;
    }
  );
  return tree;
}

function addChildToTree(tree: TaskTree, child: TaskTree) {
  doFirstWhere(
    node => node.id === child.parent,
    tree,
    node => node.children.push(child)
  );
  return tree;
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