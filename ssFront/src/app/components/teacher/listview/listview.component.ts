import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-listview',
  standalone: true,
  imports: [CommonModule, TableModule, AccordionModule],
  templateUrl: './listview.component.html',
  styleUrl: './listview.component.css',
  styles: [
    `
      :host ::ng-deep .p-accordion-header a {
        color: #100d6a !important
      } `,
  ],
})
export class ListviewComponent {
  @Input() data: any;
}
