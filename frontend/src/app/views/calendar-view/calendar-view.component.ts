import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CalendarService, ScheduleInfo } from 'src/app/services/calendar.service';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit {

  public schedule$ = new BehaviorSubject<ScheduleInfo[]>([]);

  constructor(private calendarSvc: CalendarService, private router: Router, private taskSvc: TaskService) {}

  ngOnInit(): void {}

  doSchedule() {
    this.calendarSvc.schedule().subscribe(this.schedule$);
  }

  jumpToTask(taskId: number) {
    this.router.navigate(['/task']).then(() => {
      this.taskSvc.loadAndSwitch(taskId);
    });
  
  }

}
