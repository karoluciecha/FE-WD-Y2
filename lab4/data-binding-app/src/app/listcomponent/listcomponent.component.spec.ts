import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListcomponentComponent } from './listcomponent.component';

describe('ListcomponentComponent', () => {
  let component: ListcomponentComponent;
  let fixture: ComponentFixture<ListcomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListcomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListcomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
