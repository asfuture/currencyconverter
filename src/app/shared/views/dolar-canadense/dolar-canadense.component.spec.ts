import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DolarCanadenseComponent } from './dolar-canadense.component';

describe('DolarCanadenseComponent', () => {
  let component: DolarCanadenseComponent;
  let fixture: ComponentFixture<DolarCanadenseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DolarCanadenseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DolarCanadenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
