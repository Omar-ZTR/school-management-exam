import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllresultComponent } from './allresult.component';

describe('AllresultComponent', () => {
  let component: AllresultComponent;
  let fixture: ComponentFixture<AllresultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllresultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
