import { TestBed, inject } from '@angular/core/testing';

import { ImageListService } from './image-list.service';

describe('ImageListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageListService]
    });
  });

  it('should be created', inject([ImageListService], (service: ImageListService) => {
    expect(service).toBeTruthy();
  }));
});
