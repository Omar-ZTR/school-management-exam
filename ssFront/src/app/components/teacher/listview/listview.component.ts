import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { QuestionService } from '../../../services/serviceTeacher/question.service';
import { getFileExtension, getFileType } from '../../../shared/utilsFile';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [CommonModule, TableModule, AccordionModule],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css',
  styles: [
    `
      :host ::ng-deep .p-accordion-header a {
        color: #100d6a !important;
    
      }

      :host ::ng-deep .p-accordion-header a:hover {
        text-decoration: none !important;
      }
    `,
  ],
})
export class ListviewComponent   {
  @Input() data: any;
  @Input() TypeArray:boolean | undefined;
  @Output() questionAdded = new EventEmitter<any>();
  
  @Output() questionremoved = new EventEmitter<any>();

  associationStatus: { [key: number]: boolean } = {};


constructor(  private questService: QuestionService,){}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
 
  }
  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['data']) {
  //     this.checkAssociations();
  //     console.log(",,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,sssssssssssssssssssssssss",this.data) // Call checkAssociations when 'data' changes
  //   }
  // }
  // checkAssociations(): void {
  //   this.data.forEach((question: { question__id: number; }) => {
  //     this.questService.CheckAssoci(question.question__id).subscribe(
  //       (data:any) => {
  //         console.log('Response from backend for question ID', question.question__id, ':', data);
  //         this.associationStatus[question.question__id] = data; 
  //         console.log(' question ID', question.question__id, ':',  this.associationStatus[question.question__id]);
  //       },
  //       (error: any) => {
  //         console.error('Error fetching association status for question ID', question.question__id, ':', error);
  //         this.associationStatus[question.question__id] = false; // Set to false in case of an error
  //       }
  //     );
  //   });
  // }
   
addQuestion(quest:any){
  // this.checkAssociations(); 
  this.questionAdded.emit(quest);
}


removeQuestion(quest:any){
  // this.checkAssociations(); 
  this.questionremoved.emit(quest);
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
deleteQuestion(quest:any){
  // this.checkAssociations(); 
  this.questionremoved.emit(quest);

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
