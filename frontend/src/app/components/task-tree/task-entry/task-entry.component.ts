import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  @Input() tree: Task | null = null;
  @Input() active: Task | null = null;
  showContextMenu = false;

  constructor(private eRef: ElementRef) { }

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

  createChildTask()  {
    this.showContextMenu = false;
    console.log("creating child task")
  }

  estimateTime() {
    this.showContextMenu = false;
    console.log("estimating time");
  }

  deleteTask() {
    this.showContextMenu = false;
    console.log("deleting task");
  }
}
