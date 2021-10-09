import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeTypeComponent } from './income-type.component';

describe('IncomeTypeComponent', () => {
  let component: IncomeTypeComponent;
  let fixture: ComponentFixture<IncomeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
