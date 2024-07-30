import { Component } from '@angular/core';
import { GroupService } from '../../../services/servicesUtils/group.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TableModule, TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-allresult',
  standalone: true,
  imports: [TableModule ,ButtonModule,TooltipModule , CommonModule],
  templateUrl: './allresult.component.html',
  styleUrl: './allresult.component.css'
})
export class AllresultComponent {
  groups: any;
 
  groupSelect: any=[];

  expandedRows: { [key: string]: boolean } = {};
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
       this.groupSelect= this.groups[0]
    console.log('groupsgroupsgroupsgroups ', this.groups);
      },
      (error) => {
        console.error('Error fetching groups', error);
      }
    );
  }
  switchGroup(group:any){
    this.expandedRows = {};
this.groupSelect = group

  }
  onRowExpand(event: any, index: number) {
    this.expandedRows = {}; // Reset expanded rows
    this.expandedRows[index] = true; // Expand only the selected row
    console.log('Expanded row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }

  onRowCollapse(event: any, index: number) {
    delete this.expandedRows[index]; // Collapse the selected row
    console.log('Collapsed row:', event.data);
    console.log('Expanded rows state:', this.expandedRows);
  }

  dateNow: Date = new Date();
  isFutureDate(examDate: Date): boolean {
    return new Date(examDate) > this.dateNow;
  }
  toggleRow(sub: any) {
    this.expandedRows[sub.id] = !this.expandedRows[sub.id];
  }
  // Function to check if the exam date is in the past
  isPastDate(examDate: Date): boolean {
    return new Date(examDate) < this.dateNow;
  }


}
