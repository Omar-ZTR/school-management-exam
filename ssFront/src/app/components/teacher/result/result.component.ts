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

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [TableModule,  FormsModule, HttpClientModule, TagModule, CommonModule,InputTextModule, IconFieldModule, InputIconModule],
  providers: [],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit{

  selectedExams: any;
    ExamGS: ExamGS[] = [];
   ExamT: ExamTab[] = [];
   ExamD: ExamGS[] = [];
groupedExams: { [subject: string]: any[] } = {};
subjectRenderTracker: { [subject: string]: boolean } = {};

searchValue: string = '';


    constructor(private examService: ExamService) {}

    ngOnInit() {
        this.examService.getTeacherExamGS().subscribe(
            (data: ExamGS[]) => {
              console.log('Response from backend:', data);
              this.ExamGS = data;
              console.log(this.ExamGS)
this.ExamD= this.ExamGS
              this.ExamGS.forEach(exam => {
                exam.groups.forEach(group => {
                    group.students.forEach(student => {
                      this.ExamT.push({
                            exam__id: exam.exam__id,
                            subject: exam.subject,
                            group__id: group.group__id,
                            group__name: group.group__name,
                            user__id: student.user__id,
                            student__name: `${student.first__name} ${student.last__name}`,
                            user__email: student.user__email
                        });
                    });
                });})
                console.log(this.ExamT)
            },
            (error: any) => {
              console.error('Error fetching exams', error);
            }
          );
        
      
       
        
        }
          rowStudents(group: Group): number {
    return group.students ? group.students.length : 0;
  }
  
  filterData(searchValue: string) {
    const filteredData = searchValue
      ? this.ExamGS.reduce((acc: any[], exam: { subject: string; groups: any[]; }) => {
          // Check if search value is in the subject
          if (exam.subject.toLowerCase().includes(searchValue.toLowerCase())) {
            acc.push(exam); // Add the entire exam if subject matches
            return acc;
          }
      
          const filteredGroups = exam.groups.filter(group =>
            group.group__name.toLowerCase().includes(searchValue.toLowerCase())
          );
      
          if (filteredGroups.length > 0) {
            // Return the entire exam with filtered groups if group name matches
            acc.push({ ...exam, groups: filteredGroups });
            return acc;
          }
      
          // Check if search value is in any student name or email within the exam
          const updatedGroups = exam.groups.map(group => {
            const filteredStudents = group.students.filter((student: { first__name: string; user__email: string; }) =>
              student.first__name.toLowerCase().includes(searchValue.toLowerCase()) ||
              student.user__email.toLowerCase().includes(searchValue.toLowerCase())
            );
            if (filteredStudents.length > 0) {
              const updatedStudents = filteredStudents.map((student: { user__email: string; }) => ({
                ...student,
                // Include the email in the filtered students
                user__email: student.user__email.toLowerCase().includes(searchValue.toLowerCase()) ? student.user__email : ''
              }));
              return { ...group, students: updatedStudents };
            } else {
              return null; // Return null for groups with no matching students
            }
          }).filter(Boolean); // Remove null values from the array
      
          if (updatedGroups.length > 0) {
            // Return the entire exam with updated groups containing filtered students
            acc.push({ ...exam, groups: updatedGroups });
          }
      
          return acc;
        }, [])
      : this.ExamGS; // Reset to original data when search input is empty
    
    this.ExamD = filteredData;
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
  
  shouldRenderSubjectCell(rowIndex: number): boolean {
    const exam = this.ExamT[rowIndex];
    if (!this.subjectRenderTracker[exam.subject]) {
      this.subjectRenderTracker[exam.subject] = true;
      return true;
    }
    return false;
  }

  rowGroups(exam: ExamGS): number {
    return exam.groups ? exam.groups.reduce((total, group) => total + this.rowStudents(group), 0) : 0;
  }
    // getSeverity(status: string) {
    //     switch (status) {
    //         case 'unqualified':
    //             return 'danger';

    //         case 'qualified':
    //             return 'success';

    //         case 'new':
    //             return 'info';

    //         case 'negotiation':
    //             return 'warning';

    //         case 'renewal':
    //             return null;
    //     }
    // }
}