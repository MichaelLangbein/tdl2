import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatsService {

  constructor(private http: HttpClient) { }

  public loadCompletionTimes() {
    return this.http.get(`http://localhost:1410/statistics/completionTimes`);
  }
}
