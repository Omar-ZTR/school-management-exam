import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Exam } from '../../components/teacher/teacher-exam/teacher-exam.component';
import { ExamGS } from '../../components/teacher/result/result.component';
@Injectable({
  providedIn: 'root',
})
export class ExamService {
  url = 'http://localhost:3000';
  constructor(private httpClient: HttpClient) {}

  createExam(data: any) {
 
    console.log('fffffffffffffffffffffffl', data);
    const formData = new FormData();
    formData.append('exam', JSON.stringify(data.exam));
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        // Serialize exam data
        formData.append('files', file);
      }
    }

    return this.httpClient.post(this.url + '/examc', formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  AddDescSupport(data: any, id: number) {
    console.log('fffffffffffffffffffffffl', data);
    const formData = new FormData();
    formData.append('exam', JSON.stringify(data.exam));
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        // Serialize exam data
        formData.append('files', file);
      }
    }
    return this.httpClient.put(`${this.url}/ExamDesc/${id}`, formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  UpdateFileExam(id:any, data: any) {
 
    console.log('fffffffffffffffffffffffl', data);
    const formData = new FormData();
  
    if (data.files && data.files.length > 0) {
      for (const file of data.files) {
        // Serialize exam data
        formData.append('files', file);
      }
    }

    return this.httpClient.post(`${this.url}/examUPfile/${id}`, formData, {
      headers: new HttpHeaders().set('Accept', 'application/json'),
    });
  }

  // examUPfile
  updateExam(data: any) {
    const id = data.exam__id;
    console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<./////////', id);
    return this.httpClient.put(`${this.url}/Exams/${id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getFullExam(): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${this.url}/exams`);
  }
  getTeacherExam(id: any): Observable<Exam[]> {
    return this.httpClient.get<Exam[]>(`${this.url}/examsTeach/${id}`);
  }

  getTeacherExamGS(): Observable<ExamGS[]> {
    return this.httpClient.get<ExamGS[]>(`${this.url}/examsGS`);
  }
  getExamByid(exam_id: any): Observable<any> {
    console.log('sssaaaaaaaaaa', exam_id);
    return this.httpClient.get(`${this.url}/exams/${exam_id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  deleteExam(id: number): Observable<any> {
    console.log('Deleting exam with ID:', id);
    return this.httpClient.delete(`${this.url}/exam/${id}`, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }

  getcertifExam(): Observable<any> {
    return this.httpClient.get<any[]>(this.url + '/examfullCertif');
  }

 certifExam(): Observable<any> {
    return this.httpClient.get<any[]>(this.url + '/examfullCertif');
  }

  Subscribe() {
    return this.httpClient.get(this.url + '/subscribe');
  }

  updateSubscribe(data:any) {
    const subscribe__id = data.sub__id

    return this.httpClient.put(`${this.url}/subscribes/${subscribe__id}`, data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
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
