import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktowalletComponent } from './banktowallet.component';

describe('BanktowalletComponent', () => {
  let component: BanktowalletComponent;
  let fixture: ComponentFixture<BanktowalletComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanktowalletComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktowalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
