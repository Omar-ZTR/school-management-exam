import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { TableModule, Table } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';

import { GroupService } from '../../../services/servicesUtils/group.service';

import { Teacher } from '../manage-teacher/manage-teacher.component';
import { StudentService } from '../../../services/serviceStudent/student.service';
export interface Student {
  user__id: number;
  first__name: string;
  last__name: string;
  user__email: string;
  active: boolean | null;
  password: string;
  description: string;
  CV__path: string;
  birthday: string;
  role: string;

  group__id: string;
}
@Component({
  selector: 'app-manage-student',
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
  ],
  templateUrl: './manage-student.component.html',
  styleUrl: './manage-student.component.css',
  styles: [
    `
      :host ::ng-deep .p-listbox .p-listbox-list {
        margin-bottom: 0 !important;
        padding: 0 !important;
      }
     
    `,
  ],
})
export class ManageStudentComponent implements OnInit {
  students: Student[] = [];
  studentsAccept: Student[] = [];
  studentsWait: Student[] = [];
  studentsRefused: Student[] = [];
  currentTableData!: Student[];

  studentselesct!: Student;
  studentsIds: number[] = [];

  groupNotIn: { [key: string]: any[] } = {};
  searchValue: string = '';
  filterButton!: string;

  loading: boolean = true;
  activityValues: number[] = [0, 100];
  activate: { [key: number]: { active?: any } } = {};
  group: { [key: number]: { group__id?: any; group__name?: any } } = {};
  groups!: any;
  openFile(filePath: string): void {
    window.open(filePath, '_blank');
  }
  constructor(
    private studentService: StudentService,
    private groupService: GroupService
  ) {}

  switchTable(tableName: string) {
    this.loading = true; // Example: Set loading state

    switch (tableName) {
      case 'students':
        this.currentTableData = this.students;
        this.filterButton = 'students';
        break;
      case 'studentsAccept':
        this.currentTableData = this.studentsAccept;
        this.filterButton = 'studentsAccept';
        break;
      case 'studentsRefused':
        this.currentTableData = this.studentsRefused;
        this.filterButton = 'studentsRefused';
        break;
      case 'studentsWait':
        this.currentTableData = this.studentsWait;
        this.filterButton = 'studentsWait';
        break;
      default:
        this.currentTableData = [];
        this.filterButton = '';
    }

    this.loading = false; // Example: Clear loading state
  }
  ngOnInit() {
    this.fetchGroups();

    this.fetchStudents();
    setTimeout(() => {
      if (this.loading) {
        this.fetchGroups();

    this.fetchStudents();
      }
    }, 30000);
    console.log('hhdhshs ids', this.studentsIds);
  }

  fetchGroups() {
    this.groupService.getGroups().subscribe(
      (data) => {
        this.groups = data;
        console.log('Groups data:', data);
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }

  initializeActivation() {
    this.students.forEach((teacher) => {
      if (!this.activate[teacher.user__id]) {
        this.activate[teacher.user__id] = { active: null };
      }

      // Set the active property to the action value
      this.activate[teacher.user__id].active = teacher.active;
      console.log(this.activate);
    });
  }
  // initializeGroup() {
  //   this.students.forEach((teacher) => {
  //     if (!this.activate[teacher.user__id]) {
  //       this.group[teacher.user__id] = { group__id: null };
  //     }

  //     // Set the active property to the action value
  //     this.group[teacher.user__id].group__id = teacher.group__id;

  //     console.log(this.group);
  //   });
  // }
  activation(event: any, studentId: number) {
    const action = event.value;
    console.log('action is', action);
    // Check if studentId is already in studentIds, if not, push it
    if (!this.studentsIds.includes(studentId)) {
      this.studentsIds.push(studentId);
    }

    // Ensure that activate[studentId] is initialized
    if (!this.activate[studentId]) {
      this.activate[studentId] = { active: null };
    }

    // Set the active property to the action value
    this.activate[studentId].active = action;
    this.checkIds(studentId);
    console.log(this.activate);
    console.log('ghghhghghghghg', this.studentsIds);
  }
  filtergroupsForAllTeachers(): void {
    this.students.forEach((student) => {
      const studentgroupIds = student.group__id;
      const groupfind = this.groups.find(
        (g: { group__id: any }) => g.group__id === studentgroupIds
      );

      if (!this.group[student.user__id]) {
        this.group[student.user__id] = { group__id: null, group__name:null };
      }
      this.group[student.user__id].group__id = studentgroupIds;
if(groupfind){
      this.group[student.user__id].group__name = groupfind.group__name;
      }
      if(!groupfind){
        this.group[student.user__id].group__name = null;
        }
      this.groupNotIn[student.user__id] = this.groups.filter(
        (group: { group__id: string }) => group.group__id !== studentgroupIds
      );
      console.log(student.user__id, this.groupNotIn[student.user__id]);
      console.log(student.user__id, this.group[student.user__id]);
    });
  }

  fetchStudents() {
    this.studentService.getStudents().subscribe(
      (data: Student[]) => {
        this.students = data;
        console.log('All students:', this.students);

        this.studentsAccept = this.students.filter(
          (student) => student.active == true
        );
        this.studentsRefused = this.students.filter(
          (student) => student.active == false
        );
        this.studentsWait = this.students.filter(
          (student) => student.active === null
        );

        console.log('Accepted students:', this.studentsAccept);
        console.log('Waiting students:', this.studentsWait);
        console.log('Refused students:', this.studentsRefused);

        this.filtergroupsForAllTeachers();
        this.initializeActivation();
        this.switchTable('students');
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching students', error);
      }
    );
  }

  arraysEqual(arr1: any[], arr2: any[], id: string): boolean {
    let ExistIds = arr1.map((g) => g[id]);
    let teacherIds = arr2.map((g) => g[id]);
    const sortedArr1 = ExistIds.slice().sort((a, b) => a - b);
    const sortedArr2 = teacherIds.slice().sort((a, b) => a - b);
    console.log(sortedArr1, sortedArr2);
    // Convert arrays to JSON strings and compare
    const str1 = JSON.stringify(sortedArr1);
    const str2 = JSON.stringify(sortedArr2);
    console.log(str1, str2);
    return str1 === str2;
  }
  checkIds(studentId: number) {
    const student = this.students.find((s) => s.user__id === studentId);

    if (
      student &&
      this.studentsIds.includes(studentId) &&
      this.group[studentId].group__id === student.group__id &&
      this.activate[studentId].active === student.active
    ) {
      // Remove studentId from studentIds if all conditions are met
      this.studentsIds = this.studentsIds.filter((id) => id !== studentId);
    }
  }

  Removegroup(idGroup: any, studentId: number) {
   
    if (!this.studentsIds.includes(studentId)) {
      this.studentsIds.push(studentId);
    }
    const selectedgroup = this.groups.find(
      (g: { group__id: any }) => g.group__id === idGroup
    );
   
    this.group[studentId] = { group__id: null , group__name:null};
    this.groupNotIn[studentId].push(selectedgroup);

    this.checkIds(studentId);

    console.log('rem addN', this.groupNotIn);
  }

  Selectgroup(event: any, studentId: number) {
    const selectedGroup = event.value;
    if (!this.studentsIds.includes(studentId)) {
      this.studentsIds.push(studentId);
    }
    // Remove the selected group from groupNotIn[studentId]
    this.groupNotIn[studentId] = this.groups.filter(
      (group: { group__id: string }) =>
        group.group__id !== selectedGroup.group__id
    );
    if (!this.group[studentId]) {
      this.group[studentId] = { group__id: null, group__name: null };
    }

    // Set the active property to the action value
    this.group[studentId].group__id = selectedGroup.group__id;
    this.group[studentId].group__name = selectedGroup.group__name;
    // Add the selected group to groupExist[studentId]
    // this.groupExist[studentId].push(selectedGroup);
    this.checkIds(studentId);

    console.log('select addN', this.groupNotIn);
  }
  selectgroup(op: OverlayPanel, student: Student) {
    this.studentselesct = student;

    // this.formGroups[student.user__id.toString()] =
    //   this.createFormGroup(student);
    op.toggle(event);
  }

  clear(table: Table) {
    table.clear();
    this.searchValue = '';
  }
  mapValue(checked: any | null): string {
    if (checked === null) {
      return 'Waiting';
    }
    return checked ? 'accepted' : 'refused';
  }
  getSeverity(status: any | string | null): string | undefined {
    switch (status) {
      case false:
      case 'false':
        return 'danger';
      case true:
      case 'true':
        return 'success';
      case 'new':
        return 'info';
      case 'null':
      case null:
        return 'warning';
      default:
        return undefined;
    }
  }

  UpdateStudent(studentId: number) {
    // const formGroup = this.groupExist[studentId];
    // console.log('Form group value:', formGroup);

    const statut = this.activate[studentId].active;
    console.log('Form statut value:', statut);
    const groupid = this.group[studentId].group__id;


    // if (formGroup !== null) {
    //   arrayGroups = formGroup.map(
    //     (group: { group__id: string }) => group.group__id
    //   );
    // }

    const studentData = {
      group__id: groupid,
      active: statut,
    };
    console.log('data  status:', studentData);

    this.studentService.updateStudent(studentData, studentId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);

        this.studentsIds = this.studentsIds.filter((id) => id !== studentId);
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  deleteStudent(studentId: number) {
    this.studentService.DeleteStudent(studentId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);
        this.students = this.students.filter(
          (student) => student.user__id !== studentId
        );
        // Remove the student from the filtered lists
        this.studentsAccept = this.studentsAccept.filter(
          (student) => student.user__id !== studentId
        );
        this.studentsRefused = this.studentsRefused.filter(
          (student) => student.user__id !== studentId
        );
        this.studentsWait = this.studentsWait.filter(
          (student) => student.user__id !== studentId
        );
        this.currentTableData = this.currentTableData.filter(
          (student) => student.user__id !== studentId
        );
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  // overpanelClose(op: OverlayPanel) {
  //   op.hide();
  // }
}
