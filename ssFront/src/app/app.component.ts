import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from "./components/home/home.component";
import { NavComponent } from "./components/home/nav/nav.component";
import { AuthComponent } from "./components/auth/auth.component";
import { StudentComponent } from "./components/student/student.component";
import { HttpClientModule } from '@angular/common/http';
import { MaterialModule } from './shared/material-module';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ResetPasswordComponent } from "./components/reset-password/reset-password.component";
import { TeacherComponent } from "./components/teacher/teacher.component";
import { AddExamComponent } from "./components/teacher/add-exam/add-exam.component";
import { CalandarfullComponent } from "./components/calandarfull/calandarfull.component";
import { PlaningComponent } from "./components/planing/planing.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, MaterialModule, HomeComponent, SignUpComponent, NavComponent, AuthComponent, StudentComponent, HttpClientModule, ResetPasswordComponent, TeacherComponent, AddExamComponent, CalandarfullComponent, PlaningComponent]
})
export class AppComponent {
  title = 'ssFront';
}
