import { TestBed } from '@angular/core/testing';

import { NetworkManagementService } from './network-management.service';

describe('NetworkManagementService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkManagementService = TestBed.get(NetworkManagementService);
    expect(service).toBeTruthy();
  });
});
