import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MusterPage } from './muster.page';

describe('MusterPage', () => {
  let component: MusterPage;
  let fixture: ComponentFixture<MusterPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
