import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TaskRow } from 'src/app/services/task.service';

@Component({
  selector: 'app-upcoming-entry',
  templateUrl: './upcoming-entry.component.html',
  styleUrls: ['./upcoming-entry.component.css']
})
export class UpcomingEntryComponent implements OnInit {

  public showContextMenu = false;
  @Input() task!: TaskRow;

  constructor(
    private eRef: ElementRef
    ) { }

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

}
