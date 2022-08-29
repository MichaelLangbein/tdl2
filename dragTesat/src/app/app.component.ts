import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Node } from './data';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public tree$: Observable<Node>;

  constructor(dataSvc: DataService) {
    this.tree$ = dataSvc.watchData();
  }
}
