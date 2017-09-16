import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackInfoListComponent } from './track-info-list.component';

describe('TrackInfoListComponent', () => {
  let component: TrackInfoListComponent;
  let fixture: ComponentFixture<TrackInfoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackInfoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackInfoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
