import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}

  getSubjects() {
    return this.httpClient.get(`${this.url}/subjects`);
  }
}
