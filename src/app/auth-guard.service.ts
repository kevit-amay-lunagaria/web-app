import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuthenticated().then((authenticated: any) => {
      if (authenticated) {
        //console.log(authenticated);
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    });
  }
}

// export const canActivate: CanActivateFn = (
//   route: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ): Observable<boolean> | Promise<boolean> | boolean {
//   return inject(AuthService)
//     .isAuthenticated()
//     .then((authenticated: any) => {
//       if (authenticated) {
//         return true;
//       } else {
//         inject(Router).navigate(['/']);
//         return false;
//       }
//     });
// }
