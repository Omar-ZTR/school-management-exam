import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
declare var saveAs: any;
@Injectable({
  providedIn: 'root',
})
export class ExamAnswersService {
  url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  createAnswers(data: any) {
    const formData = new FormData();
    formData.append('ans', JSON.stringify(data.ans));

    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        formData.append('files', file);
      }
    }
    console.log("hay answers",formData)
    return this.httpClient.post(this.url + '/answers', formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  getAnswer(id:any) {
   
    return this.httpClient.get(`${this.url}/getanswers/${id}`);
  }

  getStudentAnswer(id:any) {
   
    return this.httpClient.get(`${this.url}/studentanswer/${id}`);
  }


  updateAnswer(data:any){
    const id = data.ans__id;
    console.log("<<<////",id)
    return this.httpClient.put(`${this.url}/result/${id}`, data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }

  downloadFile(data:any): Observable<any> {
    const filename = 'yap.png';
    const downloadUrl = `${this.url}/download/${filename}`;

    return this.httpClient.get(downloadUrl, {
      responseType: 'blob'
    });
  }
}
  // downloadFile(data:any){
  //   const filename = 'yap.png';
  //   console.log("<<<<<<<</",filename)
  //   return this.httpClient.get(`${this.url}/download/${filename}` , {
  //     headers:new HttpHeaders().set('Content-Type' , 'application/json')
  //   })
  // }


