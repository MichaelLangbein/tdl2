import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { TaskService, Task } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {
  
  currentTask$: Observable<Task | null>;
  form: FormGroup;

  constructor(private taskService: TaskService) {
    this.form = new FormGroup({
      title: new FormControl(),
      description: new FormControl()
    })
    this.currentTask$ = this.taskService.watchCurrentTask();
    this.currentTask$.subscribe(task => {
      if (task) {
        this.form.setValue({
          title: task.title,
          description: task.description
        });
      }
    });
  }

  ngOnInit(): void {
  }

  submit() {
    console.log("submitting: ", this.form.value);
  }

}
