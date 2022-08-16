import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/services/task.service';

@Component({
  selector: 'app-task-entry',
  templateUrl: './task-entry.component.html',
  styleUrls: ['./task-entry.component.css']
})
export class TaskEntryComponent implements OnInit {

  @Input() tree: Task | null = null;
  @Input() active: Task | null = null;

  constructor() { }

  ngOnInit(): void {
  }

}
