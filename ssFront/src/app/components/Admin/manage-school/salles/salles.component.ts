import { Component } from '@angular/core';
import { SalleService } from '../../../../services/servicesUtils/salle.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-salles',
  standalone: true,
  imports: [
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    InputNumberModule,
    DropdownModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    MultiSelectModule,
    OverlayPanelModule,
    ButtonModule,
    ListboxModule,
    TriStateCheckboxModule,
    DialogModule,
    FormsModule,
  ],
  templateUrl: './salles.component.html',
  styleUrl: './salles.component.css',
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
        border: none !important;
        padding: 0 !important;
      }
      :host ::ng-deep .p-inputnumber-button {
        background-color: transparent !important;

        border: none !important;
        padding: 0 !important;
      }
      :host ::ng-deep .p-inputnumber-button-up {
        display: none !important;
      }
      :host ::ng-deep .p-inputnumber-button-down {
        display: none !important;
      }
      :host ::ng-deep .p-inputnumber-input {
        padding: 10px 0 !important;
        width: 60px;
        border-radius: 7px;
        text-align: center;
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
export class SallesComponent {
  salles!: any;

  salleName: { [key: number]: { salle__name?: any; Msg?: string } } = {};
  salleplace: { [key: number]: { place?: any; Msg?: string } } = {};
  salleIds: number[] = [];

  NameNew!: string;
  placeNew!: any;

  placeErrMsg: string = '';
  NameErrMsg: string = '';
  loading: boolean = true;
  visible: boolean = false;
  visibleDelete: boolean = false;
  salleId: any;
  CheckCount: any;
 constructor(private salleService: SalleService, private messageService : MessageService ) {}
  showDialog() {
    this.visible = true;
  }
  closeDialog() {
    this.visible = false;
    this.resetInputs();
  }


  showDeleteDialog(salle:any) {
    this.visibleDelete = true;
    this.salleId = salle.salle__id
  
    this.checksalle(this.salleId)
  }
  closeDeleteDialog() {
    this.visibleDelete = false;

  }
  resetInputs() {
    this.NameNew = '';
    this.placeNew = null;
  }
 
  ngOnInit() {
    this.fetchsalles();
  }

  controllerName(event: any, salleId: any): boolean {
    const Name = event.trim();

    if (salleId != null) {
      if (!this.salleName[salleId]) {
        this.salleName[salleId] = { Msg: '' };
      }

      if (Name === '') {
        console.log('salle name is requiered');
        this.salleName[salleId].Msg = 'salle name is requiered';
        return false;
      } else {
        const nameExist = this.salles.filter(
          (s: { salle__id: number; salle__name: any }) =>
            s.salle__name === Name && s.salle__id != salleId
        );
        if (nameExist.length > 0) {
          this.salleName[salleId].Msg = 'salle name is exist';
          console.log('salle name is exist', nameExist);
          console.log(' exist', Name);
          return false;
        } else {
          this.salleName[salleId].Msg = '';
          return true;
        }
      }
    } else {
      if (Name === '') {
        console.log('salle name is requiered');
        this.NameErrMsg = 'salle name is requiered';
        return false;
      } else {
        const nameExist = this.salles.filter(
          (s: { salle__id: number; salle__name: any }) =>
            s.salle__name === Name && s.salle__id != salleId
        );
        if (nameExist.length > 0) {
          this.NameErrMsg = 'salle name is exist';
          console.log('salle name is exist', nameExist);
          console.log(' exist', Name);
          return false;
        } else {
          this.NameErrMsg = '';
          return true;
        }
      }
    }
  }

  controllerplace(event: any, salleId: any): boolean {
    const place = event;
    console.log('place place place ', place);
    if (salleId != null) {
      if (!this.salleplace[salleId]) {
        this.salleplace[salleId] = { Msg: '' };
      }

      if (place == null) {
        console.log('salle NbPlace is requiered');
        this.salleplace[salleId].Msg = 'salle NbPlace is requiered';
        return false;
      } else {
        this.salleplace[salleId].Msg = '';
        return true;
      }
    } else {
      if (place == null) {
        console.log('salle NbPlace is requiered');
        this.placeErrMsg = 'salle NbPlace is requiered';
        return false;
      } else {
        this.placeErrMsg = '';
        return true;
      }
    }
  }

  checkIds(salleId: number) {
    const salle = this.salles.find(
      (s: { salle__id: number }) => s.salle__id === salleId
    );
    console.log('NbPlaceNbPlace', salle.nb__place);
    if (
      salle &&
      this.salleIds.includes(salleId) &&
      this.salleplace[salleId].place == salle.nb__place &&
      this.salleName[salleId].salle__name === salle.salle__name
    ) {
      // Remove salleId from salleIds if all conditions are met
      this.salleIds = this.salleIds.filter((id: number) => id !== salleId);
    }
  }

  changeName(event: any, salleId: number) {
    const name = event;
    this.controllerName(event, salleId);
    console.log('name is', salleId);
    // Check if salleId is already in salleIds, if not, push it
    if (!this.salleIds.includes(salleId)) {
      this.salleIds.push(salleId);
    }
    // Ensure that activate[salleId] is initialized
    if (!this.salleName[salleId]) {
      this.salleName[salleId] = { salle__name: null };
    }

    // Set the active property to the name value
    this.salleName[salleId].salle__name = name;
    this.checkIds(salleId);
    console.log(this.salleName);
    console.log('ghghhghghghghg', this.salleIds);
  }

  changeplace(event: any, salleId: number) {
    const NbPlace = event;
    console.log('ccclclcl', NbPlace);
    this.controllerplace(event, salleId);
    console.log('NbPlace is', salleId);
    // Check if salleId is already in salleIds, if not, push it
    if (!this.salleIds.includes(salleId)) {
      this.salleIds.push(salleId);
    }
    // Ensure that activate[salleId] is initialized
    if (!this.salleplace[salleId]) {
      this.salleplace[salleId] = { place: null };
    }

    // Set the active property to the NbPlace value
    this.salleplace[salleId].place = NbPlace;
    this.checkIds(salleId);
    console.log(this.salleplace);
    console.log('ghghhghghghghg', this.salleIds);
  }

  initializeAttribute() {
    this.salles.forEach(
      (S: {
        nb__place: any | number;
        salle__id: any | number;
        salle__name: any;
      }) => {
        if (!this.salleName[S.salle__id]) {
          this.salleName[S.salle__id] = { salle__name: null, Msg: '' };
          this.salleplace[S.salle__id] = { place: null, Msg: '' };
        }

        // Set the active property to the name value
        this.salleName[S.salle__id].salle__name = S.salle__name;
        this.salleplace[S.salle__id].place = S.nb__place;
        console.log(this.salleName);
      }
    );
  }

  fetchsalles() {
    this.salleService.getSalles().subscribe(
      (data) => {
        this.salles = data;
        console.log('salles data:', data);
        this.initializeAttribute();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching salles', error);
      }
    );
  }
  NewsalleAdd(data: any) {
    if (!this.salleName[data.salle__id]) {
      this.salleName[data.salle__id] = { salle__name: null };
    }
    if (!this.salleplace[data.salle__id]) {
      this.salleplace[data.salle__id] = { place: null };
    }

    this.salleplace[data.salle__id].place = data.nb__place;
    this.salleName[data.salle__id].salle__name = data.salle__name;
  }
  createsalle() {
    if (
      this.controllerplace(this.placeNew, null) &&
      this.controllerName(this.NameNew, null)
    ) {
      const salleData = {
        nb__place: this.placeNew,

        salle__name: this.NameNew,
      };
      console.log('data  status:', salleData);

      this.salleService.createSalle(salleData).subscribe(
        (data: any) => {
          this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully create Salle' });
          console.log('seccess', data);

          this.salles.push(data);
          this.NewsalleAdd(data);
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

  Updatesalle(salleId: number) {
    const Name = this.salleName[salleId].salle__name;
    const NbPlace = this.salleplace[salleId].place;

    if (
      this.controllerplace(NbPlace, salleId) &&
      this.controllerName(Name, salleId)
    ) {
      const salleData = {
        nb__place: NbPlace,

        salle__name: Name,
      };
      console.log('data  status:', salleData);

      this.salleService.updateSalle(salleData, salleId).subscribe(
        (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully update' });

          console.log('seccess', response);

          this.salleIds = this.salleIds.filter((id) => id !== salleId);
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



  checksalle(salleId: number) {
    console.log('sss', salleId);
    console.log('hay salle name : ', this.salleName[salleId].salle__name);
    this.salleService.SalleCheck(salleId).subscribe(
      (data: any) => {
            
       this.CheckCount= data
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
        if(error.error?.message){
         
          this.messageService.add({ severity: 'danger', summary: 'Failed', detail:  error.error?.message });
          }
      }
    );
  }


  deletesalle(salleId: number) {
    console.log('sss', salleId);
    console.log('hay salle name : ', this.salleName[salleId].salle__name);
    this.salleService.DeleteSalle(salleId).subscribe(
      (response: any) => {
            
        this.messageService.add({ severity: 'success', summary: 'success', detail:  ' Successfully delete' });


        console.log('seccess', response);
        this.salles = this.salles.filter(
          (salle: { salle__id: number }) => salle.salle__id !== salleId
        );
        this.visibleDelete = false
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
