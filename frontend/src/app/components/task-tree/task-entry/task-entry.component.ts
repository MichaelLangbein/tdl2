import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { TaskTree, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  showContextMenu = false;
  @Input() tree: TaskTree | null = null;
  @Input() active: TaskTree | null = null;
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

  focusOnMe() {
    if (this.tree) this.taskSvc.switchCurrentTask(this.tree);
  }

  createChildTask()  {
    this.showContextMenu = false;
    if (this.tree) this.taskSvc.addChildTask("untitled", "", this.tree.id);
  }

  estimateTime() {
    this.showContextMenu = false;
    if (this.tree) this.taskSvc.estimateTime(this.tree).subscribe(r => console.log(r));
  }

  completeTask() {
    if (this.tree) this.taskSvc.completeTask(this.tree);
  }

  reactivateTask() {
    if (this.tree) this.taskSvc.reactivateTask(this.tree);
  }

  deleteTask() {
    this.showContextMenu = false;
    if (this.tree) this.taskSvc.deleteTask(this.tree);
  }
}
