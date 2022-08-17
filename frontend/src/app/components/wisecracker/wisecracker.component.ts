import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-wisecracker',
  templateUrl: './wisecracker.component.html',
  styleUrls: ['./wisecracker.component.css']
})
export class WisecrackerComponent implements OnInit {

  public wiseThings: string[] = [];
  public wiseThing$ = new BehaviorSubject<string>("");

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
	this.http.get<string[]>("http://localhost:1410/wisecracker").subscribe(results => {
		this.wiseThings = results;

		const loop = () => {
		  const i = Math.floor(Math.random() * this.wiseThings.length);
		  const newContent = this.wiseThings[i];
		  this.wiseThing$.next(newContent);
		  setTimeout(loop, 10000);
		}
		loop();
	});
  }

}
