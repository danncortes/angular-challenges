import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Todo } from './todo.store';

@Component({
  selector: 'app-todo',
  imports: [CommonModule, MatProgressSpinner],
  template: `
    <div>
      <p class="todo-title">
        {{ todo().title }}
      </p>
      <button
        class="update-button"
        (click)="updateTodo(todo())"
        [disabled]="this.isLoading()">
        Update
      </button>
      <button
        class="delete-button"
        (click)="deleteTodo(todo())"
        [disabled]="this.isLoading()">
        Delete
      </button>

      @if (this.isLoading()) {
        <mat-spinner></mat-spinner>
      }

      @if (this.error()) {
        <p class="error-message">🔴 {{ this.error() }}</p>
      }
    </div>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {
  todo = input.required<Todo>();
  isLoading = input<boolean | undefined>(false);
  error = input<string | undefined>(undefined);
  update = output<Todo>();
  delete = output<Todo>();

  updateTodo(todo: Todo) {
    this.update.emit(todo);
  }

  deleteTodo(todo: Todo) {
    this.delete.emit(todo);
  }
}
