import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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



  sendCodeExam(data:any){
    console.log("fifi aywaaaa ahaooo", data)
    return this.httpClient.post(this.url + "/sendcode" , data , {
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
  getExams(groupid: any) {
    console.log("aksjjjjjjjjjjjjjjjjjjjjj",groupid)
    return this.httpClient.get(`${this.url}/specificreservation/${groupid}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
     
    });
  }
  getEvents(){
    return this.httpClient.get(this.url + "/reservation");
  }

  
  getSchedule(ids: number[]) {
    console.log("aksjjjjjjjjjjjjjjjjjjjjj", ids);
  
    // Join the IDs into a comma-separated string
    const params = new HttpParams().set('ids', ids.join(','));
  
    return this.httpClient.get(`${this.url}/reservationTeacher`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      params: params
    });
  }

  deletePlan(id: any) {

    console.log("sssaaaaaaaaaa",id)
    return this.httpClient.delete(`${this.url}/reservation/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
     
    });
  }

}
