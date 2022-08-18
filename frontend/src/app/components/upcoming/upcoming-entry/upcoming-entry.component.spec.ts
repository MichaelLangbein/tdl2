import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingEntryComponent } from './upcoming-entry.component';

describe('UpcomingEntryComponent', () => {
  let component: UpcomingEntryComponent;
  let fixture: ComponentFixture<UpcomingEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingEntryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
