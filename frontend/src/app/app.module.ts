import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { TaskViewComponent } from './views/task-view/task-view.component';
import { CalendarViewComponent } from './views/calendar-view/calendar-view.component';
import { WikiViewComponent } from './views/wiki-view/wiki-view.component';
import { StatsComponent } from './views/stats/stats.component';
import { TaskTreeComponent } from './components/task-tree/task-tree.component';
import { TaskEditComponent } from './components/task-edit/task-edit.component';
import { SearchComponent } from './components/search/search.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { TaskEntryComponent } from './components/task-tree/task-entry/task-entry.component';
import { WisecrackerComponent } from './components/wisecracker/wisecracker.component';
import { SecondsToTimestringPipe } from './pipes/seconds-to-timestring.pipe';

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
    WisecrackerComponent,
    WikiViewComponent,
    SecondsToTimestringPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
