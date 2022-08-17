import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wiki-view',
  templateUrl: './wiki-view.component.html',
  styleUrls: ['./wiki-view.component.css']
})
export class WikiViewComponent implements OnInit {

  public entries: string[] = [];
  public activeEntry = "";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<string[]>("http://localhost:1410/wiki/list").subscribe((response: string[]) => {
      this.entries = response;
    });
  }

  activate(entry: string) {
    this.activeEntry = entry;
    this.http.get(`http://localhost:1410/wiki/${entry}`, {responseType: 'text'}).subscribe(content => {
      
    });
  }

}
