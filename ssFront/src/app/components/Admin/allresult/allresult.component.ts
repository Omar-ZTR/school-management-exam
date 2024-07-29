import { Component } from '@angular/core';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-allresult',
  standalone: true,
  imports: [TableModule ,ButtonModule, CommonModule],
  templateUrl: './allresult.component.html',
  styleUrl: './allresult.component.css'
})
export class AllresultComponent {
  groups: any;
  expandedRows = {};


  constructor(
   
    private groupService: GroupService
  ) {}

  ngOnInit() {
 
    this.fetchGroups();

  }
  fetchGroups() {
    this.groupService.getFullGroups().subscribe(
      (data) => {
        this.groups = data;
       
    console.log('groupsgroupsgroupsgroups ', this.groups);
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }


}
