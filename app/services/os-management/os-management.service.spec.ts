import { TestBed } from '@angular/core/testing';

import { OsManagementService } from './os-management.service';

describe('OsManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OsManagementService = TestBed.get(OsManagementService);
    expect(service).toBeTruthy();
  });
});
