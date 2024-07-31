import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentanswersComponent } from './studentanswers.component';

describe('StudentanswersComponent', () => {
  let component: StudentanswersComponent;
  let fixture: ComponentFixture<StudentanswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentanswersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentanswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
