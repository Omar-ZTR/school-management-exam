import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalandarfullComponent } from './calandarfull.component';

describe('CalandarfullComponent', () => {
  let component: CalandarfullComponent;
  let fixture: ComponentFixture<CalandarfullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalandarfullComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalandarfullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




   // previous() {
  //   if (this.isMonthView) {
  //     this.currentMonth--;
  //     if (this.currentMonth < 0) {
  //       this.currentMonth = 11;
  //       this.currentYear--;
  //     }
  //     this.generateCalendar();
  //   } else {
  //     this.changeWeek(-1);
  //   }
  // }

  // next() {
  //   if (this.isMonthView) {
  //     this.currentMonth++;
  //     if (this.currentMonth > 11) {
  //       this.currentMonth = 0;
  //       this.currentYear++;
  //     }
  //     this.generateCalendar();
  //   } else {
  //     this.changeWeek(1);
  //   }
  // }

  // changeWeek(offset: number) {
  //   const currentStartDate = this.currentWeekStart;
  //   currentStartDate.setDate(currentStartDate.getDate() + (offset * 7));
  //   this.generateCurrentWeek();
  // }

  // toggleView() {
  //   this.isMonthView = !this.isMonthView;
  //   if (!this.isMonthView) {
  //     this.generateCurrentWeek();
  //   }
  // }

  // generateCurrentWeek() {
  //   const today = new Date();
  //   const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  //   this.currentWeekStart = startOfWeek;
  // }

  // getWeekDates(): Date[] {
  //   return Array.from({ length: 7 }, (_, i) => {
  //     const date = new Date(this.currentWeekStart);
  //     date.setDate(this.currentWeekStart.getDate() + i);
  //     return date;
  //   });
  // }



//   <!-- <div class="form-group d-flex justify-content-center align-items-center">
//   <div class="mr-2">
//     <label for="salle">Salle</label>
//     <select id="salle" class="form-control" formControlName="salle" (click)="onSalleSelect()">
//       <option *ngFor="let salle of salles" [value]="salle.salle__id">
//         {{ salle.salle__name }}
//       </option>
//     </select>
//     <div
//       *ngIf="
//         eventForm.controls['salle'].invalid &&
//         eventForm.controls['salle'].touched
//       "
//       class="text-danger"
//     >
//       Salle is required.
//     </div>
//   </div>
//   <div class="ml-2">
//     <label for="group">Group</label>
//     <select id="group" class="form-control" formControlName="group" >
//       <option *ngFor="let groupS of groupSub" value="groupS">
//         {{ groupS.group__name }}
//       </option>
//       <option *ngFor="let groupR of groupRank" [ngValue]="{group__id: groupR.group__id, group__name: groupR.group__name}">
//         {{ groupR.group__name }}
//       </option>
//     </select>
//     <div
//       *ngIf="
//         eventForm.controls['group'].invalid &&
//         eventForm.controls['group'].touched
//       "
//       class="text-danger"
//     >
//       Group is required.
//     </div>
//   </div>
// </div>
// -->