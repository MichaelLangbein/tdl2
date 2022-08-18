import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { TaskTree, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  showContextMenu = false;
  @Input() ownTask: TaskTree | null = null;
  @Input() activeTask: TaskTree | null = null;
  @ViewChild('content') content!: ElementRef<HTMLDivElement>;

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

  openContextMenu() {
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.showContextMenu = true;
  }

  focusOnMe() {
    if (this.ownTask) this.taskSvc.switchCurrent(this.ownTask);
  }

  createChildTask()  {
    this.showContextMenu = false;
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.taskSvc.addChildToCurrent("untitled", "");
  }

  estimateTime() {
    this.showContextMenu = false;
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.taskSvc.estimateCurrent()!.subscribe(r => console.log(r));
  }

  completeTask() {
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.taskSvc.completeCurrent();
  }

  reactivateTask() {
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.taskSvc.reactivateCurrent();
  }

  deleteTask() {
    this.showContextMenu = false;
    if (this.ownTask && this.ownTask.id === this.activeTask?.id) this.taskSvc.deleteCurrent();
  }
}
