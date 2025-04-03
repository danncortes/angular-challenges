import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { randText } from '@ngneat/falso';
import { Todo } from './todo.store';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private headers = new HttpHeaders().set(
    'Content-Type',
    'application/json; charset=UTF-8',
  );
  private http = inject(HttpClient);

  isLoading = signal<boolean>(false);
  todos = signal<Todo[]>([]);

  getTodos() {
    return this.http.get<Todo[]>('https://jsonplaceholder.typicode.com/todos');
  }

  updateTodo(todo: Todo) {
    return this.http.put<Todo>(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      JSON.stringify({
        todo: todo.id,
        title: randText(),
        body: todo.body,
        userId: todo.userId,
      }),
      {
        headers: this.headers,
      },
    );
  }

  deleteTodo(todo: Todo) {
    return this.http.delete(
      `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
      {
        headers: this.headers,
      },
    );
  }
}
