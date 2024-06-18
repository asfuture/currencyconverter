import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraEsterlinaComponent } from './libra-esterlina.component';

describe('LibraEsterlinaComponent', () => {
  let component: LibraEsterlinaComponent;
  let fixture: ComponentFixture<LibraEsterlinaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraEsterlinaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraEsterlinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
