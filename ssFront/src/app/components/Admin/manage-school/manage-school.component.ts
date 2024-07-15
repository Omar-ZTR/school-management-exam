import { Component } from '@angular/core';
import { GroupsComponent } from './groups/groups.component';
import { SubjectsComponent } from './subjects/subjects.component';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { SallesComponent } from "./salles/salles.component";
@Component({
  selector: 'app-manage-school',
  standalone: true,
  templateUrl: './manage-school.component.html',
  styleUrl: './manage-school.component.css',
  imports: [GroupsComponent, SubjectsComponent, TabViewModule, BadgeModule, CommonModule, SallesComponent],
})
export class ManageSchoolComponent {
ManageSubject:boolean=false;

ManageGroup:boolean=true;
ManageSalle:boolean=false;


ShowSubjects(){
    this.ManageSubject = true
    this.ManageGroup = false
    this.ManageSalle = false
}

ShowGroups(){
    this.ManageSubject = false
    this.ManageGroup = true
    this.ManageSalle = false
}

ShowSalles(){
  this.ManageSubject = false
  this.ManageGroup = false
  this.ManageSalle = true
}


}
