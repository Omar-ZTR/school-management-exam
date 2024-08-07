import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SidebarComponent } from './components/student/sidebar/sidebar.component';
import { DashStudentComponent } from './components/student/dash-student/dash-student.component';
import { StudentComponent } from './components/student/student.component';
import { AuthComponent } from './components/auth/auth.component';
import { UpdateProfileComponent } from './components/student/update-profile/update-profile.component';
import path from 'path';
import { Component } from '@angular/core';
import { NavComponent } from './components/home/nav/nav.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { RouteGuardService } from './services/servicesUser/route-guard.service';
import { AddExamComponent } from './components/teacher/add-exam/add-exam.component';
import { TeacherExamComponent } from './components/teacher/teacher-exam/teacher-exam.component';
import { ResultComponent } from './components/teacher/result/result.component';
import { CorrectionExamsComponent } from './components/teacher/correction-exams/correction-exams.component';
import { ExamsComponent } from './components/student/exams/exams.component';
import { AdminDashComponent } from './components/Admin/admin-dash/admin-dash.component';
import { ManageTeacherComponent } from './components/Admin/manage-teacher/manage-teacher.component';
import { ManageStudentComponent } from './components/Admin/manage-student/manage-student.component';
import { ManageSchoolComponent } from './components/Admin/manage-school/manage-school.component';
import { AdminComponent } from './components/Admin/admin/admin.component';
import { TeacherQuestionComponent } from './components/teacher/teacher-question/teacher-question.component';
import { AllresultComponent } from './components/Admin/allresult/allresult.component';
import { ExamsCertifComponent } from './components/Admin/exams-certif/exams-certif.component';
import { StudentanswersComponent } from './components/student/studentanswers/studentanswers.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { VerifieEmailComponent } from './components/verifie-email/verifie-email.component';
import { TeacherDashComponent } from './components/teacher/teacher-dash/teacher-dash.component';
import { ContactComponent } from './components/contact/contact.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'auth', component: AuthComponent},
  { path: 'resetpass/:id/:token', component: ResetPasswordComponent},
  { path: 'verifyemail/:codeVerifey', component: VerifieEmailComponent},
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [RouteGuardService],
    data: { expectedRole: ['Student'] },
    children: [
      { path: 'dash', component: DashStudentComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'exam', component: ExamsComponent },
      { path: 'result', component: StudentanswersComponent },
    ],
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [RouteGuardService],
    data: { expectedRole: ['Teacher'] },
    children: [
      { path: 'dash', component: TeacherDashComponent },
      { path: 'addExam', component: AddExamComponent },
      { path: 'listExam', component: TeacherExamComponent },
      { path: 'addQuestion', component: TeacherQuestionComponent },
      { path: 'Result', component: ResultComponent },
      { path: 'Correction', component: CorrectionExamsComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [RouteGuardService],
    data: { expectedRole: ['Admin'] },
    children: [
      { path: 'dash', component: AdminDashComponent },
      { path: 'manageTeacher', component: ManageTeacherComponent },
      { path: 'manageStudent', component: ManageStudentComponent },
      { path: 'manageSchool', component: ManageSchoolComponent },
      { path: 'result', component: AllresultComponent },
      { path: 'certifexam', component: ExamsCertifComponent },
      { path: 'contact', component: ContactComponent },
    ],
  },
];