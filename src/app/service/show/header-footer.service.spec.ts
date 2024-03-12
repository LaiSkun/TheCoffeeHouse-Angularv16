import { TestBed } from '@angular/core/testing';

import { HeaderFooterService } from './header-footer.service';

describe('HeaderFooterService', () => {
  let service: HeaderFooterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderFooterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
