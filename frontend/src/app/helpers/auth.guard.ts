import { inject } from "@angular/core";
import {
    ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot
} from "@angular/router";

import { AuthService } from "../services/auth.service";


export const loggedInGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};
