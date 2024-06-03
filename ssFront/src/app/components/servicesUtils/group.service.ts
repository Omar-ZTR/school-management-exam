import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GroupResponse } from '../calandarfull/calandarfull.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createGroup(data:any){
    
    return this.httpClient.post(this.url + "/group" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
  getGroups(){
    return this.httpClient.get(this.url + "/group");
  }

  getGroupSubject(exam_id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/groupSub/${exam_id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
