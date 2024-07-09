import { Component } from '@angular/core';
import { SubjectService } from '../../../../services/servicesUtils/subject.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { GroupService } from '../../../../services/servicesUtils/group.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DialogModule } from 'primeng/dialog';

export interface Subject {
  subject__name: string;
  subject__id: string;
}

export interface Group {
  group__name: string;
  group__id: number;
  subjects: Subject[];
}

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [
    FormsModule,
    TableModule,
    TagModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
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
  ],
  templateUrl: './groups.component.html',
  styleUrl: '../manage-school.component.css',
  styles: [
    `
      :host ::ng-deep .p-listbox .p-listbox-list {
        margin-bottom: 0 !important;
        padding: 0 !important;
      }
      :host ::ng-deep .p-datatable-striped {
        background-color: rgba(87, 4, 4, 0.749) !important;
      }
    `,
  ],
})
export class GroupsComponent {
  subjects!: any;
  groups: Group[] = [];
  MsgError: string = '';
  MsgErrorForUpdate: { [key: number]: { Msg?: string } } = {};
  subjectExist: { [key: string]: any[] } = {};
  subjectNotIn: { [key: string]: any[] } = {};

  groupIds: number[] = [];
  groupselesct!: Group;
  groupName: { [key: number]: { group__name?: any , Msg?: string} } = {};

  listsubjects!: any;
  NameNew!: string;
  subjectAdd!: any;
  loading: boolean = true;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
    this.listsubjects = this.subjects;
  }
  closeDialog() {
    this.visible = false;
    this.resetInputs();
  }
  resetInputs() {
    this.listsubjects = [];
    this.NameNew = '';
    this.subjectAdd = [];
  }

  constructor(
    private subjectService: SubjectService,
    private groupService: GroupService
  ) {}
  ngOnInit() {
    this.fetchSubjects();
    this.fetchGroups();

    console.log('hhdhshs ids', this.groups);
  }
  initializeGrouName() {
    this.groups.forEach((g) => {
      if (!this.groupName[g.group__id]) {
        this.groupName[g.group__id] = { group__name: null };
        this.groupName[g.group__id] = { Msg: '' };
      }

      // Set the active property to the name value
      this.groupName[g.group__id].group__name = g.group__name;
      console.log(this.groupName);
    });
  }

  SelectsubjectNew(event: any, op: OverlayPanel) {
    const selectedSubject = event.value;
    if (!this.subjectAdd) {
      this.subjectAdd = [];
    }
    this.subjectAdd.push(selectedSubject);

    this.listsubjects = this.listsubjects.filter(
      (subject: { subject__id: string }) =>
        subject.subject__id !== selectedSubject.subject__id
    );
    if (this.listsubjects.length <= 0) {
      op.hide();
    }
  }

  RemovesubjectNew(event: any) {
    const selectedSubject = event.value;

    if (selectedSubject !== null) {
      this.listsubjects.push(selectedSubject);
      console.log('selectSubject t is', selectedSubject);
      console.log('suvbjects Adddeed', this.subjectAdd);
      this.subjectAdd = this.subjectAdd.filter(
        (subject: { subject__id: string }) =>
          subject.subject__id !== selectedSubject.subject__id
      );
    }
  }

  arraysEqual(arr1: any[], arr2: any[], id: string): boolean {
    let ExistIds = arr1.map((g) => g[id]);
    let groupIds = arr2.map((g) => g[id]);
    const sortedArr1 = ExistIds.slice().sort((a, b) => a - b);
    const sortedArr2 = groupIds.slice().sort((a, b) => a - b);
    console.log(sortedArr1, sortedArr2);
    // Convert arrays to JSON strings and compare
    const str1 = JSON.stringify(sortedArr1);
    const str2 = JSON.stringify(sortedArr2);
    console.log(str1, str2);
    return str1 === str2;
  }
  checkIds(groupId: number) {
    const group = this.groups.find((g) => g.group__id === groupId);

    if (
      group &&
      this.groupIds.includes(groupId) &&
      this.arraysEqual(
        this.subjectExist[groupId],
        group.subjects,
        'subject__id'
      ) &&
      this.groupName[groupId].group__name === group.group__name
    ) {
      // Remove groupId from groupIds if all conditions are met
      this.groupIds = this.groupIds.filter((id) => id !== groupId);
    }
  }

  changeName(event: any, groupId: number) {
    const name = event;
    this.controllerUpdate(event,groupId);
    console.log('name is', groupId);
    // Check if groupId is already in groupIds, if not, push it
    if (!this.groupIds.includes(groupId)) {
      this.groupIds.push(groupId);
    }
    // Ensure that activate[groupId] is initialized
    if (!this.groupName[groupId]) {
      this.groupName[groupId] = { group__name: null };
    }

    // Set the active property to the name value
    this.groupName[groupId].group__name = name;
    this.checkIds(groupId);
    console.log(this.groupName);
    console.log('ghghhghghghghg', this.groupIds);
  }
  Selectsubject(event: any, groupID: number) {
    const selectedSubject = event.value;
    if (!this.groupIds.includes(groupID)) {
      this.groupIds.push(groupID);
    }
    // Remove the selected subject from subjectExist[groupID]
    this.subjectNotIn[groupID] = this.subjectNotIn[groupID].filter(
      (subject: { subject__id: string }) =>
        subject.subject__id !== selectedSubject.subject__id
    );
    this.subjectExist[groupID].push(selectedSubject);
    this.checkIds(groupID);
  }

  removesubject(event: any, groupID: number) {
    const selectedSubject = event.value;
    if (!this.groupIds.includes(groupID)) {
      this.groupIds.push(groupID);
    }
    // Remove the selected subject from subjectExist[groupID]
    this.subjectExist[groupID] = this.subjectExist[groupID].filter(
      (subject: { subject__id: string }) =>
        subject.subject__id !== selectedSubject.subject__id
    );
    this.subjectNotIn[groupID].push(selectedSubject);
    this.checkIds(groupID);
    console.log('groupIdsS', this.groupIds);
  }
  NewgroupAdd(data: Group) {
    const groupSubjectIds = data.subjects.map((subject) => subject.subject__id);
    this.subjectExist[data.group__id] = this.subjects.filter(
      (subject: { subject__id: string }) =>
        groupSubjectIds.includes(subject.subject__id)
    );
    this.subjectNotIn[data.group__id] = this.subjects.filter(
      (subject: { subject__id: string }) =>
        !groupSubjectIds.includes(subject.subject__id)
    );
    if (!this.groupName[data.group__id]) {
      this.groupName[data.group__id] = { group__name: null };
    }

    // Set the active property to the name value
    this.groupName[data.group__id].group__name = data.group__name;
    console.log(this.groupName);
  }
  filterSubjectsForAllgroups(): void {
    this.groups.forEach((g) => {
      const groupSubjectIds = g.subjects.map((subject) => subject.subject__id);
      this.subjectExist[g.group__id] = this.subjects.filter(
        (subject: { subject__id: string }) =>
          groupSubjectIds.includes(subject.subject__id)
      );
      this.subjectNotIn[g.group__id] = this.subjects.filter(
        (subject: { subject__id: string }) =>
          !groupSubjectIds.includes(subject.subject__id)
      );
    });
    console.log('subjectNotIn data:', this.subjectNotIn);
    console.log('subjectExist data:', this.subjectExist);
  }

  fetchGroups() {
    this.groupService.getGroups().subscribe(
      (data: Group[]) => {
        this.groups = data;
        console.log('Groups data:', data);
        this.filterSubjectsForAllgroups();
        this.initializeGrouName();
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  fetchSubjects() {
    this.subjectService.getSubjects().subscribe(
      (data) => {
        this.subjects = data;
        console.log('Subjects data:', data);
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  controller(event: any) {
    const Name = event.trim();

    if (Name === '') {
      console.log('group name is requiered');
      this.MsgError = 'group name is requiered';
    } else {
      const nameExist = this.groups.filter((g) => g.group__name === Name);
      if (nameExist.length > 0) {
        this.MsgError = 'group name is exist';
        console.log('group name is exist', nameExist);
        console.log(' exist', Name);
      } else {
        this.MsgError = '';
      }
    }
  }

  controllerUpdate(event: any, GroupId: number):boolean {
    const Name = event.trim();
    if (!this.groupName[GroupId]) {
      this.groupName[GroupId] = { Msg: '' };
    }

    if (Name === '') {
      console.log('group name is requiered');
      this.groupName[GroupId].Msg = 'group name is requiered';
      return false
    } else {
      const nameExist = this.groups.filter((g) => g.group__name === Name && g.group__id != GroupId);
      if (nameExist.length > 0) {
        this.groupName[GroupId].Msg = 'group name is exist';
        console.log('group name is exist', nameExist);
        console.log(' exist', Name);
        return false
      } else {
        this.groupName[GroupId].Msg = '';
        return true
      }
    }
  
  }

  CreatGroup() {
    let arraySubjects: any[] = [];

    if (this.subjectAdd) {
      arraySubjects = this.subjectAdd.map(
        (subject: { subject__id: string }) => subject.subject__id
      );
    }
    if (!this.NameNew) {
      console.log('group name is requiered');
      this.MsgError = 'group name is requiered';
    } else {
      const nameExist = this.groups.filter(
        (g) => g.group__name === this.NameNew
      );
      if (nameExist.length > 0) {
        this.MsgError = 'group name is exist';
        console.log('group name is exist', nameExist);
        console.log(' exist', this.NameNew);
      } else {
        const groupData = {
          subjects: arraySubjects,

          group__name: this.NameNew,
        };
        console.log('data  status:', groupData);

        this.groupService.createGroup(groupData).subscribe(
          (data: Group) => {
            alert('Successfully create');
            console.log('seccess', data);

            this.groups.push(data);
            this.NewgroupAdd(data);
            this.closeDialog();
            this.resetInputs();
          },
          (error: { error: { message: any } }) => {
            console.log('errrr', error);
          }
        );
      }
    }
  }

  UpdateGroup(groupId: number) {
    const formsub = this.subjectExist[groupId];
    console.log('Form group value:', formsub);
    const Name = this.groupName[groupId].group__name;
    console.log('Form Name value:', Name);
if(this.controllerUpdate(Name,groupId)){
    let arraySubjects: any[] = [];

    if (formsub !== null) {
      arraySubjects = formsub.map(
        (subject: { subject__id: string }) => subject.subject__id
      );
    }

    const groupData = {
      subjects: arraySubjects,

      group__name: Name,
    };
    console.log('data  status:', groupData);

    this.groupService.updateGroup(groupData, groupId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);

        this.groupIds = this.groupIds.filter((id) => id !== groupId);
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  }
  deletegroup(groupId: number) {
    console.log('sss', groupId);
    console.log('hay group name : ', this.groupName[groupId].group__name);
    this.groupService.DeleteGroup(groupId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);
        this.groups = this.groups.filter(
          (group) => group.group__id !== groupId
        );
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }

  selectsubject(op: OverlayPanel, group: Group) {
    this.groupselesct = group;

    op.toggle(event);
  }
  selectNewsubject(op: OverlayPanel) {
    op.toggle(event);
  }
}
