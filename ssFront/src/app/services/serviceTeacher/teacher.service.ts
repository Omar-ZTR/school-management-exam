import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Teacher } from '../../components/Admin/manage-teacher/manage-teacher.component'; // Adjust the import path as necessary
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}

  getTeachers(): Observable<Teacher[]>{
    return this.httpClient.get<Teacher[]>(this.url + "/teachers");
  }


  getTecher(id: any): Observable<Teacher[]>{
    return this.httpClient.get<Teacher[]>(`${this.url}/teacher/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  updateTeacher(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/teacher/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
  DeleteTeacher(id: number) {
    
    return this.httpClient.delete(`${this.url}/teacher/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
}
