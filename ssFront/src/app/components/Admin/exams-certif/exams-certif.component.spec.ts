import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamsCertifComponent } from './exams-certif.component';

describe('ExamsCertifComponent', () => {
  let component: ExamsCertifComponent;
  let fixture: ComponentFixture<ExamsCertifComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamsCertifComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamsCertifComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
