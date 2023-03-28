import { TestBed } from '@angular/core/testing';

import { InterconnectionService } from './interconnection.service';

describe('InterconnectionService', () => {
  let service: InterconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterconnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
