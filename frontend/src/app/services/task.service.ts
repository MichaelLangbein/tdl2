import { BehaviorSubject, filter, map, Observable, of, tap } from "rxjs";

import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";


export interface Attachment {
  id: number;
  taskId: number;
  path: string;
}

export interface TaskTree {
  id: number;
  parent: number | null;
  title: string;
  description: string;
  started: number;
  completed: number | null;
  secondsActive: number;
  attachments: Attachment[];
  children: TaskTree[];
  deadline: number | null;
  metadata: string | null;
}

export interface TaskRow {
  id: number;
  parent: number | null;
  title: string;
  description: string;
  started: number;
  completed: number | null;
  secondsActive: number;
  deadline: number | null;
  metadata: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  /**
   * - Interface between frontend and backend
   * - Maps UI-actions to REST-calls
   * - Maintains state: currentTask, fullTree
   * - All actions only apply to the currently active task
   */

  private currentTask$: BehaviorSubject<TaskTree | null>;
  private fullTree$: BehaviorSubject<TaskTree | null>;
  private lastSwitch = new Date();
  // @TODO: maybe this should not come out of this service, but a `UIStateService`
  private showCompletedTasks$: BehaviorSubject<boolean>;

  constructor(private api: ApiService) {
    this.currentTask$ = new BehaviorSubject<TaskTree | null>(null);
    this.fullTree$ = new BehaviorSubject<TaskTree | null>(null);
    this.showCompletedTasks$ = new BehaviorSubject<boolean>(true);
  }

  public toggleShowCompletedTasks() {
    const currentState = this.showCompletedTasks$.value;
    this.showCompletedTasks$.next(!currentState);
  }

  public watchShowCompletedTasks(): Observable<boolean> {
    return this.showCompletedTasks$; 
  }

  public watchTree(): Observable<TaskTree | null> {
    return this.fullTree$;
  }

  public watchCurrentTask(): Observable<TaskTree | null> {
    return this.currentTask$;
  }

  public upcoming() {
    return this.api.get<TaskRow[]>(`/tasks/upcoming`);
  }

  public search(searchString: string) {
    return this.api.post<TaskRow[]>(`/tasks/search`, {
      searchString,
    });
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
    this.api
      .post<TaskRow>(`/tasks/create`, {
        title,
        description,
        parent: currentTask.id,
      })
      .subscribe((response: TaskRow) => {
        const newTask = {
          ...response,
          attachments: [],
          children: [],
        };
        if (this.fullTree$.value) {
          const newTree = addChildToTree(this.fullTree$.value, newTask);
          this.fullTree$.next(newTree);
        }
        this.switchCurrent(newTask);
      });
  }

  public addEmailChildTo(file: File, parentId: number) {
    this.api.uploadFormData<TaskRow>(
      `/tasks/create/emailtask/`, {
        parent: parentId + "",
        file: file,
      }).subscribe((response: TaskRow) => {
        if (this.fullTree$.value) {
          const newTask = {... response, children: [], attachments: (response as any).attachments || []};
          const newTree = addChildToTree(this.fullTree$.value, newTask);
          this.fullTree$.next(newTree);
          this.switchCurrent(newTree);
        }
    });
  }

  public addSiblingToCurrent(title: string, description: string) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.api
      .post<TaskRow>(`/tasks/create`, {
        title,
        description,
        parent: currentTask.parent,
      })
      .subscribe((response: TaskRow) => {
        const newTask = {
          ...response,
          attachments: [],
          children: [],
        };
        if (this.fullTree$.value) {
          const newTree = addChildToTree(this.fullTree$.value, newTask);
          this.fullTree$.next(newTree);
        }
        this.switchCurrent(newTask);
      });
  }

  public async moveCurrentTaskToParent(newParentId: number) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    const fullTree = this.fullTree$.value;
    if (!fullTree) return;
    this.updateCurrent(
      currentTask.title,
      currentTask.description,
      newParentId,
      null,
      currentTask.deadline
    ).subscribe((success) => {
      let newTree = removeBranch(fullTree, currentTask.id);
      if (newTree) {
        newTree = addChildToTree(newTree, this.currentTask$.value!);
        this.fullTree$.next(newTree);
      }
    });
  }

  public editCurrent(
    title: string,
    description: string,
    deadline: number | null
  ) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;

    this.updateCurrent(
      title,
      description,
      currentTask.parent,
      null,
      deadline
    ).subscribe((success) => {});
  }

  public completeCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    const completed = new Date().getTime();
    this.updateCurrent(
      currentTask.title,
      currentTask.description,
      currentTask.parent,
      completed,
      currentTask.deadline
    ).subscribe((updatedRow) => {
      if (!updatedRow) return;
      const parentId = updatedRow.parent;
      if (!parentId) return;
      const parent = this.getTask(parentId);
      if (!parent) return;
      this.switchCurrent(parent, false);
      
      // if task was an email-task, download the email
      if (currentTask.metadata?.includes("email")) {
        const emailMetaData = JSON.parse(currentTask.metadata); 
        const emailId = +(emailMetaData.email.attachmentId);
        if (emailId) this.downloadAttachmentFromCurrentTask(emailId);
      }
    });
  }

  public reactivateCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.updateCurrent(
      currentTask.title,
      currentTask.description,
      currentTask.parent,
      null,
      currentTask.deadline,
      true
    ).subscribe((success) => {});
  }

  public addFileToCurrent(file: File, filePath: string) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    const formData = new FormData();
    formData.append('file', file, filePath);
    this.api
      .post<TaskTree>(`/tasks/${currentTask.id}/addFile`, formData)
      .subscribe((updatedTask) => {
        this.currentTask$.next(updatedTask);
      });
  }

  public removeAttachmentFromCurrent(attachmentId: number) {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;
    this.api
      .delete<TaskTree>(`/tasks/${currentTask.id}/removeFile/${attachmentId}`)
      .subscribe((updatedTask) => {
        this.currentTask$.next(updatedTask);
      });
  }

  public downloadAttachmentFromCurrentTask(attachmentId: number) {
    const currentTask = this.currentTask$.value;
    console.log("downloading attachment for ", currentTask);
    if (!currentTask) return;
    this.api.open(`/tasks/${currentTask.id}/getFile/${attachmentId}`);
  }

  public loadAndSwitch(targetTaskId: number) {
    const tree = this.fullTree$.value;
    if (!tree) return;

    let targetTree = getFirstWhere(
      (node: TaskTree) => node.id === targetTaskId,
      tree
    );

    let target$: Observable<TaskTree>;
    if (targetTree) {
      target$ = of(targetTree);
    } else {
      target$ = this.downloadPathTo(targetTaskId, 3);
    }

    target$.subscribe((target) => {
      this.switchCurrent(target);
    });
  }

  private switchCurrent(targetTask: TaskTree, updateLastTask = true) {
    const currentTask = this.currentTask$.value;
    if (!currentTask || !updateLastTask) {
      this.currentTask$.next(targetTask);
      return;
    }

    // 1: save any changes to currently active task
    this.updateCurrent(
      currentTask.title,
      currentTask.description,
      currentTask.parent,
      currentTask.completed,
      currentTask.deadline
    ).subscribe((success) => {
      // 2: lazy-load target-task's children
      const alreadyLoaded = targetTask.children.length !== 0;

      if (!alreadyLoaded) {
        // .. if not already loaded
        this.getSubTree(targetTask.id, 3).subscribe((subTree) => {
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

    this.api
      .delete<TaskRow>(`/tasks/delete/${currentTask.id}`)
      .subscribe((parentRow: TaskRow) => {
        const tree = this.fullTree$.value;
        if (!tree) return;

        const newTree = removeBranch(tree, currentTask.id);
        this.fullTree$.next(newTree);

        const parent = this.getTask(parentRow.id);
        if (!parent) return;
        this.switchCurrent(parent, false);
      });
  }

  public estimateCurrent() {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return;

    return this.api.get(`/tasks/${currentTask.id}/estimate`);
  }

  private updateCurrent(
    title: string,
    description: string,
    parent: number | null,
    completed: number | null,
    deadline: number | null,
    isReactivation = false
  ): Observable<TaskRow | null> {
    const currentTask = this.currentTask$.value;
    if (!currentTask) return of(null);

    if (currentTask.completed && !isReactivation) {
      console.error(`Cannot update an already completed task: `, currentTask);
      return of(null);
    }

    const timeDelta = Math.floor(
      (new Date().getTime() - this.lastSwitch.getTime()) / 1000
    );
    const secondsActive = currentTask.secondsActive + timeDelta;
    this.lastSwitch = new Date();

    return this.api
      .patch<TaskRow>(`/tasks/update`, {
        id: currentTask.id,
        title: title,
        description: description,
        parent: parent,
        secondsActive: secondsActive,
        completed: completed,
        deadline: deadline,
      })
      .pipe(
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
    return this.api.get<TaskTree>(`/subtree/${rootId}/${depth}`);
  }

  private downloadPathTo(targetId: number, depth: number) {
    // 1. download path
    return this.getPathTo(targetId, depth).pipe(
      // 2. join with current tree
      tap((path: TaskTree) => {
        const tree = this.fullTree$.value;
        if (!tree) {
          this.fullTree$.next(path);
        } else {
          const mergedTree = mergeTreeIntoTree(tree, path);
          this.fullTree$.next(mergedTree);
        }
      }),
      map((path: TaskTree) => {
        return getSubTree(path, targetId)!;
      })
    );
  }

  private getPathTo(rootId: number, depth: number) {
    return this.api.get<TaskTree>(`/subtree/pathTo/${rootId}/${depth}`);
  }

  private getTask(id: number): TaskTree | undefined {
    const tree = this.fullTree$.value;
    const task = getFirstWhere((node) => node.id === id, tree!);
    return task;
  }
}

function removeBranch(tree: TaskTree, id: number): TaskTree | null {
  doFirstWhere(
    (node: TaskTree) => node.children.map((c) => c.id).includes(id),
    tree,
    (node: TaskTree) =>
      (node.children = node.children.filter((c) => c.id !== id))
  );
  return tree;
}

function updateTaskInTree(tree: TaskTree, toUpdate: TaskRow) {
  if (tree.id === toUpdate.id) {
    tree = {
      ...toUpdate,
      children: tree.children,
      attachments: tree.attachments,
    };
  } else {
    for (let i = 0; i < tree.children.length; i++) {
      const child = tree.children[i];
      const updatedChild = updateTaskInTree(child, toUpdate);
      tree.children[i] = updatedChild;
    }
  }
  return tree;
}

function addChildToTree(tree: TaskTree, child: TaskTree) {
  doFirstWhere(
    (node) => node.id === child.parent,
    tree,
    (node) => node.children.push(child)
  );
  return tree;
}

function getFirstWhere(
  predicate: (node: TaskTree) => boolean,
  tree: TaskTree
): TaskTree | undefined {
  if (predicate(tree)) return tree;
  for (const child of tree.children) {
    const hit = getFirstWhere(predicate, child);
    if (hit) return hit;
  }
  return undefined;
}

function doFirstWhere(
  predicate: (node: TaskTree) => boolean,
  tree: TaskTree,
  action: (node: TaskTree) => void
) {
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

function getSubTree(tree: TaskTree, id: number) {
  return getFirstWhere((node: TaskTree) => node.id === id, tree);
}

function mergeTreeIntoTree(intoTree: TaskTree, fromTree: TaskTree): TaskTree {
  for (const fromChild of fromTree.children) {
    const toChild = intoTree.children.find((c) => c.id === fromChild.id);
    if (toChild) {
      const newChild = mergeTreeIntoTree(toChild, fromChild);
      intoTree.children = intoTree.children.map((c) => {
        if (c.id === newChild.id) return newChild;
        return c;
      });
    } else {
      intoTree.children.push(fromChild);
    }
  }
  return intoTree;
}
