import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';



@Component({
  selector: 'app-examtaken',
  standalone: true,
  imports: [FormsModule,TableModule, CheckboxModule, FieldsetModule, RadioButtonModule, PanelModule , CommonModule],
  templateUrl: './examtaken.component.html',
  styleUrl: './examtaken.component.css'
})
export class ExamtakenComponent {
  ingredient!: string;
  pizza: string[] = [];
}
