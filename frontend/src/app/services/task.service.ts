import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, Observable, of } from 'rxjs';


export interface TaskTree {
  id: number,
  parent: number | null,
  title: string,
  description: string,
  started: number,
  completed: number | null,
  secondsActive: number,
  attachments: any[],
  children: TaskTree[],
  deadline: number | null
}

export interface TaskRow {
  id: number,
  parent: number | null,
  title: string,
  description: string,
  started: number,
  completed: number | null,
  secondsActive: number,
  deadline: number | null
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  /**
   * - Interface between frontend and backend
   * - Maps UI-actions to REST-calls
   * - Maintains state: currentTask, fullTree
   */

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

  public upcoming() {
    return this.http.get<TaskRow[]>(`http://localhost:1410/tasks/upcoming`);
  }

  public init() {
    this.getSubTree(1, 3).subscribe((tree: TaskTree) => {
      this.fullTree$.next(tree);
      this.switchCurrent(tree);
    });
  }


  public addChildToCurrent(title: string, description: string) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.http.post<TaskRow>(`http://localhost:1410/tasks/create`, { title, description, parent: currentTask.id }).subscribe((response: TaskRow) => {
      const newTask = {
        ... response,
        attachments: [],
        children: []
      };
      if (this.fullTree$.value) {
        const newTree = addChildToTree(this.fullTree$.value, newTask);
        this.fullTree$.next(newTree);
      }
      this.switchCurrent(newTask);
    })
  }

  public editCurrent(title: string, description: string, deadline: number | null) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.updateCurrent(title, description, currentTask.parent, null, deadline).subscribe(success => {});
  }

  public completeCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    const completed = new Date().getTime();
    this.updateCurrent(currentTask.title, currentTask.description, currentTask.parent, completed, currentTask.deadline).subscribe(updatedRow => {
      if (!updatedRow) return;
      const parentId = updatedRow.parent;
      if (!parentId) return;
      const parent = this.getTask(parentId);
      if (!parent) return;
      this.switchCurrent(parent);
    });
  }

  public reactivateCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.updateCurrent(currentTask.title, currentTask.description, currentTask.parent, null, currentTask.deadline, true).subscribe(success => {});
  }

  public switchCurrent(targetTask: TaskTree) {
    
    const currentTask = this.currentTask$.value;
    if (!currentTask) {
      this.currentTask$.next(targetTask);
      return;
    }
    
    // 1: save any changes to currently active task
    this.updateCurrent(currentTask.title, currentTask.description, currentTask.parent, currentTask.completed, currentTask.deadline).subscribe(success => {


      // 2: lazy-load target-task's children
      const alreadyLoaded = targetTask.children.length !== 0;

      if (!alreadyLoaded) {  // .. if not already loaded
        this.getSubTree(targetTask.id, 3).subscribe(subTree => {
            const fullTree = this.fullTree$.value;
            if (fullTree) {
              const newTree = updateSubtree(fullTree, subTree);
              this.fullTree$.next(newTree);
            }

            // 3: move to target
            this.currentTask$.next(targetTask);
        });
      }


      // 3: move to target
      if (alreadyLoaded) this.currentTask$.next(targetTask);
    });

  }

  public deleteCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;

    this.http.delete<TaskRow>(`http://localhost:1410/tasks/delete/${currentTask.id}`).subscribe((parentRow: TaskRow) => {
      const tree = this.fullTree$.value;
      if (!tree) return;
    
      const newTree = removeBranch(tree, currentTask.id);
      this.currentTask$.next(null);
      this.fullTree$.next(newTree);

      const parent = this.getTask(parentRow.id);
      if (!parent) return;
      this.switchCurrent(parent);
    });
  }

  public estimateCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;

    return this.http.get(`http://localhost:1410/tasks/${currentTask.id}/estimate`);
  }





  private updateCurrent(title: string, description: string, parent: number | null, completed: number | null, deadline: number | null, isReactivation = false): Observable<TaskRow | null> {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return of(null);

    if (currentTask.completed && !isReactivation) {
      console.error(`Cannot update an already completed task: `, currentTask);
      return of(null);
    };

    const timeDelta = Math.floor((new Date().getTime() - this.lastSwitch.getTime()) / 1000);
    const secondsActive = currentTask.secondsActive + timeDelta;
    this.lastSwitch = new Date();

    return this.http.patch<TaskRow>(`http://localhost:1410/tasks/update`, {
      id: currentTask.id,
      title: title,
      description: description,
      parent: parent,
      secondsActive: secondsActive,
      completed: completed,
      deadline: deadline
    }).pipe(
      tap((updated: TaskRow) => {
        if (this.fullTree$.value) {
          const newTree = updateTaskInTree(this.fullTree$.value, updated);
          this.fullTree$.next(newTree);
          const taskSubTree = this.getTask(updated.id);
          if (!taskSubTree) return;
          this.currentTask$.next(taskSubTree);
        }
      })
    );
  }

  private getSubTree(rootId: number, depth: number) {
    return this.http.get<TaskTree>(`http://localhost:1410/subtree/${rootId}/${depth}`);
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

function updateSubtree(tree: TaskTree, child: TaskTree) {
  if (tree.id === child.id) {
    return child;
  } else {
    for (let i = 0; i < tree.children.length; i++) {
      const candidate = tree.children[i];
      const updatedChild = updateSubtree(candidate, child);
      tree.children[i] = updatedChild;
    }
    return tree;
  }
}