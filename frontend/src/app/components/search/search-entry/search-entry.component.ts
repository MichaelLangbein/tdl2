import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TaskRow, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-search-entry',
  templateUrl: './search-entry.component.html',
  styleUrls: ['./search-entry.component.css']
})
export class SearchEntryComponent implements OnInit {


  public showContextMenu = false;
  @Input() item!: TaskRow;

  constructor(
    private eRef: ElementRef,
    private taskSvc: TaskService) { }
  
  ngOnInit(): void {
    // preventing browser's default context menu from popping up on right-click
    this.eRef.nativeElement.addEventListener('contextmenu', (event: any) => event.preventDefault());
  }

  // checking for clicks outside ot the element
  @HostListener('document:click', ['$event'])
  clickOutside(event: any) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.showContextMenu = false;
    }
  }

  public focusOnMe() {
    this.taskSvc.loadAndSwitch(this.item.id);
    this.showContextMenu = false;
  }

}
