import { BehaviorSubject, Observable, tap } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
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
          if (val.success) this.loggedIn.next(true);
        })
      );
  }

  public logout() {
    return this.http
      .post('http://localhost:1410/login/logout', {}, { withCredentials: true })
      .pipe(tap(() => this.loggedIn.next(false)));
  }

  isLoggedIn(): boolean {
    return this.loggedIn.value;
  }

  observeLoggedIn(): Observable<boolean> {
    return this.loggedIn;
  }
}
