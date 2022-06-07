/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DataSharingService } from './data-sharing.service';

describe('Service: DataSharing', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataSharingService]
    });
  });

  it('should ...', inject([DataSharingService], (service: DataSharingService) => {
    expect(service).toBeTruthy();
  }));
});
