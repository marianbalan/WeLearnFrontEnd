/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudyGroupService } from './study-group.service';

describe('Service: StudyGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudyGroupService]
    });
  });

  it('should ...', inject([StudyGroupService], (service: StudyGroupService) => {
    expect(service).toBeTruthy();
  }));
});
