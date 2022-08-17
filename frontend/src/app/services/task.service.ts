import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


export interface Task {
  id: number,
  parent: number | null,
  title: string,
  description: string,
  started: Date,
  completed: Date | null,
  secondsActive: number,
  attachments: any[],
  children: Task[]
}


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private currentTask$: BehaviorSubject<Task | null>;
  private fullTree$: BehaviorSubject<Task | null>;
  
  constructor(private http: HttpClient) {
    this.currentTask$ = new BehaviorSubject<Task | null>(null);
    this.fullTree$ = new BehaviorSubject<Task | null>(null);
  }

  public getSubtree(id = 1, depth = 3) {
    this.http.get<Task>(`http://localhost:1410/subtree/${id}/${depth}`).subscribe((tree: Task) => {
      this.fullTree$.next(tree);
      this.currentTask$.next(tree);
    });
    // const subTree: Task = {
    //   parent: null,
    //   id: 0,
    //   title: "base",
    //   description: "desc",
    //   started: new Date(),
    //   completed: null,
    //   secondsActive: 0,
    //   attachments: [],
    //   children: [{
    //     parent: 0,
    //     id: 1,
    //     title: "child",
    //     description: "desrc",
    //     started: new Date(),
    //     completed: null,
    //     secondsActive: 0,
    //     attachments: [],
    //     children: []
    //   }]
    // };
  }

  watchTree(): Observable<Task | null> {
    return this.fullTree$;
  }

  watchCurrentTask(): Observable<Task | null> {
    return this.currentTask$;
  }

  setCurrentTask(task: Task) {
    this.currentTask$.next(task);
  }

}
