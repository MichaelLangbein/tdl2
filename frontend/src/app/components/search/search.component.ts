import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TaskRow, TaskService } from 'src/app/services/task.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchResults: TaskRow[] = [];
  public searchBar = new FormControl();

  constructor(private taskSvc: TaskService) { }

  ngOnInit(): void {
    this.searchBar.valueChanges.pipe(
      debounceTime(1000), 
      distinctUntilChanged()
    ).subscribe(value => {
      if (value === '') {
        this.searchResults = [];
      } else {
        this.taskSvc.search(value).subscribe(results => this.searchResults = results);
      }
    });
  }

}
