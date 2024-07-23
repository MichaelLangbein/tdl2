import { map, tap } from "rxjs";

import { inject } from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot
} from "@angular/router";

import { ApiService } from "../services/api.service";


export const loggedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const apiService = inject(ApiService);
  const router = inject(Router);

  return apiService.isLoggedIn().pipe(
    tap((v) => {
      if (!v.loggedIn) {
        router.navigate(['/login']);
      }
    }),
    map((v) => v.loggedIn)
  );
};
