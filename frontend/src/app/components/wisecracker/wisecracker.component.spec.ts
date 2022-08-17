import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WisecrackerComponent } from './wisecracker.component';

describe('WisecrackerComponent', () => {
  let component: WisecrackerComponent;
  let fixture: ComponentFixture<WisecrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WisecrackerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WisecrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
