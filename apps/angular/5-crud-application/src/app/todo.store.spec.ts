import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { patchState, WritableStateSource } from '@ngrx/signals';
import { of, throwError } from 'rxjs';
import { TodoService } from './todo.service';
import { TodoState, TodoStore } from './todo.store';

describe('TodoStore', () => {
  let store: InstanceType<typeof TodoStore>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodoStore,
        TodoService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });

    store = TestBed.inject(TodoStore);
  });

  it('should have initial state', () => {
    expect(store.todos()).toEqual([]);
    expect(store.isLoading()).toBeFalsy();
    expect(store.error()).toBeNull();
    expect(store.statuses()).toEqual(new Map());
  });

  it('should set todo status correctly', () => {
    const todoId = 1;
    const loading = true;
    const error = 'Test error';

    store.setTodoStatus(todoId, loading, error);

    const status = store.statuses().get(todoId);
    expect(status).toBeDefined();
    expect(status).toEqual({ loading, error });
  });

  it('should fetch todos successfully', () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false, body: 123, userId: 1 },
      { id: 2, title: 'Todo 2', completed: true, body: 456, userId: 2 },
    ];
    const todoService = TestBed.inject(TodoService);
    const getTodosSpy = jest
      .spyOn(todoService, 'getTodos')
      .mockReturnValue(of(mockTodos));

    store.fetch();

    expect(getTodosSpy).toHaveBeenCalled();
    expect(store.todos()).toEqual(mockTodos);
    expect(store.isLoading()).toBeFalsy();
    expect(store.error()).toBeNull();
  });

  it('should handle fetch todos error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const errorMessage = 'Failed to fetch todos';
    const todoService = TestBed.inject(TodoService);
    jest
      .spyOn(todoService, 'getTodos')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    store.fetch();

    expect(store.todos()).toEqual([]);
    expect(store.isLoading()).toBeFalsy();
    expect(store.error()).toBe(errorMessage);

    consoleSpy.mockRestore();
  });

  it('should update todo successfully', () => {
    const mockTodo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };
    const updatedTodo = { ...mockTodo, title: 'Updated Todo' };
    const todoService = TestBed.inject(TodoService);

    patchState(store as unknown as WritableStateSource<TodoState>, {
      todos: [mockTodo],
    });
    const updateSpy = jest
      .spyOn(todoService, 'updateTodo')
      .mockReturnValue(of(updatedTodo));

    store.update(mockTodo);

    expect(updateSpy).toHaveBeenCalledWith(mockTodo);
    expect(store.todos()).toContainEqual(updatedTodo);
    const status = store.statuses().get(mockTodo.id);
    expect(status).toEqual({ loading: false, error: '' });
  });

  it('should handle update todo error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockTodo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };
    const errorMessage = 'Failed to update todo';
    const todoService = TestBed.inject(TodoService);

    patchState(store as unknown as WritableStateSource<TodoState>, {
      todos: [mockTodo],
    });
    jest
      .spyOn(todoService, 'updateTodo')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    store.update(mockTodo);

    const status = store.statuses().get(mockTodo.id);
    expect(status).toEqual({ loading: false, error: errorMessage });
    expect(store.todos()).toContainEqual(mockTodo);

    consoleSpy.mockRestore();
  });

  it('should remove todo successfully', () => {
    const mockTodo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };
    const todoService = TestBed.inject(TodoService);

    patchState(store as unknown as WritableStateSource<TodoState>, {
      todos: [mockTodo],
    });
    const deleteSpy = jest
      .spyOn(todoService, 'deleteTodo')
      .mockReturnValue(of({}));

    store.remove(mockTodo);

    expect(deleteSpy).toHaveBeenCalledWith(mockTodo);
    expect(store.todos()).not.toContainEqual(mockTodo);
    const status = store.statuses().get(mockTodo.id);
    expect(status).toEqual({ loading: false, error: '' });
  });

  it('should handle remove todo error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockTodo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };
    const errorMessage = 'Failed to delete todo';
    const todoService = TestBed.inject(TodoService);

    patchState(store as unknown as WritableStateSource<TodoState>, {
      todos: [mockTodo],
    });
    jest
      .spyOn(todoService, 'deleteTodo')
      .mockReturnValue(throwError(() => new Error(errorMessage)));

    store.remove(mockTodo);

    const status = store.statuses().get(mockTodo.id);
    expect(status).toEqual({ loading: false, error: errorMessage });
    expect(store.todos()).toContainEqual(mockTodo);

    consoleSpy.mockRestore();
  });
});
