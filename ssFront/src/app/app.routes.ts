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

export const routes: Routes = [
  { path: 'a', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
   
  },
  {    path: 'auth',
  component: AuthComponent,},
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'dash',
        component: DashStudentComponent,
      },
      {
        path: 'update',
        component: UpdateProfileComponent,
      },
      {
        path: 'exam',
        component: SidebarComponent,
      },
    ],
  },
];
