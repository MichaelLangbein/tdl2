import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { BehaviorSubject, map, Observable, tap } from "rxjs";
import { TaskService, TaskTree } from "./task.service";

export interface ScheduleInfo {taskId: number, title: string, parentTitle: string, date: Date};

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  
    currentTree$: BehaviorSubject<TaskTree | null>;

  constructor(private api: ApiService, private taskSvc: TaskService) {
    this.currentTree$ = new BehaviorSubject<TaskTree | null>(null);
    this.taskSvc.watchTree().subscribe(this.currentTree$);
  }

  public schedule() {
    return this.api.get<{taskId: number, date: string}[]>("/schedule").pipe(
      map((result) => {
        const currentTree = this.currentTree$.getValue();

        const output: ScheduleInfo[] = [];
        if (!currentTree) return output;

        for (const scheduledTask of result) {
            const task = getFirstWhere(node => node.id === scheduledTask.taskId, currentTree);
            const parent = getFirstWhere(node => node.children.map(c => c.id).includes(scheduledTask.taskId), currentTree);

            if (!task) continue;
            output.push({
                taskId: task.id,
                title: task.title,
                parentTitle: parent?.title || "",
                date: new Date(scheduledTask.date)
            });
        };

        return output;
      })
    );
  }
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