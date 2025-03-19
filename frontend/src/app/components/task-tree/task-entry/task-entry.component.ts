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
    console.log('dragstart on ', this.ownTask.id)
    ev.dataTransfer?.setData('text', JSON.stringify({ 'sourceId': this.ownTask.id }));
  }

  public onDrop(ev: DragEvent) {
    if (!this.ownTask) return;
    console.log('drop on ', this.ownTask.id)
    console.log('drop', ev)
    ev.preventDefault();
    ev.stopPropagation();
    const stringData = ev.dataTransfer?.getData('text');
    if (stringData) {
      const data = JSON.parse(stringData);
      console.log(data, 'dropped into ', this.ownTask.id)
      this.taskSvc.moveCurrentTaskToParent(this.ownTask.id);
    }
  }

}
