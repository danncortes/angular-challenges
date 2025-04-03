import { input, InputSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TodoComponent } from './todo.component';
import { Todo } from './todo.store';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodoComponent, MatProgressSpinner],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;

    // Provide required input values
    TestBed.runInInjectionContext(() => {
      component.todo = input({
        id: 1,
        title: 'Test Todo',
        completed: false,
        body: 123,
        userId: 1,
      }) as InputSignal<Todo>;

      component.error = input('') as InputSignal<string | undefined>;
      component.isLoading = input(false) as InputSignal<boolean | undefined>;
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    const todoTitleContainer: HTMLElement =
      fixture.nativeElement.querySelector('.todo-title');
    expect(todoTitleContainer.textContent?.trim()).toBe('Test Todo');
  });

  it('should render update button', () => {
    const updateButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.update-button');
    expect(updateButton).toBeTruthy();
    expect(updateButton.textContent?.trim()).toBe('Update');
  });

  it('should render delete button', () => {
    const deleteButton: HTMLButtonElement =
      fixture.nativeElement.querySelector('.delete-button');
    expect(deleteButton).toBeTruthy();
    expect(deleteButton.textContent?.trim()).toBe('Delete');
  });

  it('should show error message when error input is provided', () => {
    TestBed.runInInjectionContext(() => {
      component.error = input('Test error message') as InputSignal<
        string | undefined
      >;
    });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const errorElement =
        fixture.nativeElement.querySelector('.error-message');
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent?.trim()).toBe('🔴 Test error message');
    });
  });

  it('should show loading spinner and disable buttons when loading', () => {
    TestBed.runInInjectionContext(() => {
      component.isLoading = input(true) as InputSignal<boolean | undefined>;
    });
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const spinner = fixture.nativeElement.querySelector('mat-spinner');
      const updateButton =
        fixture.nativeElement.querySelector('.update-button');
      const deleteButton =
        fixture.nativeElement.querySelector('.delete-button');

      expect(spinner).toBeTruthy();
      expect(updateButton.disabled).toBe(true);
      expect(deleteButton.disabled).toBe(true);
    });
  });
  it('should emit update event when update button is clicked', () => {
    const updateButton = fixture.nativeElement.querySelector('.update-button');
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: false,
      body: 123,
      userId: 1,
    };

    let emittedTodo: Todo | undefined;
    component.update.subscribe((todo: Todo) => {
      emittedTodo = todo;
    });

    updateButton.click();
    expect(emittedTodo).toEqual(mockTodo);
  });

  it('should emit delete event when delete button is clicked', () => {
    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: false,
      body: 123,
      userId: 1,
    };

    let emittedTodo: Todo | undefined;
    component.delete.subscribe((todo: Todo) => {
      emittedTodo = todo;
    });

    deleteButton.click();
    expect(emittedTodo).toEqual(mockTodo);
  });
});
