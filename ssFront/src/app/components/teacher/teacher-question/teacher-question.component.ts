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

@Component({
  selector: 'app-teacher-question',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    AccordionModule,
    AddQuestionComponent,
  ],
  templateUrl: './teacher-question.component.html',
  styleUrl: './teacher-question.component.css',
})
export class TeacherQuestionComponent {
  // @Output() questionToEdit = new EventEmitter<any>();

  user__id = this.tokenService.getUserIdFromToken();
  Allquestions: any;
  edit: boolean = false;
  questedit: any = [];
  subjects: any;
  subject: any;
  constructor(
    private questService: QuestionService,
    private teacherService: TeacherService,
    private tokenService: TokenServiceService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.teacherService.getTecher(this.user__id).subscribe(
      (data: Teacher[]) => {
        const teacher = data;

        this.Allquestions = teacher[0].questions;
this.subjects= teacher[0].subjects
        console.log('subjectshhhhhhsss is is sis', teacher[0].subjects);
        console.log('questions is is sis', teacher[0].questions);
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
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
    // this.checkAssociations();
  }

  deleteQuestion(quest: any) {
    // this.checkAssociations();

    const model = {
      exam__id: '',
      action: 'delete',
    };

    this.questService.deleteQuestion(quest.question__id, model).subscribe(
      (data) => {
        console.log('deleteQuestion:', data);
      },
      (error: any) => {
        console.error('Error fetching groups', error);
      }
    );
  }
}
