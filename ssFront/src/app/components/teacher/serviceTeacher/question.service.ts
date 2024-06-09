import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  createquestion(data: any) {
 
    const formData = new FormData();
    formData.append('question', JSON.stringify(data.question));

    for (const file of data.files) {
formData.append('files', file);
}
    return this.httpClient.post(this.url + '/question', formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  getfakeQuestion(){
    return this.httpClient.get(this.url + "/fake");
  }
}
