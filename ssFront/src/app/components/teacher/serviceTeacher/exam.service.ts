import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../teacher-exam/teacher-exam.component';
import { ExamGS } from '../result/result.component';
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
    //   }for (const file of files) {
  

    // }
    console.log("fffffffffffffffffffffffl",data)
    const formData = new FormData();
formData.append('exam', JSON.stringify(data.exam)); 
for (const file of data.files) {// Serialize exam data
formData.append('files', file);
}
    return this.httpClient.post(this.url + "/examc" , formData , {
      headers:new HttpHeaders().set('Accept' , 'application/json')
    })
  }


  updateExam(data:any){
    const id = data.exam__id;
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<./////////",id)
    return this.httpClient.put(`${this.url}/Exams/${id}`, data , {
      headers:new HttpHeaders().set('Content-Type' , 'application/json')
    })
  }

  getTeacherExam(): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${this.url}/exams`);
  }

  getTeacherExamGS(): Observable<ExamGS[]> {
    return this.httpClient.get<ExamGS[]>(`${this.url}/examsGS`);
  }
  getExamByid(exam_id: any): Observable<any> {

    console.log("sssaaaaaaaaaa",exam_id)
    return this.httpClient.get(`${this.url}/exams/${exam_id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
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