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
      description: new FormControl()
    });

    this.currentTask$ = this.taskService.watchCurrentTask();
    
    this.currentTask$.subscribe(task => {
      if (task) {
        this.form.setValue({
          title: task.title,
          description: task.description
        }, {
          // prevents looping between `currentTask$` and `valueChanges` 
          emitEvent: false,
        });
      }
    });

    this.form.valueChanges.pipe(
        debounceTime(1000), 
        distinctUntilChanged((prev, cur) => prev.title === cur.title && prev.description === cur.description)
      ).subscribe(({ title, description }) => {
        this.taskService.editCurrentTask(title, description);
    });
  }

  ngOnInit(): void {
  }

}
