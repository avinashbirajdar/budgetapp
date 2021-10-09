import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditDebitComponent } from './credit-debit.component';

describe('CreditDebitComponent', () => {
  let component: CreditDebitComponent;
  let fixture: ComponentFixture<CreditDebitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditDebitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditDebitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
