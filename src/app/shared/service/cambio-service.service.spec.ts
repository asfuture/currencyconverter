import { TestBed } from '@angular/core/testing';

import { CambioServiceService } from './cambio-service.service';

describe('CambioServiceService', () => {
  let service: CambioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
