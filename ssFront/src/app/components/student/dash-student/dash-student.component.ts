import { Component, OnInit } from '@angular/core';
import { ExamAnswersService } from '../../../services/serviceAnswers/exam-answers.service';
import { TokenServiceService } from '../../../services/servicesUser/token-service.service';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dash-student',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-student.component.html',
  styleUrl: './dash-student.component.css'
})
export class DashStudentComponent implements OnInit {
  user__id = this.tokenService.getUserIdFromToken();
  group__id = this.tokenService.getGroupIdFromToken();
  group: any;
  subjectsArray:any[] =[]
  constructor(
    private groupService: GroupService,
    private tokenService: TokenServiceService,
    private AnswersService: ExamAnswersService
  ) {}

  ngOnInit(): void {
 
    this.fetchIngroup();
    
  }

  // fetchAnswers(): void {
  //   this.AnswersService.getStudentAnswer(this.user__id).subscribe(
  //     (data: any) => {
  //       this.results = data;
  //       // this.groupQuestionsByType();
  //       this.fetchIngroup();
  //       console.log('results datataken results results', this.results);
  //     },
  //     (error: any) => {
  //       console.error('Error fetching exam', error);
  //     }
  //   );
  // }

  fetchIngroup(): void {
    this.groupService.getoneGroup(this.group__id).subscribe(
      (data: any) => {
        this.group = data;
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
  

    for (const sub of this.group.subjects) {
      let count = 0;
      let i = 0;

    

      if (this.group.exams.length > 0) {
        for (const exam of this.group.exams) {
         
          if (exam.subject === sub.subject__name) {
            count = count + 1;
            if (exam.answers.length > 0) {
              for (const ans of exam.answers) {
                if(ans.student__id == this.user__id){
                  i = i + 1;
                 
                }
             
              }
            } 
          }
        }
      }
      let formdata = {
        subject: sub.subject__name,
       nb__exam : count,
       nb__examDone: i,
       
      };

      this.subjectsArray.push(formdata)

    }
    console.log('my formated with subjects',);
  
    // Optional: Print out the formatted data for debugging
    // console.log('Formatted group data', this.group);
  }











}
