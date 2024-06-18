import { TestBed } from '@angular/core/testing';

import { LibraEsterlinaService } from './libra-esterlina.service';

describe('LibraEsterlinaService', () => {
  let service: LibraEsterlinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibraEsterlinaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
