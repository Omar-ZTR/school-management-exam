// import { Component } from '@angular/core';
// import { SubjectService } from '../../servicesUtils/subject.service';
// import { GroupService } from '../../servicesUtils/group.service';


// export interface Subject {
//   subject__name: string;
//   subject__id: string;
// }

// export interface Group {
//   group__name: string;
//   group__id: string;
//   subjects: Subject[];
// }


// @Component({
//   selector: 'app-manage-school',
//   standalone: true,
//   imports: [],
//   templateUrl: './manage-school.component.html',
//   styleUrl: './manage-school.component.css'
// })
// export class ManageSchoolComponent {
//   subjects!: any;
//   groups: Group[] = [];

//   subjectExist: { [key: string]: any[] } = {};
//   subjectNotIn: { [key: string]: any[] } = {};

//   constructor(
    
//     private subjectService: SubjectService,
//     private groupService: GroupService
//   ) {}

//   filterSubjectsForAllTeachers(): void {
//     this.groups.forEach((g) => {
//       const groupSubjectIds = g.subjects.map(
//         (subject) => subject.subject__id
//       );
//       this.subjectExist[g.group__id] = this.subjects.filter(
//         (subject: { subject__id: string }) =>
//           groupSubjectIds.includes(subject.subject__id)
//       );
//       this.subjectNotIn[g.group__id] = this.subjects.filter(
//         (subject: { subject__id: string }) =>
//           !groupSubjectIds.includes(subject.subject__id)
//       );
//     });
//   }

//   fetchGroups() {
//     this.groupService.getGroups().subscribe(
//       (data) => {
//         this.groups = data;
//         console.log('Groups data:', data);
//       },
//       (error) => {
//         console.error('Error fetching groups', error);
//       }
//     );
//   }


  
//   fetchSubjects() {
//     this.subjectService.getSubjects().subscribe(
//       (data) => {
//         this.subjects = data;
//         console.log('Subjects data:', data);
//       },
//       (error) => {
//         console.error('Error fetching subjects', error);
//       }
//     );
//   }

// }
