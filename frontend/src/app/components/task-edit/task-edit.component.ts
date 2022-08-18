import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap, Observable } from 'rxjs';
import { TaskService, TaskTree } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  
  currentTask$: Observable<TaskTree | null>;
  form: FormGroup;

  constructor(private taskService: TaskService) {
    this.form = new FormGroup({
      title: new FormControl(),
      description: new FormControl(),
      deadline: new FormControl()
    });

    this.currentTask$ = this.taskService.watchCurrentTask();
    
    this.currentTask$.subscribe(task => {
      if (task) {
        this.form.setValue({
          title: task.title,
          description: task.description,
          deadline: task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : null
        }, {
          // prevents looping between `currentTask$` and `valueChanges` 
          emitEvent: false,
        });
      }
    });

    this.form.valueChanges.pipe(
        debounceTime(1000), 
        distinctUntilChanged((prev, cur) => shallowEqual(prev, cur))
      ).subscribe(({ title, description, deadline }) => {
        this.taskService.editCurrent(title, description, deadline ? new Date(deadline).getTime() : null);
    });
  }

  ngOnInit(): void {
  }

}


function shallowEqual(o1: any, o2: any) {
  const keys1 = Object.keys(o1);
  const keys2 = Object.keys(o2);

  const union: string[] = [];
  for (const key of keys1) {
    if (!union.includes(key)) union.push(key);
  }
  for (const key of keys2) {
    if (!union.includes(key)) union.push(key);
  }
  if (union.length !== keys1.length) return false;
  if (union.length !== keys2.length) return false;

  for (const key of keys1) {
    if (o1[key] !== o2[key]) return false;
  }
  return true;
}
