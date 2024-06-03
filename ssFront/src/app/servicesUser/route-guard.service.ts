import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';
import { AuthService } from './auth.service';
// import jwtdecode from "jwt-decode";
import { JwtHelperService } from '@auth0/angular-jwt';

import { GlobalConstants } from '../shared/global-constants';
@Injectable({
  providedIn: 'root'
})
export class RouteGuardService {
  constructor(public auth:AuthService,
    public router:Router,
    private jwtHelper: JwtHelperService,
    private snackbarService:SnackbarService) { }

    canActivate(router:ActivatedRouteSnapshot):boolean{
      let expectRoleArray = router.data;
      expectRoleArray = expectRoleArray['expectedRole'];

      const token:any = localStorage.getItem('token');

      var tokenPayload:any;

      try{
        tokenPayload = this.jwtHelper.decodeToken(token);
      }catch(err){
        localStorage.clear();
        this.router.navigate(['/']);
      }

      let expectedRole = '';

      for(let i = 0 ;  i < expectRoleArray['length']; i++){
        if(expectRoleArray[i] == tokenPayload.role){
          expectedRole = tokenPayload.role;
        }
      }


      if(tokenPayload.role == 'user' || tokenPayload.role == 'admin'){
        if(this.auth.isAuthenticated() && tokenPayload.role == expectedRole){
          return true;
        }
        
        this.snackbarService.openSnackBar(GlobalConstants.unauthroized , GlobalConstants.error);
        this.router.navigate(['/dashboard']);
        return false;
      }
      else{
        this.router.navigate(['/']);  
        localStorage.clear();
        return false;
      }
    }
}