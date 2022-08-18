import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


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
      this.switchCurrentTask(tree);
    });
  }


  public addChildTask(title: string, description: string, parent: number | null) {
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

  public editCurrentTask(title: string, description: string, deadline: number | null) {
    const currentTask = this.currentTask$.value;
    if (currentTask) {
      currentTask.title = title;
      currentTask.description = description;
      currentTask.deadline = deadline;
      this.update(currentTask);
    }
  }

  public completeTask(task: TaskTree) {
    task.completed = new Date().getSeconds();
    this.update(task, true);
    const parentId = task.parent;
    if (!parentId) return;
    const parent = this.getTask(parentId);
    if (!parent) return;
    this.switchCurrentTask(parent);
  }

  public reactivateTask(task: TaskTree) {
    task.completed = null;
    this.update(task);
  }

  public switchCurrentTask(targetTask: TaskTree) {
    
    // 1: save any changes to currently active task
    const currentTask = this.currentTask$.value;
    if (currentTask) {
      this.update(currentTask);
    }

    // 2: lazy-load target-task's children
    if (targetTask.children.length === 0) {
      this.getSubTree(targetTask.id, 3).subscribe(subTree => {
          const fullTree = this.fullTree$.value;
          if (fullTree) {
            const newTree = updateSubtree(fullTree, subTree);
            this.fullTree$.next(newTree);
          }

          // 3: move to target
          this.currentTask$.next(targetTask);
      });
    } else {
      // 3: move to target
      this.currentTask$.next(targetTask);
    }

  }

  public deleteTask(task: TaskTree) {
    this.http.delete<TaskRow>(`http://localhost:1410/tasks/delete/${task.id}`).subscribe((parentRow: TaskRow) => {
      const tree = this.fullTree$.value;
      if (tree) {
        const newTree = removeBranch(tree, task.id);
        this.fullTree$.next(newTree);

        const parent = this.getTask(parentRow.id);
        if (!parent) return;
        this.switchCurrentTask(parent);
      }
    });
  }

  public estimateTime(task: TaskTree) {
    return this.http.get(`http://localhost:1410/tasks/${task.id}/estimate`);
  }





  

  private update(task: TaskTree, complete = false) {
    // you cannot update an already completed task ... except to complete it. :S
    if (!complete && task.completed) {
      console.error(`Cannot update an already completed task: `, task);
      return;
    };

    const timeDelta = Math.floor((new Date().getTime() - this.lastSwitch.getTime()) / 1000);
    task.secondsActive += timeDelta;
    this.lastSwitch = new Date();

    this.http.patch<TaskRow>(`http://localhost:1410/tasks/update`, {
      id: task.id,
      title: task.title,
      description: task.description,
      parent: task.parent,
      secondsActive: task.secondsActive,
      completed: task.completed,
      deadline: task.deadline
    }).subscribe((updated: TaskRow) => {
      if (this.fullTree$.value) {
        const newTree = updateTaskInTree(this.fullTree$.value, updated);
        this.fullTree$.next(newTree);
      }
    });
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