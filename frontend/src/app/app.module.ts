import { MarkdownModule } from "ngx-markdown";

import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormDragListComponent } from "./components/form-drag-list/form-drag-list.component";
import { SearchEntryComponent } from "./components/search/search-entry/search-entry.component";
import { SearchComponent } from "./components/search/search.component";
import { TaskEditComponent } from "./components/task-edit/task-edit.component";
import { TaskEntryComponent } from "./components/task-tree/task-entry/task-entry.component";
import { TaskTreeComponent } from "./components/task-tree/task-tree.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import {
    UpcomingEntryComponent
} from "./components/upcoming/upcoming-entry/upcoming-entry.component";
import { UpcomingComponent } from "./components/upcoming/upcoming.component";
import { WisecrackerComponent } from "./components/wisecracker/wisecracker.component";
import { SecondsToTimestringPipe } from "./pipes/seconds-to-timestring.pipe";
import { CalendarViewComponent } from "./views/calendar-view/calendar-view.component";
import { FlashcardViewComponent } from "./views/flashcard-view/flashcard-view.component";
import { LoginComponent } from "./views/login/login.component";
import { StatsComponent } from "./views/stats/stats.component";
import { TaskViewComponent } from "./views/task-view/task-view.component";
import { WikiViewComponent } from "./views/wiki-view/wiki-view.component";
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { KanbanViewComponent } from './views/kanban-view/kanban-view.component';
import { KanbanlistComponent } from './components/kanban/kanbanlist/kanbanlist.component';
import { KanbanboardComponent } from './components/kanban/kanbanboard/kanbanboard.component';
import { KanbanCreateComponent } from './components/kanban/kanban-create/kanban-create.component';
import { KanbanAddTaskComponent } from './components/kanban/kanban-add-task/kanban-add-task.component';


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
    SecondsToTimestringPipe,
    UpcomingEntryComponent,
    FormDragListComponent,
    FlashcardViewComponent,
    SearchEntryComponent,
    TimelineComponent,
    LoginComponent,
    LoginButtonComponent,
    KanbanViewComponent,
    KanbanlistComponent,
    KanbanboardComponent,
    KanbanCreateComponent,
    KanbanAddTaskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MarkdownModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
