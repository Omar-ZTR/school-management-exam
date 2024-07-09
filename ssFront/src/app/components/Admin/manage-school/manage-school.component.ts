import { Component } from '@angular/core';
import { GroupsComponent } from "./groups/groups.component";
import { SubjectsComponent } from "./subjects/subjects.component";
@Component({
    selector: 'app-manage-school',
    standalone: true,
    templateUrl: './manage-school.component.html',
    styleUrl: './manage-school.component.css',
    imports: [GroupsComponent,SubjectsComponent]
})
export class ManageSchoolComponent {
 
}
