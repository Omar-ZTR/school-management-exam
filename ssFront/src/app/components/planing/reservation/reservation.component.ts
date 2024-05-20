import { Component, EventEmitter, Output } from '@angular/core';
import { ANGULAR_V17_FEATURES, BookedCourse } from '../entities';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    DateInputsModule,
    DropDownListModule,
    LabelModule,
    ButtonModule,
    FormsModule,
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  @Output() addCourse = new EventEmitter<BookedCourse>();
  courseList = ANGULAR_V17_FEATURES;

  public selectedDate: Date = new Date();
  public selectedCourse = this.courseList[0];
  public dateTimeFormat = 'MM/dd/yyyy HH:mm';

  addToCalendar() {
    const bookedCourse: BookedCourse = {
      when: this.selectedDate,
      title: this.selectedCourse.title,
      description: this.selectedCourse.description,
      duration: this.selectedCourse.duration,
    };

    this.addCourse.emit(bookedCourse);
  }
}
