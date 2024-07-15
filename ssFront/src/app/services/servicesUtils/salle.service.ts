import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalleService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createReserv(data:any){
    console.log("qqqqqqqqqqqqq", data)
    return this.httpClient.post(this.url + "/salle" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
  getSalles(){
    return this.httpClient.get(this.url + "/salle");
  }

  getSalleSpecific(data: any) {
    return this.httpClient.post(this.url + "/salleSpecific", data);
  }
  
  createSalle(data: any) {
    return this.httpClient.post(this.url + '/salle', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }



  updateSalle(data: any, id: number) {
    
    return this.httpClient.put(`${this.url}/salle/${id}`, data, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }
  DeleteSalle(id: number) {
    
    return this.httpClient.delete(`${this.url}/salle/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

}
