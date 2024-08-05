import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupResponse } from '../../components/calandarfull/calandarfull.component';
import { Observable } from 'rxjs';
import { Group } from '../../components/Admin/manage-school/groups/groups.component';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createGroup(data:any): Observable<Group>{
    
    return this.httpClient.post<Group>(this.url + "/group" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
  getGroups(): Observable<Group[]>{
    return this.httpClient.get<Group[]>(this.url + "/group");
  }
  getoneGroup(id:any){
    return this.httpClient.get(`${this.url}/group/${id}`);
  }

  getGroupbyName(name:any){
    return this.httpClient.get(`${this.url}/groupname/${name}`);
  }

  getFullGroups(){
    return this.httpClient.get(this.url + "/fullgroup");
  }

  getteacherGroups(){
    return this.httpClient.get(this.url + "/teachergroup");
  }


  getGroupSubject(exam_id: any): Observable<any> {

    console.log("sssaaaaaaaaaa",exam_id)
    return this.httpClient.get(`${this.url}/groupSub/${exam_id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateGroup(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/group/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
  DeleteGroup(id: number) {
    
    return this.httpClient.delete(`${this.url}/group/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }


}
