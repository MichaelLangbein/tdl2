import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanAddTaskComponent } from './kanban-add-task.component';

describe('KanbanAddTaskComponent', () => {
  let component: KanbanAddTaskComponent;
  let fixture: ComponentFixture<KanbanAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KanbanAddTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KanbanAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
