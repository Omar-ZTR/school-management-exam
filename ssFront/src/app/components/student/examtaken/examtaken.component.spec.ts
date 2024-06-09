import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamtakenComponent } from './examtaken.component';

describe('ExamtakenComponent', () => {
  let component: ExamtakenComponent;
  let fixture: ComponentFixture<ExamtakenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamtakenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamtakenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
