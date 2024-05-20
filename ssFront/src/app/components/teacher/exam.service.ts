import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  url = 'http://localhost:3000';
  constructor(private httpClient:HttpClient) {}
  
  createExam(data:any){
    // const formData = new FormData();
    // formData.append('exam', JSON.stringify(data.exam));
    // if (data.files.length > 0) {
    //   for (let file of data.files) {
    //     formData.append('files', file);
    //   }
    // }
    // console.log("fffffffffffffffffffffffl",formData)
    const formData = new FormData();
formData.append('exam', JSON.stringify(data.exam)); // Serialize exam data
formData.append('file', data.file);
    return this.httpClient.post(this.url + "/examc" , formData , {
      headers:new HttpHeaders().set('Accept' , 'application/json')
    })
  }
}




// createExam(data: any): Observable<any> {
//   const formData = new FormData();
//   formData.append('exam', JSON.stringify(data.exam));
//   if (data.files.length > 0) {
//     for (let file of data.files) {
//       formData.append('files', file);
//     }
//   }

//   return this.http.post(`${this.baseUrl}/exams`, formData);
// }