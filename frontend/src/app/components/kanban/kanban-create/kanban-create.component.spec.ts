import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanCreateComponent } from './kanban-create.component';

describe('KanbanCreateComponent', () => {
  let component: KanbanCreateComponent;
  let fixture: ComponentFixture<KanbanCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
