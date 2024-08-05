import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubscribeService {
  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}


  getSubscribes(){
    return this.httpClient.get(this.url + "/subscribe");
  }


  
  createSubscribe(data: any) {
    return this.httpClient.post(this.url + '/subscribe', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  subscribeExam( id: any) {
    
    return this.httpClient.get(`${this.url}/subExAm/${id}`, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  // getCheckSubscribe(exam__id: any, user__id: any) {
  //   // Create HttpParams from the data object
  //   let params = new HttpParams()
  //     .set('exam__id', exam__id.toString())
  //     .set('user__id', user__id.toString());

  //   return this.httpClient.get(this.url + '/subscribe', {
  //     headers: new HttpHeaders().set('Content-Type', 'application/json'),
  //     params: params // Attach query parameters here
  //   });
  // }


}
