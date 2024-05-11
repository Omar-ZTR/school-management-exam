import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashStudentComponent } from './dash-student.component';

describe('DashStudentComponent', () => {
  let component: DashStudentComponent;
  let fixture: ComponentFixture<DashStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashStudentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
