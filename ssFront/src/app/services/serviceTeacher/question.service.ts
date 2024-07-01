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

  updateQuestion(data: any, id: number) {
    const formData = new FormData();
    formData.append('question', JSON.stringify(data.question));
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        formData.append('files', file);
      }
    }
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });
    return this.httpClient.put(`${this.url}/question/${id}`, formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  deleteQuestion(id: any, model:any) {

    console.log("sssaaaaaaaaaa",id)
    return this.httpClient.delete(`${this.url}/question/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      body: { model }
    });
  }

  // updateQuestion(data: any, id: number) {
  //   console.log("hello", data);

  //   const formData = new FormData();
  //   formData.append('question', JSON.stringify(data.question));

  //   if (data.files && data.files.length > 0) {
  //     for (const file of data.files) {
  //       formData.append('files', file);
  //     }
  //   }

  //   // Log the formData entries for debugging
  //   formData.forEach((value, key) => {
  //     console.log(`${key}:`, value);
  //   });

  //   return this.httpClient.put(`${this.url}/question/${id}`, formData, {
  //     headers: new HttpHeaders({
  //       'Accept': 'application/json',
  //     })
  //   });
  deleteFiles(id: any, model: string) {
    console.log('sssaaaaaaaaaa', id);
    return this.httpClient.delete(`${this.url}/file/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
      body: { model },
    });
  }

  getfakeQuestion() {
    return this.httpClient.get(this.url + '/fake');
  }
}
