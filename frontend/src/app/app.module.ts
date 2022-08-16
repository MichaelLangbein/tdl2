import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { TaskTreeComponent } from './components/task-tree/task-tree.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { SearchComponent } from './components/search/search.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { StatsComponent } from './components/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    CalendarViewComponent,
    TaskTreeComponent,
    TaskEditComponent,
    SearchComponent,
    UpcomingComponent,
    StatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
