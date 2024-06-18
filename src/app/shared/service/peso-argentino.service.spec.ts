import { TestBed } from '@angular/core/testing';

import { PesoArgentinoService } from './peso-argentino.service';

describe('PesoArgentinoService', () => {
  let service: PesoArgentinoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PesoArgentinoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
