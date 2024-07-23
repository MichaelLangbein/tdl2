

import { Injectable } from "@angular/core";

import { ApiService } from "./api.service";


@Injectable({
  providedIn: 'root',
})
export class StatsService {
  constructor(private api: ApiService) {}

  public loadCompletionTimes() {
    return this.api.get(`/statistics/completionTimes`);
  }
}
