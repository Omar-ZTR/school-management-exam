import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExamAnswersService {

  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createAnswers(data:any){
    return this.httpClient.post(this.url + "/answers" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
}
