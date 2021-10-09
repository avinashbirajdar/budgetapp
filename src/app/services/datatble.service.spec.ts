/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DatatbleService } from './datatble.service';

describe('Service: Datatble', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatatbleService]
    });
  });

  it('should ...', inject([DatatbleService], (service: DatatbleService) => {
    expect(service).toBeTruthy();
  }));
});
