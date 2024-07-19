import { Component, OnInit } from '@angular/core';
import { TeacherService } from '../../../services/serviceTeacher/teacher.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ButtonModule } from 'primeng/button';
import { ListboxModule } from 'primeng/listbox';
import { SubjectService } from '../../../services/servicesUtils/subject.service';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';

export interface Teacher {
  user__id: number;
  first__name: string;
  last__name: string;
  user__email: string;
  active: boolean | null;
  password: string;
  description:string;
  Cv__path: string;
  birthday: Date;
  role: string;
  subjects: Subject[];
  groups: Group[];
  questions: any[];
}

export interface Subject {
  subject__name: string;
  subject__id: string;
}

export interface Group {
  group__name: string;
  group__id: string;
}

@Component({
  selector: 'app-manage-teacher',
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
  templateUrl: './manage-teacher.component.html',
  styleUrl: './manage-teacher.component.css',
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
export class ManageTeacherComponent implements OnInit {
  teachers: Teacher[] = [];
  teachersAccept: Teacher[] = [];
  teachersWait: Teacher[] = [];
  teachersRefused: Teacher[] = [];
  currentTableData!: Teacher[];
  examShudeled: any;
  exam: any;
  Techerselesct!: Teacher;
  teacherIds: number[] = [];
  groupExist: { [key: string]: any[] } = {};
  groupNotIn: { [key: string]: any[] } = {};
  searchValue: string = '';
  filterButton!: string;

  constructor(
    private teacherService: TeacherService,
    private subjectService: SubjectService,
    private groupService: GroupService
  ) {}

  customers!: any[];
  representatives!: any[];
  statuses!: any[];
  loading: boolean = true;
  activityValues: number[] = [0, 100];
  subjects!: any;
  subjectExist: { [key: string]: any[] } = {};
  subjectNotIn: { [key: string]: any[] } = {};
  groups!: any;

  activate: { [key: number]: { active?: any } } = {};
  openFile(filePath: string): void {
    window.open(filePath, '_blank');
  }
  switchTable(tableName: string) {
    this.loading = true; // Example: Set loading state

    switch (tableName) {
      case 'teachers':
        this.currentTableData = this.teachers;
        this.filterButton = 'teachers';
        break;
      case 'teachersAccept':
        this.currentTableData = this.teachersAccept;
        this.filterButton = 'teachersAccept';
        break;
      case 'teachersRefused':
        this.currentTableData = this.teachersRefused;
        this.filterButton = 'teachersRefused';
        break;
      case 'teachersWait':
        this.currentTableData = this.teachersWait;
        this.filterButton = 'teachersWait';
        break;
      default:
        this.currentTableData = [];
        this.filterButton = '';
    }

    this.loading = false; // Example: Clear loading state
  }
  ngOnInit() {
    this.fetchGroups();
    this.fetchSubjects();
    this.fetchTeachers();
    setTimeout(() => {
      if (this.loading) {
        this.fetchGroups();
        this.fetchSubjects();
        this.fetchTeachers();
      }
    }, 30000);
    console.log('hhdhshs ids', this.teacherIds);
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
  filtergroupsForAllTeachers(): void {
    this.teachers.forEach((teacher) => {
      const teachergroupIds = teacher.groups.map((group) => group.group__id);
      this.groupExist[teacher.user__id] = this.groups.filter(
        (group: { group__id: string }) =>
          teachergroupIds.includes(group.group__id)
      );
      this.groupNotIn[teacher.user__id] = this.groups.filter(
        (group: { group__id: string }) =>
          !teachergroupIds.includes(group.group__id)
      );
    });
  }
  filterSubjectsForAllTeachers(): void {
    this.teachers.forEach((teacher) => {
      const teacherSubjectIds = teacher.subjects.map(
        (subject) => subject.subject__id
      );
      this.subjectExist[teacher.user__id] = this.subjects.filter(
        (subject: { subject__id: string }) =>
          teacherSubjectIds.includes(subject.subject__id)
      );
      this.subjectNotIn[teacher.user__id] = this.subjects.filter(
        (subject: { subject__id: string }) =>
          !teacherSubjectIds.includes(subject.subject__id)
      );
    });
  }
  initializeActivation() {
    this.teachers.forEach((teacher) => {
      if (!this.activate[teacher.user__id]) {
        this.activate[teacher.user__id] = { active: null };
      }

      // Set the active property to the action value
      this.activate[teacher.user__id].active = teacher.active;
      console.log(this.activate);
    });
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

  fetchTeachers() {
    this.teacherService.getTeachers().subscribe(
      (data: Teacher[]) => {
        this.teachers = data;
        console.log('All teachers:', this.teachers);

        this.teachersAccept = this.teachers.filter(
          (teacher) => teacher.active == true
        );
        this.teachersRefused = this.teachers.filter(
          (teacher) => teacher.active == false
        );
        this.teachersWait = this.teachers.filter(
          (teacher) => teacher.active === null
        );

        console.log('Accepted teachers:', this.teachersAccept);
        console.log('Waiting teachers:', this.teachersWait);
        console.log('Refused teachers:', this.teachersRefused);
        this.filterSubjectsForAllTeachers();
        this.filtergroupsForAllTeachers();
        this.initializeActivation();
        this.switchTable('teachers');
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching teachers', error);
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
  checkIds(teacherId: number) {
    const teacher = this.teachers.find((t) => t.user__id === teacherId);

    if (
      teacher &&
      this.teacherIds.includes(teacherId) &&
      this.arraysEqual(
        this.groupExist[teacherId],
        teacher.groups,
        'group__id'
      ) &&
      this.arraysEqual(
        this.subjectExist[teacherId],
        teacher.subjects,
        'subject__id'
      ) &&
      this.activate[teacherId].active === teacher.active
    ) {
      // Remove teacherId from teacherIds if all conditions are met
      this.teacherIds = this.teacherIds.filter((id) => id !== teacherId);
    }
  }

  activation(event: any, teacherId: number) {
    const action = event.value;
    console.log('action is', action);
    // Check if teacherId is already in teacherIds, if not, push it
    if (!this.teacherIds.includes(teacherId)) {
      this.teacherIds.push(teacherId);
    }

    // Ensure that activate[teacherId] is initialized
    if (!this.activate[teacherId]) {
      this.activate[teacherId] = { active: null };
    }

    // Set the active property to the action value
    this.activate[teacherId].active = action;
    this.checkIds(teacherId);
    console.log(this.activate);
    console.log('ghghhghghghghg', this.teacherIds);
  }

  removesubject(event: any, teacherId: number) {
    const selectedSubject = event.value;
    if (!this.teacherIds.includes(teacherId)) {
      this.teacherIds.push(teacherId);
    }
    // Remove the selected subject from subjectExist[teacherId]
    this.subjectExist[teacherId] = this.subjectExist[teacherId].filter(
      (subject: { subject__id: string }) =>
        subject.subject__id !== selectedSubject.subject__id
    );
    this.subjectNotIn[teacherId].push(selectedSubject);
    this.checkIds(teacherId);
    console.log('teacherIDSS', this.teacherIds);
  }

  Removegroup(event: any, teacherId: number) {
    const selectedgroup = event.value;
    if (!this.teacherIds.includes(teacherId)) {
      this.teacherIds.push(teacherId);
    }

    this.groupExist[teacherId] = this.groupExist[teacherId].filter(
      (group: { group__id: string }) =>
        group.group__id !== selectedgroup.group__id
    );

    this.groupNotIn[teacherId].push(selectedgroup);

    this.checkIds(teacherId);
    console.log('rem addS', this.groupExist);
    console.log('rem addN', this.groupNotIn);
  }

  Selectsubject(event: any, teacherId: number) {
    const selectedSubject = event.value;
    if (!this.teacherIds.includes(teacherId)) {
      this.teacherIds.push(teacherId);
    }
    // Remove the selected subject from subjectExist[teacherId]
    this.subjectNotIn[teacherId] = this.subjectNotIn[teacherId].filter(
      (subject: { subject__id: string }) =>
        subject.subject__id !== selectedSubject.subject__id
    );
    this.subjectExist[teacherId].push(selectedSubject);
    this.checkIds(teacherId);
  }

  Selectgroup(event: any, teacherId: number) {
    const selectedGroup = event.value;
    if (!this.teacherIds.includes(teacherId)) {
      this.teacherIds.push(teacherId);
    }
    // Remove the selected group from groupNotIn[teacherId]
    this.groupNotIn[teacherId] = this.groupNotIn[teacherId].filter(
      (group: { group__id: string }) =>
        group.group__id !== selectedGroup.group__id
    );

    // Add the selected group to groupExist[teacherId]
    this.groupExist[teacherId].push(selectedGroup);
    this.checkIds(teacherId);
    console.log('select addS', this.groupExist);
    console.log('select addN', this.groupNotIn);
  }
  selectgroup(op: OverlayPanel, teacher: Teacher) {
    this.Techerselesct = teacher;

    // this.formGroups[teacher.user__id.toString()] =
    //   this.createFormGroup(teacher);
    op.toggle(event);
  }
  selectsubject(op: OverlayPanel, teacher: Teacher) {
    this.Techerselesct = teacher;

    // this.formsubjects[teacher.user__id.toString()] =
    //   this.createFormSubjct(teacher);

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

  UpdateTeacher(teacherId: number) {
    const formGroup = this.groupExist[teacherId];
    console.log('Form group value:', formGroup);
    const formsub = this.subjectExist[teacherId];
    console.log('Form group value:', formsub);
    const statut = this.activate[teacherId].active;
    console.log('Form statut value:', statut);

    let arraySubjects: any[] = [];
    let arrayGroups: any[] = [];

    if (formsub !== null) {
      arraySubjects = formsub.map(
        (subject: { subject__id: string }) => subject.subject__id
      );
    }
    if (formGroup !== null) {
      arrayGroups = formGroup.map(
        (group: { group__id: string }) => group.group__id
      );
    }

    const teacherData = {
      subjects: arraySubjects,
      groups: arrayGroups,
      active: statut,
    };
    console.log('data  status:', teacherData);

    this.teacherService.updateTeacher(teacherData, teacherId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);

        this.teacherIds = this.teacherIds.filter((id) => id !== teacherId);
      },
      (error: { error: { message: any } }) => {
        console.log('errrr', error);
      }
    );
  }
  deleteTeacher(teacherId: number) {
    this.teacherService.DeleteTeacher(teacherId).subscribe(
      (response: any) => {
        alert('Successfully create');
        console.log('seccess', response);
        this.teachers = this.teachers.filter(
          (teacher) => teacher.user__id !== teacherId
        );
        // Remove the teacher from the filtered lists
        this.teachersAccept = this.teachersAccept.filter(
          (teacher) => teacher.user__id !== teacherId
        );
        this.teachersRefused = this.teachersRefused.filter(
          (teacher) => teacher.user__id !== teacherId
        );
        this.teachersWait = this.teachersWait.filter(
          (teacher) => teacher.user__id !== teacherId
        );
        this.currentTableData = this.currentTableData.filter(
          (teacher) => teacher.user__id !== teacherId
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
