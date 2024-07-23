import { Observable, tap } from "rxjs";

import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";


/**
 * Estimates can simply be obtained through the task.service
 * This service is but a simple cache between a user and the backend
 * that prevents every estimate to go through to the backend
 */

@Injectable({
  providedIn: 'root',
})
export class EstimateService {
  private cache: { [taskId: number]: any } = {};

  constructor(private api: ApiService) {}

  public estimateLive(taskId: number): Observable<any> {
    return this.api.get(`/tasks/${taskId}/estimate`).pipe(
      tap((result) => {
        this.cache[taskId] = result;
      })
    );
  }

  public estimateCached(taskId: number): any {
    return this.cache[taskId];
  }
}
