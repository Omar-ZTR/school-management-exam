import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  signup(data: any) {
    console.log('fffffffffffffffffffffffl', data);
    const formData = new FormData();
    formData.append('user', JSON.stringify(data.User));
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
      
        formData.append('files', file);
      }
    }
    console.log('fffffffffffffffffffffffl', formData);
    return this.httpClient.post(this.url + '/signup', formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  forgotPassword(data: any) {
console.log("forgetpass is data ",data)

    return this.httpClient.post(this.url + '/forgotPassword', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
  login(data: any) {
    return this.httpClient.post(this.url + '/login', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
  checkToken() {
    return this.httpClient.get(this.url + '/user/checkToken');
  }

  resetPassword(data: any) {
    const user__id = data.user__id
    const token = data.token
    return this.httpClient.post(`${this.url}/resetpassword/${user__id}/${token}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  verifyEmail(data: any) {
    
    return this.httpClient.post(`${this.url}/verifemail/${data}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getUsers() {
    return this.httpClient.get(this.url + '/user/get');
  }

  update(data: any) {
    return this.httpClient.post(this.url + '/user/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
