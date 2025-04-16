import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrackHabitAllPage } from './track-habit-all.page';

describe('TrackHabitAllPage', () => {
  let component: TrackHabitAllPage;
  let fixture: ComponentFixture<TrackHabitAllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackHabitAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
