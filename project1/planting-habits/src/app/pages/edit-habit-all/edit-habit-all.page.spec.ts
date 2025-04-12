import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditHabitAllPage } from './edit-habit-all.page';

describe('EditHabitAllPage', () => {
  let component: EditHabitAllPage;
  let fixture: ComponentFixture<EditHabitAllPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHabitAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
