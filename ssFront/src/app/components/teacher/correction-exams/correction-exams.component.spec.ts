import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectionExamsComponent } from './correction-exams.component';

describe('CorrectionExamsComponent', () => {
  let component: CorrectionExamsComponent;
  let fixture: ComponentFixture<CorrectionExamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectionExamsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorrectionExamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
