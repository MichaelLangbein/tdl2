import { Observable } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

import { Component } from "@angular/core";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css'],
})
export class LoginButtonComponent {
  public loggedIn$: Observable<boolean>;
  constructor(private authService: AuthService, private router: Router) {
    this.loggedIn$ = authService.observeLoggedIn();
  }
  logout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
  login() {
    this.router.navigate(['/login'], {});
  }
}
