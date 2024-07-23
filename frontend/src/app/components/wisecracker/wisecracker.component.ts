import { BehaviorSubject } from "rxjs";
import { ApiService } from "src/app/services/api.service";

import { Component, OnInit } from "@angular/core";


@Component({
  selector: 'app-wisecracker',
  templateUrl: './wisecracker.component.html',
  styleUrls: ['./wisecracker.component.css'],
})
export class WisecrackerComponent implements OnInit {
  public wiseThings: string[] = [];
  public wiseThing$ = new BehaviorSubject<string>('');

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<string[]>(`/wisecracker`).subscribe((results) => {
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
