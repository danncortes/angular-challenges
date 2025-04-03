import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AppComponent } from './app.component';
import { TodoComponent } from './todo.component';
import { TodoStore } from './todo.store';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let todoStore: InstanceType<typeof TodoStore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, TodoComponent, MatProgressSpinner],
      providers: [
        {
          provide: TodoStore,
          useValue: {
            fetch: jest.fn(),
            todos: jest.fn().mockReturnValue([]),
            isLoading: jest.fn().mockReturnValue(false),
            error: jest.fn().mockReturnValue(null),
            statuses: jest.fn().mockReturnValue(new Map()),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        provideHttpClient(withFetch()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    todoStore = TestBed.inject(TodoStore) as InstanceType<typeof TodoStore>;
  });

  it('should fetch todos on init', () => {
    fixture.whenStable().then(() => {
      expect(todoStore.fetch).toHaveBeenCalled();
    });
  });
});
