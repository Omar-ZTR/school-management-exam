import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { Teacher } from '../../Admin/manage-teacher/manage-teacher.component';
import { AddQuestionComponent } from '../add-question/add-question.component';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TooltipModule } from 'primeng/tooltip';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-teacher-question',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    FormsModule,
    TableModule,
    DialogModule,
    AccordionModule,
    AddQuestionComponent,
    DropdownModule ,
    InputTextModule,
  ],
  templateUrl: './teacher-question.component.html',
  styleUrl: './teacher-question.component.css',
  styles: [
    `
      :host ::ng-deep .p-dialog-header-close  {
        display : none !important;
    
      }

      :host ::ng-deep  .p-tooltip-text{
        color: red !important
      }
    
    `,
  ],
})
export class TeacherQuestionComponent {
  // @Output() questionToEdit = new EventEmitter<any>();

  user__id = this.tokenService.getUserIdFromToken();
  Allquestions: any;
  edit: boolean = false;
  questedit: any ;
  subjects: any;
  subject: any;
  Types!: { name: string; }[];
  associationStatus: { [key: number]: { check: boolean ; examNames: string[] } } = {};
  constructor(
    private questService: QuestionService,
    private teacherService: TeacherService,
    private tokenService: TokenServiceService,
    private messageService : MessageService,
  ) {}
  subjectFilter!: string ;
  typeFilter!: string;
 filteredQuestions() {
console.log("typeFilter",this.typeFilter)
console.log("subjectFilter",this.subjectFilter)


if(this.subjectFilter || this.typeFilter){
return this.Allquestions.filter((question: { question__subject: string; question__type: string; }) => {

  let subjectName =''
let matchesSubject =true
if(this.subjectFilter){
    subjectName = question.question__subject ? question.question__subject.toLowerCase() : '';

   matchesSubject = subjectName.includes(this.subjectFilter.toLowerCase());


}
let questionType =''
let matchesType =true
if(this.typeFilter){


questionType = question.question__type ? question.question__type.toLowerCase() : '';

  
  matchesType = questionType.includes(this.typeFilter.toLowerCase());
}
  
      return matchesSubject && matchesType;
    });
}else{

  return this.Allquestions
}

    
  }
  ngOnInit(): void {
   
    this.Types = [
      { name: 'QCM',  },
      { name: 'Normal',  },
    
  ];
    this.filteredQuestions() 
    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
        const teacher = data;

        this.Allquestions = teacher[0].questions;
this.subjects= teacher[0].subjects
this.intializeAccociation()
        this.checkAssociations(this.Allquestions)

        console.log('subjectshhhhhhsss is is sis', teacher[0].subjects);
        console.log('questions is is sis', teacher[0].questions);
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  typeFile(file: any): any {
    const extension = getFileExtension(file.file__name);
    const fileType = getFileType(extension);
    // console.log("type file is",fileType)
    // console.log("type  is",file.file__type)
    return { name: file.name, type: fileType };
  }
  openFile(filePath: string): void {
    window.open(filePath, '_blank');
  }
  loadQuestions(response: any): void {
    console.log('Question added with response:', response);

    const index = this.Allquestions.indexOf(this.questedit);
  if (index > -1) {
   
    this.Allquestions[index] = response;
  } else {
   
    this.Allquestions.push(response);
    this.associationStatus[response.question__id] = {
      check: false,
      examNames: ['']
    };

  }
 this.edit = false
  }
  addQuestion(){
    this.questedit = null
    this.edit = true;
  }
  EditQuestion(quest: any) {
    this.questedit = quest;
    this.edit = true;
    this.subject = this.findSubject(this.questedit.question__subject);
    console.log('question jjdhkshdsc hhd ', this.questedit);
  }
  findSubject(subjectName: string): any {
    console.log('Searching for subject name:', this.subjects);
    let foundSubject = null;
    this.subjects.forEach((subject: { subject__name: string }) => {
      console.log('Checking subject:', subject.subject__name);
      if (subject.subject__name.trim() === subjectName.trim()) {
        foundSubject = subject;
      }
    });

    if (!foundSubject) {
      console.error('No subject found for name:', subjectName);
    } else {
      console.log('Found subject:', foundSubject);
    }

    return foundSubject;
  }


  removeQuestion(quest: any) {
    const model = {
      exam__id: 0,
      action: 'delete',
    };
const id = quest.question__id
    this.questService.deleteQuestion(id, model).subscribe(
      (response) => {
        console.log('Response from backend:', response);
    
        this.Allquestions = this.Allquestions.filter((quest: { question__id: any; }) => quest.question__id !== id);
        
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Successfully Delete' });

            console.log('success', response);
      },
      (error: any) => {
        console.error('Error fetching groups', error);
        if(error.error?.message){
         
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
      }
    );
  }
  intializeAccociation(){
    this.Allquestions.forEach((question: { question__id: number; }) => {

      this.associationStatus[question.question__id] = {
        check: false,
        examNames:['']
      };

    })

  }
  checkAssociations(data:any): void {
   data.forEach((question: { question__id: number; }) => {
        this.questService.CheckAssoci(question.question__id).subscribe(
          (data:any) => {
            console.log('Response from backend for question ID', question.question__id, ':', data);
            this.associationStatus[question.question__id] = {
              check: data.check,
              examNames: data.examNames
            };
            console.log(' question ID', question.question__id, ':',  this.associationStatus[question.question__id]);
          },
          (error: any) => {
            console.error('Error fetching association status for question ID', question.question__id, ':', error);
            this.associationStatus[question.question__id].check = false; 
          }
        );
      });
    }

}
