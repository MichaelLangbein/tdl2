import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { loggedInGuard } from "./helpers/auth.guard";
import { CalendarViewComponent } from "./views/calendar-view/calendar-view.component";
import { FlashcardViewComponent } from "./views/flashcard-view/flashcard-view.component";
import { LoginComponent } from "./views/login/login.component";
import { StatsComponent } from "./views/stats/stats.component";
import { TaskViewComponent } from "./views/task-view/task-view.component";
import { WikiViewComponent } from "./views/wiki-view/wiki-view.component";


const routes: Routes = [
  {
    path: '',
    redirectTo: '/task',
    pathMatch: 'full',
  },
  {
    path: 'task',
    component: TaskViewComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'calendar',
    component: CalendarViewComponent,
  },
  {
    path: 'stats',
    component: StatsComponent,
  },
  {
    path: 'wiki',
    component: WikiViewComponent,
  },
  {
    path: 'flashcards',
    component: FlashcardViewComponent,
    canActivate: [loggedInGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
