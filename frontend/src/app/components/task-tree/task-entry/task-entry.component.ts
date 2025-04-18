import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs';
import { TaskTree, TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  public currentTime = new Date().getTime();
  @Input() ownTask: TaskTree | null = null;
  @Input() activeTask: TaskTree | null = null;
  public isExpanded = true;

  constructor(
    private taskSvc: TaskService
    ) { }

  ngOnInit(): void {}

  focusOnMe() {
    if (this.ownTask) this.taskSvc.loadAndSwitch(this.ownTask.id);
  }

  public toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  public shouldBeHidden() {
    return this.taskSvc.watchShowCompletedTasks().pipe(
      map(showCompletedTasks => !showCompletedTasks && this.ownTask?.completed)
    );
  }
  
  public allowDrop(ev: DragEvent) {
    if (!this.ownTask) return;
    console.log('dragover on ', this.ownTask.id)
    ev.preventDefault();
    ev.stopPropagation();
  }

  public onDragStart(ev: DragEvent) {
    if (!this.ownTask) return;
    if (this.ownTask.id !== this.activeTask?.id) return;
    console.log('Starting to drag task with id: ', this.ownTask.id);
    // This task is being dragged. Attach this id to the drag-event, so that target-tasks can identify the source task
    ev.dataTransfer?.setData('text', JSON.stringify({ 'sourceId': this.ownTask.id }));
  }

  public onDrop(ev: DragEvent) {
    if (!this.ownTask) return;
    console.log('drop on ', this.ownTask.id)
    console.log('drop', ev)
    ev.preventDefault();
    ev.stopPropagation();

    // Another task has been dropped on this task.
    const stringData = ev.dataTransfer?.getData('text');
    if (stringData) {
      const data = JSON.parse(stringData);
      console.log(data, 'dropped into ', this.ownTask.id);
      if (data.sourceId) {
        // A task has been dropped on this task
        if (data.sourceId === this.ownTask.id) return; // do not allow to drop on itself
        this.taskSvc.moveCurrentTaskToParent(this.ownTask.id);
      }
    }

    // Not a task, but a file has been dropped on this task.
    const files = ev.dataTransfer?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.name.endsWith('.eml')) {
          console.log('Email dropped: ', file.name);
          this.taskSvc.addEmailChildToCurrent(file);
        }
      }
    }
  }

  onDragEnter($event: DragEvent) {
   // activate `beingHovered` css 
  }

  onDragLeave($event: DragEvent) {
    // deactivate `beingHovered` css
  }
}
