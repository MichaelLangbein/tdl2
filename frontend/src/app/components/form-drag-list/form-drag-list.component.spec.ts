import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDragListComponent } from './form-drag-list.component';

describe('FormDragListComponent', () => {
  let component: FormDragListComponent;
  let fixture: ComponentFixture<FormDragListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDragListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDragListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
