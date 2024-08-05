import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class TokenServiceService {

  constructor(private jwtHelper: JwtHelperService) { }
  getUserIdFromToken(): number | null {
    console.log("hloooo")
    const token = localStorage.getItem('token');
    console.log("bbb",token)
    // && !this.jwtHelper.isTokenExpired(token)
    if (token ) {
     
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",decodedToken)
      return decodedToken.userId || null;
    }
    return null;
  }


  getGroupIdFromToken(): number | null {
    console.log("hloooo")
    const token = localStorage.getItem('token');
    console.log("bbb",token)
    // && !this.jwtHelper.isTokenExpired(token)
    if (token ) {
     
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",decodedToken)
      return decodedToken.group || null;
    }
    return null;
  }


  getEmailFromToken(): number | null {
    console.log("hloooo")
    const token = localStorage.getItem('token');
    console.log("bbb",token)
    // && !this.jwtHelper.isTokenExpired(token)
    if (token ) {
     
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",decodedToken)
      return decodedToken.email || null;
    }
    return null;
  }


  getRoleFromToken(): number | null {
    console.log("hloooo")
    const token = localStorage.getItem('token');
    console.log("bbb",token)
    // && !this.jwtHelper.isTokenExpired(token)
    if (token ) {
     
      const decodedToken = this.jwtHelper.decodeToken(token);
      console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",decodedToken)
      return decodedToken.role || null;
    }
    return null;
  }




}
