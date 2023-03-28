import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

/**
 * Estimates can simply be obtained through the task.service
 * This service is but a simple cache between a user and the backend
 * that prevents every estimate to go through to the backend 
 */

@Injectable({
  providedIn: 'root'
})
export class EstimateService {

  private cache: {[taskId: number]: any } = {};

  constructor(private http: HttpClient) { }

  public estimateLive(taskId: number): Observable<any> {
    return this.http.get(`http://localhost:1410/tasks/${taskId}/estimate`).pipe(
      tap(result => {
        this.cache[taskId] = result;
      })
    );
  }

  public estimateCached(taskId: number): any {
    return this.cache[taskId];
  }
}
