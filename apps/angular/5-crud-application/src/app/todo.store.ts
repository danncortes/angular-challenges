import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { TodoService } from './todo.service';

export type Todo = {
  id: number;
  body: number;
  title: string;
  completed: boolean;
  userId: number;
};

type Status = {
  loading: boolean;
  error: string;
};

export type TodoState = {
  todos: Todo[];
  isLoading: boolean;
  error: string | null;
  statuses: Map<number, Status>;
};

const initialState: TodoState = {
  todos: [],
  isLoading: false,
  error: null,
  statuses: new Map(),
};

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store, todoService = inject(TodoService)) => ({
    setTodoStatus(todoId: number, loading: boolean, error: string) {
      patchState(store, (state) => {
        state.statuses.set(todoId, { loading, error });
        return {
          ...state,
          statuses: new Map(state.statuses),
        };
      });
    },
    fetch() {
      patchState(store, { isLoading: true, error: null });
      todoService.getTodos().subscribe({
        next: (todos) => {
          patchState(store, { todos });
        },
        error: (err) => {
          console.error(err);
          patchState(store, { isLoading: false, error: err.message });
        },
        complete: () => {
          patchState(store, { isLoading: false, error: null });
        },
      });
    },
    remove(todo: Todo) {
      const setTodoStatus = this.setTodoStatus;
      setTodoStatus(todo.id, true, '');
      todoService.deleteTodo(todo).subscribe({
        next() {
          patchState(store, (state) => {
            return {
              ...state,
              todos: state.todos.filter((td) => td.id !== todo.id),
            };
          });
        },
        error(err) {
          setTodoStatus(todo.id, false, err.message);
        },
        complete() {
          setTodoStatus(todo.id, false, '');
        },
      });
    },
    update(todo: Todo) {
      const setTodoStatus = this.setTodoStatus;
      setTodoStatus(todo.id, true, '');
      todoService.updateTodo(todo).subscribe({
        next(updatedTodo: Todo) {
          patchState(store, (state) => {
            return {
              ...state,
              todos: state.todos.map((td) =>
                td.id === updatedTodo.id ? updatedTodo : td,
              ),
            };
          });
        },
        error(err) {
          setTodoStatus(todo.id, false, err.message);
        },
        complete() {
          setTodoStatus(todo.id, false, '');
        },
      });
    },
  })),
);
