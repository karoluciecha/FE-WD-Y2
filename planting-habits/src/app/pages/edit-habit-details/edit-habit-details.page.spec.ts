import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditHabitDetailsPage } from './edit-habit-details.page';

describe('EditHabitDetailsPage', () => {
  let component: EditHabitDetailsPage;
  let fixture: ComponentFixture<EditHabitDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHabitDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
