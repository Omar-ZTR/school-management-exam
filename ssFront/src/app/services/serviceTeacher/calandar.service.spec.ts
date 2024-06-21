import { TestBed } from '@angular/core/testing';

import { CalandarService } from './calandar.service';

describe('CalandarService', () => {
  let service: CalandarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalandarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
