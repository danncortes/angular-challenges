import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TodoComponent } from './todo.component';
import { Todo, TodoStore } from './todo.store';

@Component({
  imports: [CommonModule, MatProgressSpinner, TodoComponent],
  providers: [],
  selector: 'app-root',
  template: `
    @if (this.todoStore.isLoading()) {
      <mat-spinner></mat-spinner>
    } @else if (this.todoStore.error()) {
      🔴 {{ this.todoStore.error() }}
      <button (click)="fetchTodos()">Retry</button>
    } @else {
      <div *ngFor="let todo of this.todoStore.todos()">
        <app-todo
          [todo]="todo"
          [error]="this.todoStore.statuses().get(todo.id)?.error"
          [isLoading]="this.todoStore.statuses().get(todo.id)?.loading"
          (update)="this.update($event)"
          (delete)="this.delete($event)"></app-todo>
      </div>
    }
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  readonly todoStore = inject(TodoStore);

  ngOnInit(): void {
    this.todoStore.fetch();
  }

  fetchTodos() {
    this.todoStore.fetch();
  }

  update(todo: Todo) {
    this.todoStore.update(todo);
  }

  delete(todo: Todo) {
    this.todoStore.remove(todo);
  }
}
