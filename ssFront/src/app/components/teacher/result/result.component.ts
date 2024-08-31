import { Component, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { ExamService } from '../../../services/serviceTeacher/exam.service';
import { InputTextModule } from 'primeng/inputtext';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { FormsModule } from '@angular/forms';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { ImageModule } from 'primeng/image';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { MessageService } from 'primeng/api';

export interface Student {
  user__id: number;
  first__name: string;
  last__name: string;
  user__email: string;
  role: string;
  diploma: string;
  Locations: string;
  date__diploma: string;
  group__id: number;
}

export interface Group {
  group__id: number;
  Rank: number;
  group__name: string;
  subject: string;
  students: Student[];
}

export interface ExamGS {
  exam__id: number;
  nb__reserve: number;
  subject: string;
  exam__type: string;
  obligatoire: boolean;
  groups: Group[];
}

interface ExamTab {
  exam__id: number;
  subject: string;
  group__id: number;
  group__name: string;
  user__id: number;
  student__name: string;
  user__email: string;
}
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
@Component({
  selector: 'app-result',
  standalone: true,
  imports: [
    TableModule,
    PaginatorModule,
    FormsModule,
    HttpClientModule,
    TagModule,
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ButtonModule,
    TooltipModule,
  ],
  providers: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css',
})
export class ResultComponent implements OnInit {
  selectedExams: any;
  // ExamGS: ExamGS[] = [];
  // ExamT: ExamTab[] = [];
  // ExamD: ExamGS[] = [];

  resultAnsStudent: {
    [key: string]: {
      ans__result: any;
      ans__id: any;
      exam__id: any;
      student__id: any;
    };
  } = {};
  resultUp: {
    [key: string]: {
    updated:boolean
    };
  } = {};
  groupedExams: { [subject: string]: any[] } = {};
  subjectRenderTracker: { [subject: string]: boolean } = {};
  expandedRows: { [key: string]: boolean } = {};
  searchValue: string = '';
 user__id = this.tokenService.getUserIdFromToken();
  first: number = 0;
 
  rows: number = 10;
  firstC: number = 0;
 
  rowsC: number = 10;


  Exams: any;
  examCourse: any;
  msgErr: string='';
  filteredExamCourse: any;
  examCertif: any;
  filteredexamCertif: any;
  UpResult: boolean =true;

  PageChange(event: any) {
    this.firstC = event.first;
    this.rowsC = event.rows;
    console.log(this.rows, this.first);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    console.log(this.rows, this.first);
  }
  constructor(
    private AnswerService: ExamAnswersService,
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private examService: ExamService,
    private messageService : MessageService,
  ) {}
  // fetchGroups() {
  //   this.groupService.getteacherGroups().subscribe(
  //     (data) => {

  //   console.log('radicali ', data);
  //     },
  //     (error) => {
  //       console.error('Error fetching groups', error);
  //     }
  //   );
  // }

  onRowExpand(event: any, index: number) {
    this.expandedRows = {}; 
    this.expandedRows[index] = true; 
    console.log('Expanded row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }

  onRowCollapse(event: any, index: number) {
    delete this.expandedRows[index]; 
    console.log('Collapsed row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }

  dateNow: Date = new Date();
  isFutureDate(examDate: Date): boolean {
    return new Date(examDate) > this.dateNow;
  }
  toggleRow(sub: any) {
    this.expandedRows[sub.exam__id] = !this.expandedRows[sub.exam__id];
  }

  isPastDate(examDate: Date): boolean {
    return new Date(examDate) < this.dateNow;
  }

  ngOnInit() {
    // this.fetchGroups()

    this.examService.getTeacherExamGS(this.user__id).subscribe(
      (data) => {
        console.log('Response from backend:', data);
        this.Exams = data;
        console.log(this.Exams);
        // this.ExamD = this.ExamGS;
        for (const exam of this.Exams) {
          for (const group of exam.groups) {
            for (const stud of group.students) {
              const key = `${stud.exam}-${stud.student__id}`;
              // Ensure this.acceptation[key] is initialized as an object
              if (!this.resultAnsStudent[key] ) {
                this.resultAnsStudent[key] = {
                  ans__result: null,
                  ans__id: null,
                  exam__id: null,
                  student__id: null,
                };
              }
              if (!this.resultUp[key] ) {
                this.resultUp[key] = {
                  updated: false,
                 
                };
              }
             
              // Set properties
              this.resultAnsStudent[key].ans__result = stud.ans__result;
              this.resultAnsStudent[key].ans__id = stud.ans__id;
              this.resultAnsStudent[key].exam__id = stud.exam;
              this.resultAnsStudent[key].student__id = stud.student__id;
              console.log(
                'exam.student.user__id',
                key,
                this.resultAnsStudent[key]
              );
            }
          }
        }
        this.examCourse = this.Exams.filter(
          (exam: { exam__oblig: boolean }) => exam.exam__oblig === true
        );
        this.examCertif = this.Exams.filter(
          (exam: { exam__oblig: boolean }) => exam.exam__oblig === false
        );
        for (const exam of this.examCertif) {
        
            for (const ans of exam.answers) {
              console.log("iid",ans.ans__id, ans.ans__result)
              const key = `${ans.exam__id}-${ans.Student__id}`;
              // Ensure this.acceptation[key] is initialized as an object
              if (!this.resultAnsStudent[key]) {
                this.resultAnsStudent[key] = {
                  ans__result: null,
                  ans__id: null,
                  exam__id: null,
                  student__id: null,
                };
                 if (!this.resultUp[key] ) {
                this.resultUp[key] = {
                  updated: false,
                 
                };
              }
              }

              // Set properties
              this.resultAnsStudent[key].ans__result = ans.ans__result;
              this.resultAnsStudent[key].ans__id = ans.ans__id;
              this.resultAnsStudent[key].exam__id = ans.exam__id;
              this.resultAnsStudent[key].student__id = ans.Student__id;
              console.log(
                'exam.student.user__id',
                key,
                this.resultAnsStudent[key]
              );

             
            }
          }
      
        this.loadExamCourseData();
        this.loadExamCertifData()
  console.log("cerife",this.examCertif) 
      },
      (error: any) => {
        console.error('Error fetching exams', error);
      }
    );
    
   
   
  }

  loadExamCourseData() {
    this.filteredExamCourse = [...this.examCourse];
 
  }

  loadExamCertifData() {
    this.filteredexamCertif = [...this.examCertif];
 
  }

  rowStudents(group: Group): number {
    return group.students ? group.students.length : 0;
  }

  // filterData(searchValue: string) {
  //   const filteredData = searchValue
  //     ? this.Exams.reduce(
  //         (acc: any[], exam: { subject: string; groups: any[] }) => {
  //           // Check if search value is in the subject
  //           if (
  //             exam.subject.toLowerCase().includes(searchValue.toLowerCase())
  //           ) {
  //             acc.push(exam); // Add the entire exam if subject matches
  //             return acc;
  //           }

  //           const filteredGroups = exam.groups.filter((group) =>
  //             group.group__name
  //               .toLowerCase()
  //               .includes(searchValue.toLowerCase())
  //           );

  //           if (filteredGroups.length > 0) {
  //             // Return the entire exam with filtered groups if group name matches
  //             acc.push({ ...exam, groups: filteredGroups });
  //             return acc;
  //           }

  //           // Check if search value is in any student name or email within the exam
  //           const updatedGroups = exam.groups
  //             .map((group) => {
  //               const filteredStudents = group.students.filter(
  //                 (student: { first__name: string; user__email: string }) =>
  //                   student.first__name
  //                     .toLowerCase()
  //                     .includes(searchValue.toLowerCase()) ||
  //                   student.user__email
  //                     .toLowerCase()
  //                     .includes(searchValue.toLowerCase())
  //               );
  //               if (filteredStudents.length > 0) {
  //                 const updatedStudents = filteredStudents.map(
  //                   (student: { user__email: string }) => ({
  //                     ...student,
  //                     // Include the email in the filtered students
  //                     user__email: student.user__email
  //                       .toLowerCase()
  //                       .includes(searchValue.toLowerCase())
  //                       ? student.user__email
  //                       : '',
  //                   })
  //                 );
  //                 return { ...group, students: updatedStudents };
  //               } else {
  //                 return null; // Return null for groups with no matching students
  //               }
  //             })
  //             .filter(Boolean); // Remove null values from the array

  //           if (updatedGroups.length > 0) {
  //             // Return the entire exam with updated groups containing filtered students
  //             acc.push({ ...exam, groups: updatedGroups });
  //           }

  //           return acc;
  //         },
  //         []
  //       )
  //     : this.Exams; // Reset to original data when search input is empty

  //   // this.Exam = filteredData;
  // }

  
  
  filterData(searchTerm: string) {
    if (!searchTerm) {
      this.filteredExamCourse = [...this.examCourse];
    } else {
      this.filteredExamCourse = this.examCourse.filter((exam: { exam__name: string; groups: { group__name: string; students: any[]; }[]; }) =>
        exam.exam__name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.groups.some((group: { group__name: string; students: any[]; }) =>
          group.group__name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.students.some(student =>
            student.user__name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      );
    }
  }

  filterDataCertif(searchTerm: string) {
    if (!searchTerm) {
      this.filteredexamCertif = [...this.examCertif];
    } else {
      this.filteredexamCertif = this.examCertif.filter((exam: { exam__name: string; answers: any[]; }) =>
        exam.exam__name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exam.answers.some((ans: { student__name: string; }) =>
          ans.student__name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }


  
  
  
  updateresult(exam: any, student: any ,) {
    const key = `${exam}-${student}`;
if(this.resultAnsStudent[key].ans__result > 20 ||this.resultAnsStudent[key].ans__result < 0 ){

  this.msgErr = 'must be between 20 and 0'
  return
}
    console.log(
      'this.resultAnsStudent[key] is',
      key,
      this.resultAnsStudent[key]
    );
    if (this.resultAnsStudent[key].ans__id) {
    const answerData = {
      ans__id: this.resultAnsStudent[key].ans__id,
      ans__result: this.resultAnsStudent[key].ans__result,
    };

    this.AnswerService.updateAnswer(answerData).subscribe(
      (response: any) => {
      
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Update' });
      
          this.resultUp[key] = {
            updated: true,
           
          };
       
        console.log('seccess update', response);
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
        if(error.error?.message){
         
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
      }
    );

  }
    const dataforNew = {
      Student__id: this.resultAnsStudent[key].student__id,
      exam__id: this.resultAnsStudent[key].exam__id,
      ans__result: this.resultAnsStudent[key].ans__result,
    };



    if (!this.resultAnsStudent[key].ans__id) {
      const dataAnswers = {
        ans: dataforNew,
        files: [],
      };
      this.AnswerService.createAnswers(dataAnswers).subscribe(
        (response: any) => {
          this.resultAnsStudent[key].ans__id = response.ans__id
         
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Update' });

          console.log('success create', response);
        },
        (error: { error: { message: any } }) => {
          console.log('error', error);
          if(error.error?.message){
         
            this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
            }
        }
      );
    }
  }

  // groupExamsBySubject() {
  //   this.groupedExams = this.ExamT.reduce((acc, exam) => {
  //     if (!acc[exam.subject]) {
  //       acc[exam.subject] = [];
  //     }
  //     acc[exam.subject].push(exam);
  //     return acc;
  //   }, {});
  // }

  calculateRowSpan(subject: string): number {
    return this.groupedExams[subject].length;
  }

  // shouldRenderSubjectCell(rowIndex: number): boolean {
  //   const exam = this.ExamT[rowIndex];
  //   if (!this.subjectRenderTracker[exam.subject]) {
  //     this.subjectRenderTracker[exam.subject] = true;
  //     return true;
  //   }
  //   return false;
  // }

  rowGroups(exam: ExamGS): number {
    return exam.groups
      ? exam.groups.reduce((total, group) => total + this.rowStudents(group), 0)
      : 0;
  }

}
