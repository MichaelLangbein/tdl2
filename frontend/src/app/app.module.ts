import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { TaskViewComponent } from './components/task-view/task-view.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { TaskTreeComponent } from './components/task-tree/task-tree.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { SearchComponent } from './components/search/search.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { StatsComponent } from './components/stats/stats.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskEntryComponent } from './components/task-tree/task-entry/task-entry.component';
import { WisecrackerComponent } from './components/wisecracker/wisecracker.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskViewComponent,
    CalendarViewComponent,
    TaskTreeComponent,
    TaskEditComponent,
    SearchComponent,
    UpcomingComponent,
    StatsComponent,
    TaskEntryComponent,
    WisecrackerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
