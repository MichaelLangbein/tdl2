import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarViewComponent } from './views/calendar-view/calendar-view.component';
import { StatsComponent } from './views/stats/stats.component';
import { TaskViewComponent } from './views/task-view/task-view.component';
import { WikiViewComponent } from './views/wiki-view/wiki-view.component';

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
},{
  path: 'wiki',
  component: WikiViewComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
