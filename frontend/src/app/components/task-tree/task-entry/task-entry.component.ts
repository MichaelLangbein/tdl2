import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { TaskTree, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  @Input() ownTask: TaskTree | null = null;
  @Input() activeTask: TaskTree | null = null;

  constructor(
    private taskSvc: TaskService
    ) { }

  ngOnInit(): void {}

  focusOnMe() {
    if (this.ownTask) this.taskSvc.switchCurrent(this.ownTask);
  }

  handleDrag($event: Event) {
    $event.preventDefault();
    $event.stopPropagation();
  }

  handleDrop($event: DragEvent) {
    console.log($event);
  }

}
