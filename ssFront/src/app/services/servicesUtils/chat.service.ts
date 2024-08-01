import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {


  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createmessage(data:any){
    console.log("qqqqqqqqqqqqq", data)
    return this.httpClient.post(this.url + "/chats" , data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }
  getChat(){

    console.log("ssab hy hy hy hy hy hy ")
    return this.httpClient.get(this.url + "/chats");
  }

}
