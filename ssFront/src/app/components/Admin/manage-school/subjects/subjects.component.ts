import { Component } from '@angular/core';
import { SubjectService } from '../../../../services/servicesUtils/subject.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-subjects',
  standalone: true,
  imports: [    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    InputNumberModule ,
    DropdownModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    OverlayPanelModule,
    ButtonModule,
    ListboxModule,
    TriStateCheckboxModule,
    DialogModule,],
  templateUrl: './subjects.component.html',
  styleUrl: '../manage-school.component.css',
  styles: [
    `
      :host ::ng-deep .p-listbox .p-listbox-list {
        margin-bottom: 0 !important;
        padding: 0 !important;
      }
      :host ::ng-deep .p-inputnumber {
        background-color: transparent !important;
        display: flex !important;
justify-content: flex-start !important;
align-items: center !important;
      border : none !important;
      padding:  0 !important;
      }
      :host ::ng-deep .p-inputnumber-button {
        background-color: transparent !important;
        
      border : none !important;
      padding:  0 !important;
      }
      :host ::ng-deep .p-inputnumber-button-up {
        display: none !important;
      }
      :host ::ng-deep .p-inputnumber-button-down {
        display: none !important;
      }
      :host ::ng-deep .p-inputnumber-input  {
       padding: 10px 0 !important;
       width:60px;
       border-radius: 7px;
     text-align:center;
      }
      :host ::ng-deep .p-inputnumber-input:focus ~ .p-inputnumber-button-down {
        background-color: transparent !important;
        display: flex !important;
        color: black !important;
      }
      :host ::ng-deep .p-inputnumber-input:focus ~ .p-inputnumber-button-up {
        background-color: transparent !important;
        display: flex !important;
        color: black !important;
      }
      :host ::ng-deep .p-datatable .p-datatable-header {
        border: none !important;
      }
    `,
  ],
})
export class SubjectsComponent {
  subjects!: any;

  subjectName: { [key: number]: { Subject__name?: any; Msg?: string } } = {};
  subjectCoeff: { [key: number]: { coeff?: any; Msg?: string } } = {};
  subjectIds: number[] = [];

  NameNew!: string;
  CoeffNew!: any;

  coeffErrMsg: string = '';
  NameErrMsg: string = '';
  loading: boolean = true;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  closeDialog() {
    this.visible = false;
    this.resetInputs();
  }
  resetInputs() {
    this.NameNew = '';
    this.CoeffNew = null;
  }
  constructor(private subjectService: SubjectService, private messageService : MessageService) {}
  ngOnInit() {
    this.fetchSubjects();
  }

  controllerName(event: any, subjectId: any): boolean {
    const Name = event.trim();

    if (subjectId != null) {
      if (!this.subjectName[subjectId]) {
        this.subjectName[subjectId] = { Msg: '' };
      }

      if (Name === '') {
        console.log('subject name is requiered');
        this.subjectName[subjectId].Msg = 'subject name is requiered';
        return false;
      } else {
        const nameExist = this.subjects.filter(
          (s: { subject__id: number; subject__name: any }) =>
            s.subject__name === Name && s.subject__id != subjectId
        );
        if (nameExist.length > 0) {
          this.subjectName[subjectId].Msg = 'subject name is exist';
          console.log('subject name is exist', nameExist);
          console.log(' exist', Name);
          return false;
        } else {
          this.subjectName[subjectId].Msg = '';
          return true;
        }
      }
    } else {
      if (Name === '') {
        console.log('subject name is requiered');
        this.NameErrMsg = 'subject name is requiered';
        return false;
      } else {
        const nameExist = this.subjects.filter(
          (s: { subject__id: number; subject__name: any }) =>
            s.subject__name === Name && s.subject__id != subjectId
        );
        if (nameExist.length > 0) {
          this.NameErrMsg = 'subject name is exist';
          console.log('subject name is exist', nameExist);
          console.log(' exist', Name);
          return false;
        } else {
          this.NameErrMsg = '';
          return true;
        }
      }
    }
  }

  controllerCoeff(event: any, subjectId: any): boolean {
    const coeff = event;
    console.log("coeff coeff coeff ",coeff)
    if (subjectId != null) {
      if (!this.subjectCoeff[subjectId]) {
        this.subjectCoeff[subjectId] = { Msg: '' };
      }

      if (coeff ==null) {
        console.log('subject coefficient is requiered');
        this.subjectCoeff[subjectId].Msg = 'subject coefficient is requiered';
        return false;
      } else {
        this.subjectCoeff[subjectId].Msg = '';
        return true;
      }
    } else {
      if (coeff ==null) {
        console.log('subject coefficient is requiered');
        this.coeffErrMsg = 'subject coefficient is requiered';
        return false;
      } else {
        this.coeffErrMsg = '';
        return true;
      }
    }
  }

  checkIds(subjectId: number) {
    const Subject = this.subjects.find(
      (s: { subject__id: number }) => s.subject__id === subjectId
    );
console.log("coefficientcoefficient",Subject.coefficient)
    if (
      Subject &&
      this.subjectIds.includes(subjectId) &&
      this.subjectCoeff[subjectId].coeff == Subject.coefficient &&
      this.subjectName[subjectId].Subject__name === Subject.subject__name
    ) {
      // Remove subjectId from subjectIds if all conditions are met
      this.subjectIds = this.subjectIds.filter(
        (id: number) => id !== subjectId
      );
    }
  }

  changeName(event: any, subjectId: number) {
    const name = event;
    this.controllerName(event, subjectId);
    console.log('name is', subjectId);
    // Check if subjectId is already in subjectIds, if not, push it
    if (!this.subjectIds.includes(subjectId)) {
      this.subjectIds.push(subjectId);
    }
    // Ensure that activate[subjectId] is initialized
    if (!this.subjectName[subjectId]) {
      this.subjectName[subjectId] = { Subject__name: null };
    }

    // Set the active property to the name value
    this.subjectName[subjectId].Subject__name = name;
    this.checkIds(subjectId);
    console.log(this.subjectName);
    console.log('ghghhghghghghg', this.subjectIds);
  }

  changeCoeff(event: any, subjectId: number) {
    const coefficient = event;
    console.log("ccclclcl",coefficient)
    this.controllerCoeff(event, subjectId);
    console.log('coefficient is', subjectId);
    // Check if subjectId is already in subjectIds, if not, push it
    if (!this.subjectIds.includes(subjectId)) {
      this.subjectIds.push(subjectId);
    }
    // Ensure that activate[subjectId] is initialized
    if (!this.subjectCoeff[subjectId]) {
      this.subjectCoeff[subjectId] = { coeff: null };
    }

    // Set the active property to the coefficient value
    this.subjectCoeff[subjectId].coeff = coefficient;
    this.checkIds(subjectId);
    console.log(this.subjectCoeff);
    console.log('ghghhghghghghg', this.subjectIds);
  }

  initializeAttribute() {
    this.subjects.forEach(
      (S: {
        coefficient: any | number;
        subject__id: any | number;
        subject__name: any;
      }) => {
        if (!this.subjectName[S.subject__id]) {
          this.subjectName[S.subject__id] = { Subject__name: null, Msg: '' };
          this.subjectCoeff[S.subject__id] = { coeff: null, Msg: '' };
        }

        // Set the active property to the name value
        this.subjectName[S.subject__id].Subject__name = S.subject__name;
        this.subjectCoeff[S.subject__id].coeff = S.coefficient;
        console.log(this.subjectName);
      }
    );
  }

  fetchSubjects() {
    this.subjectService.getSubjects().subscribe(
      (data) => {
        this.subjects = data;
        console.log('Subjects data:', data);
        this.initializeAttribute()
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  NewSubjectAdd(data: any) {
    
    if (!this.subjectName[data.subject__id]) {
      this.subjectName[data.subject__id] = { Subject__name: null };
    }
    if (!this.subjectCoeff[data.subject__id]) {
      this.subjectCoeff[data.subject__id] = { coeff: null };
    }

    this.subjectCoeff[data.subject__id].coeff = data.coefficient;
    this.subjectName[data.subject__id].Subject__name = data.subject__name;
   
  }
  createSubject() {
    if (
      this.controllerCoeff(this.CoeffNew, null) &&
      this.controllerName(this.NameNew, null)
    ) {
      const subjectData = {
        coefficient: this.CoeffNew,

        subject__name: this.NameNew,
      };
      console.log('data  status:', subjectData);

      this.subjectService.createSubject(subjectData).subscribe(
        (data: any) => {
          this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully create Subject' });
          console.log('seccess', data);

          this.subjects.push(data);
          this.NewSubjectAdd(data);
          this.closeDialog();
          this.resetInputs();
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
          if(error.error?.message){
         
            this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
            }
        }
      );
    }
  }

  UpdateSubject(subjectId: number) {
    const Name = this.subjectName[subjectId].Subject__name;
    const Coef = this.subjectCoeff[subjectId].coeff;

    if (
      this.controllerCoeff(Coef, subjectId) &&
      this.controllerName(Name, subjectId)
    ) {
      const subjectData = {
        coefficient: Coef,

        subject__name: Name,
      };
      console.log('data  status:', subjectData);

      this.subjectService.updateSubject(subjectData,subjectId).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully update Subject' });
          console.log('seccess', response);
  
          this.subjectIds = this.subjectIds.filter((id) => id !== subjectId);
        },
        (error: { error: { message: any } }) => {
          console.log('errrr', error);
          if(error.error?.message){
         
            this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
            }
        }
      );
    }
  }

  deleteSubject(subjectId: number) {
    console.log('sss', subjectId);
    console.log('hay subject name : ', this.subjectName[subjectId].Subject__name);
    this.subjectService.DeleteSubject(subjectId).subscribe(
      (response: any) => {
        this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully delete Subject' });
        console.log('seccess', response);
        this.subjects = this.subjects.filter(
          (subject: { subject__id: number; }) => subject.subject__id !== subjectId
        );
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
        if(error.error?.message){
         
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
      }
    );
  }


}
