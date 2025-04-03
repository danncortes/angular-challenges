import { provideHttpClient, withFetch } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';
import { Todo } from './todo.store';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://jsonplaceholder.typicode.com/todos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        TodoService,
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos', () => {
    const mockTodos: Todo[] = [
      { id: 1, title: 'Todo 1', completed: false, body: 123, userId: 1 },
    ];

    service.getTodos().subscribe((todos) => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should update todo', () => {
    const mockTodo: Todo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };
    const updatedTodo: Todo = { ...mockTodo, title: 'Updated Todo' };

    service.updateTodo(mockTodo).subscribe((todo) => {
      expect(todo).toEqual(updatedTodo);
    });

    const req = httpMock.expectOne(`${baseUrl}/${mockTodo.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Content-Type')).toBe(
      'application/json; charset=UTF-8',
    );
    req.flush(updatedTodo);
  });

  it('should delete todo', () => {
    const mockTodo: Todo = {
      id: 1,
      title: 'Todo 1',
      completed: false,
      body: 123,
      userId: 1,
    };

    service.deleteTodo(mockTodo).subscribe((response) => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${baseUrl}/${mockTodo.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Content-Type')).toBe(
      'application/json; charset=UTF-8',
    );
    req.flush(null);
  });
});
