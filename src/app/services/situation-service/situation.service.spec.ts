/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SituationService } from './situation.service';

describe('Service: Situation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SituationService]
    });
  });

  it('should ...', inject([SituationService], (service: SituationService) => {
    expect(service).toBeTruthy();
  }));
});
