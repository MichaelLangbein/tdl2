import { Observable, tap } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: boolean = false;
  constructor(private http: HttpClient) {}

  public login(username: string, password: string) {
    return this.http
      .post(
        'http://localhost:1410/login/password',
        { username, password },
        { withCredentials: true }
      )
      .pipe(
        tap((val: any) => {
          if (val.success) this.loggedIn = true;
        })
      );
  }

  isLoggedIn(): boolean | Observable<boolean> {
    return this.loggedIn;
  }
}
