import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanktobankComponent } from './banktobank.component';

describe('BanktobankComponent', () => {
  let component: BanktobankComponent;
  let fixture: ComponentFixture<BanktobankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BanktobankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BanktobankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
