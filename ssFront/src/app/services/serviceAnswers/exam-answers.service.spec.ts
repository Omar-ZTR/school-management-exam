import { TestBed } from '@angular/core/testing';

import { ExamAnswersService } from './exam-answers.service';

describe('ExamAnswersService', () => {
  let service: ExamAnswersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExamAnswersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
