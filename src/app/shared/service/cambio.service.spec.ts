import { TestBed } from '@angular/core/testing';

import { CambioService } from './cambio.service';

describe('CambioService', () => {
  let service: CambioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CambioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
