import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Teacher } from '../../components/Admin/manage-teacher/manage-teacher.component';
import { Student } from '../../components/Admin/manage-student/manage-student.component';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}

  getStudents(): Observable<Student[]>{
    return this.httpClient.get<Student[]>(this.url + "/students");
  }


  updateStudent(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/student/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  updategroupStudent(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/studentGr/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  DeleteStudent(id: number) {
    
    return this.httpClient.delete(`${this.url}/student/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  getStudentGroup(id: any) {
    
    return this.httpClient.get(`${this.url}/studentgroup/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
  getStudent(id: any) {
    
    return this.httpClient.get(`${this.url}/student/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  AnalyseStudents(){
    return this.httpClient.get(this.url + "/studentMonthly");
  }

  updatepdp(file: any, id: any) {
    console.log('fffffffffffffffffffffffl', file);
    const formData = new FormData();
    
    // if (data && data.length > 0) {
    //   for (const file of data) {
    //     // Serialize exam data
      
    //   } }
        formData.append('files', file);
   
    return this.httpClient.put(`${this.url}/pdp/${id}`, formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

}
