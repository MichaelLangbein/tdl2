import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  public searchBar = new FormControl();

  constructor() { }

  ngOnInit(): void {
    this.searchBar.valueChanges.subscribe(value => {
      console.log("Searching for ", value);
    })
  }

}
