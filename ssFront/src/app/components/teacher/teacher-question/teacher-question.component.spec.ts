import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherQuestionComponent } from './teacher-question.component';

describe('TeacherQuestionComponent', () => {
  let component: TeacherQuestionComponent;
  let fixture: ComponentFixture<TeacherQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherQuestionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeacherQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
