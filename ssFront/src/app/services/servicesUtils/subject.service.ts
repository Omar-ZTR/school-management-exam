import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}
  createSubject(data: any) {
    return this.httpClient.post(this.url + '/subject', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  
  
  getSubjects() {
    return this.httpClient.get(`${this.url}/subjects`);
  }
 
  updateSubject(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/subject/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
  DeleteSubject(id: number) {
    
    return this.httpClient.delete(`${this.url}/subject/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }


}
