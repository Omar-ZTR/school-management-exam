import { Component, OnInit } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { GroupService } from '../../../services/servicesUtils/group.service';

@Component({
  selector: 'app-studentanswers',
  standalone: true,
  imports: [TableModule, CommonModule],
  templateUrl: './studentanswers.component.html',
  styleUrl: './studentanswers.component.css'
})
export class StudentanswersComponent implements OnInit {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
results:any;
  group: any;

constructor(  private groupService: GroupService, private tokenService: TokenServiceService, private AnswersService:ExamAnswersService, ){}

  

ngOnInit(): void {
  
  this.fetchAnswers()
  this.fetchIngroup()
}


  fetchAnswers(): void {
    this.AnswersService.getStudentAnswer(this.user__id).subscribe(
      (data:any) => {
       this.results=data
        // this.groupQuestionsByType();
        console.log('datataken', this.results);
      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  fetchIngroup(): void {
    this.groupService.getoneGroup(this.group__id).subscribe(
      (data:any) => {
       this.group=data
        // this.groupQuestionsByType();
        console.log('group', this.group);

        this.formateData()

      },
      (error: any) => {
        console.error('Error fetching exam', error);
      }
    );
  }

  formateData(): void {
    // Add a property 'answers' to each exam in the group to hold the related answers
    for (const exam of this.group.exams) {
      exam.answers = this.results.filter((answer: { exam__id: any; exam__oblig: boolean; }) => 
        answer.exam__id === exam.exam__id && answer.exam__oblig === true
      );
    }
  
    // Optional: Print out the formatted data for debugging
    console.log('Formatted group data', this.group);
  }
}
