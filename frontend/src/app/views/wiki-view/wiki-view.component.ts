import { ApiService } from "src/app/services/api.service";

import { Component, OnInit, ViewEncapsulation } from "@angular/core";


@Component({
  selector: 'app-wiki-view',
  templateUrl: './wiki-view.component.html',
  styleUrls: [
    './wiki-view.component.css',
    '../../../../node_modules/prismjs/themes/prism-coy.css',
    '../../../../node_modules/katex/dist/katex.min.css',
  ],
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class WikiViewComponent implements OnInit {
  public entries: string[] = [];
  public activeEntry = '';
  public katexOptions = {
    macros: {},
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<string[]>(`/wiki/list`).subscribe((response: string[]) => {
      this.entries = response;
    });
  }

  activate(entry: string) {
    this.activeEntry = entry;
  }
}
