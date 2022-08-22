import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashcardViewComponent } from './flashcard-view.component';

describe('FlashcardViewComponent', () => {
  let component: FlashcardViewComponent;
  let fixture: ComponentFixture<FlashcardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashcardViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FlashcardViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
