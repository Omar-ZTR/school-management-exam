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
import { RouteGuardService } from './servicesUser/route-guard.service';
import { AddExamComponent } from './components/teacher/add-exam/add-exam.component';
import { TeacherExamComponent } from './components/teacher/teacher-exam/teacher-exam.component';
import { AddQuestionComponent } from './components/teacher/add-question/add-question.component';
import { ResultComponent } from './components/teacher/result/result.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'home', component: HomeComponent, canActivate: [RouteGuardService] },
  { path: 'auth', component: AuthComponent},
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [RouteGuardService],
    data: { expectedRole: ['Student'] },
    children: [
      { path: 'dash', component: DashStudentComponent },
      { path: 'update', component: UpdateProfileComponent },
      { path: 'exam', component: SidebarComponent },
    ],
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [RouteGuardService],
    data: { expectedRole: ['Teacher'] },
    children: [
      { path: 'dash', component: DashStudentComponent },
      { path: 'addExam', component: AddExamComponent },
      { path: 'listExam', component: TeacherExamComponent },
      { path: 'addQuestion', component: AddQuestionComponent },
      { path: 'Result', component: ResultComponent },
    ],
  },
];