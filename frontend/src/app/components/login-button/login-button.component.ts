import { Observable } from "rxjs";
import { ApiService } from "src/app/services/api.service";

import { Component } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css'],
})
export class LoginButtonComponent {
  public loggedIn$: Observable<boolean>;
  constructor(private apiService: ApiService, private router: Router) {
    this.loggedIn$ = apiService.observeLoggedIn();
  }
  logout() {
    this.apiService.logout().subscribe(() => this.router.navigate(['/login']));
  }
  login() {
    this.router.navigate(['/login'], {});
  }
}
