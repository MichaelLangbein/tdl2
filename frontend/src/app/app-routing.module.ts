import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { StatsComponent } from './components/stats/stats.component';
import { TaskViewComponent } from './components/task-view/task-view.component';

const routes: Routes = [{ 
    path: '',   
    redirectTo: '/task',
    pathMatch: 'full' 
  },{
    path: 'task',
    component: TaskViewComponent
},{
  path: 'calendar',
  component: CalendarViewComponent
},{
  path: 'stats',
  component: StatsComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
