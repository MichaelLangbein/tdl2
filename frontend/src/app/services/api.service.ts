import { BehaviorSubject, Observable, tap } from "rxjs";
import { environment } from "src/environments/environment";

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private backendUrl = environment.backendUrl;

  constructor(private http: HttpClient) {}

  // note: may become stale!
  // but required for login-button.
  private __isLoggedInState$ = new BehaviorSubject<boolean>(false);
  public observeLoggedIn(): Observable<boolean> {
    return this.__isLoggedInState$;
  }

  public login(username: string, password: string) {
    return this.http
      .post<{ loggedIn?: boolean; error?: any }>(
        `${this.backendUrl}/auth/password`,
        { username, password },
        { withCredentials: true }
      )
      .pipe(tap((r) => this.__isLoggedInState$.next(r.loggedIn ?? false)));
  }

  public logout() {
    return this.http
      .get<{ loggedIn?: boolean; error?: any }>(
        `${this.backendUrl}/auth/logout`,
        {
          withCredentials: true,
        }
      )
      .pipe(tap((r) => this.__isLoggedInState$.next(r.loggedIn ?? false)));
  }

  public isLoggedIn() {
    return this.http
      .get<{ loggedIn: boolean }>(`${this.backendUrl}/auth/status`, {
        withCredentials: true,
      })
      .pipe(tap((r) => this.__isLoggedInState$.next(r.loggedIn ?? false)));
  }

  public get<T>(path: string) {
    return this.http.get<T>(`${this.backendUrl}${path}`, {
      withCredentials: true,
    });
  }

  public open(path: string) {
    window.open(`${this.backendUrl}${path}`, '_blank', 'noopener,noreferrer');
  }

  public post<T>(path: string, body: any) {
    return this.http.post<T>(`${this.backendUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  public patch<T>(path: string, body: any) {
    return this.http.patch<T>(`${this.backendUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  public delete<T>(path: string) {
    return this.http.delete<T>(`${this.backendUrl}${path}`, {
      withCredentials: true,
    });
  }
}
