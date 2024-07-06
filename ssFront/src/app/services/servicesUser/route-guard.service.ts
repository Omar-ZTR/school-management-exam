import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';
// import jwtdecode from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';

import { GlobalConstants } from '../../shared/global-constants';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class RouteGuardService {
  constructor(
    private authService: AuthService,
    private router: Router,
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean  {
    // Check if the code is running in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenPayload = this.jwtHelper.decodeToken(token);
          if (this.authService.isAuthenticated()) {
            if (state.url === '/' || state.url === '/home') {
              if (tokenPayload.role === 'Student') {
                this.router.navigate(['/student/dash']);
                return true;
              } else if (tokenPayload.role === 'Teacher') {
                this.router.navigate(['/teacher/dash']);
                return true;
              }
              else if (tokenPayload.role === 'Admin') {
                this.router.navigate(['/admin/dash']);
                return true;
              }
            }

            const expectedRoles = route.data['expectedRole'] as Array<string>;
            if (expectedRoles.includes(tokenPayload.role)) {
              return true;
            } else {
              this.router.navigate(['/']);
              return false;
            }
          } else {
            this.router.navigate(['/auth']);
            return false;
          }
        } catch (error) {
          localStorage.clear();
          this.router.navigate(['/auth']);
          return false;
        }
      } else {
        if (state.url === '/' || state.url === '/home') {
          return true; // Allow navigation to home if no token is present
        }
        this.router.navigate(['/auth']);
        return false;
      }
    } else {
      console.warn('localStorage is not available in this environment.'); // Log a warning if localStorage is not available
      return false; // Return false to prevent navigation
    }
  }
}