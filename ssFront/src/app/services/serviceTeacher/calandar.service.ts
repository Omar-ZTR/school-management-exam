import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalandarService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createReserv(data:any){
    console.log("fifi aywaaaa ahaooo", data)
    return this.httpClient.post(this.url + "/reservation" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }

  updatereservation(data:any){
    const id = data.id;
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<./////////",id)
    return this.httpClient.put(`${this.url}/reservation/${id}`, data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
  getExams(groupName: string) {
    return this.httpClient.get(`${this.url}/specificreservation/${groupName}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     
    });
  }
  getEvents(){
    return this.httpClient.get(this.url + "/reservation");
  }
}
