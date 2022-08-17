import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TaskTree, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  @Input() tree: TaskTree | null = null;
  @Input() active: TaskTree | null = null;
  showContextMenu = false;

  constructor(
    private eRef: ElementRef,
    private taskSvc: TaskService
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

  focusOnMe() {
    this.taskSvc.setCurrentTask(this.tree!);
  }

  createChildTask()  {
    this.showContextMenu = false;
    this.taskSvc.createTask("untitled", "", this.active!.id);
  }

  estimateTime() {
    this.showContextMenu = false;
    console.log("estimating time");
  }

  deleteTask() {
    this.showContextMenu = false;
    this.taskSvc.deleteTask(this.tree!);
  }
}
