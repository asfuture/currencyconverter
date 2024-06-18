import { TestBed } from '@angular/core/testing';

import { DolarCanadenseService } from './dolar-canadense.service';

describe('DolarCanadenseService', () => {
  let service: DolarCanadenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DolarCanadenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
