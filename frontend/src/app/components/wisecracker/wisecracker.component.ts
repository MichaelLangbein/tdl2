import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'app-wisecracker',
  templateUrl: './wisecracker.component.html',
  styleUrls: ['./wisecracker.component.css'],
})
export class WisecrackerComponent implements OnInit {
  public wiseThings: string[] = [];
  public wiseThing$ = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<string[]>(`${environment.backendUrl}/wisecracker`)
      .subscribe((results) => {
        this.wiseThings = results;

        const loop = () => {
          const i = Math.floor(Math.random() * this.wiseThings.length);
          const newContent = this.wiseThings[i];
          this.wiseThing$.next(newContent);
          setTimeout(loop, 10000);
        };
        loop();
      });
  }
}
