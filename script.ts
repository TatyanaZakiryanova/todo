interface ITodo {
  id: number;
  task: string;
  completed: boolean;
  markCompleted(): void;
  markIncomplete(): void;
}

class Todo implements ITodo {
  id: number;
  task: string;
  completed: boolean;
  constructor(id: number, task: string, completed: boolean = false) {
    this.id = id;
    this.task = task;
    this.completed = completed;
  }

  markCompleted(): void {
    this.completed = true;
  }

  markIncomplete(): void {
    this.completed = false;
  }
}

class TodoApp {
  todos: ITodo[] = [];

  public addTodo(task: string): void {
    const newTodo: ITodo = new Todo(this.todos.length + 1, task);
    this.todos.push(newTodo);
    this.render();
  }

  public removeTodo(id: number): void {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.render();
  }

  public markAllCompleted(): void {
    this.todos.forEach((todo) => todo.markCompleted());
    this.render();
    alert('All tasks are completed');
  }

  private render(): void {
    const todoListContainer = document.getElementById('todo-list');
    if (todoListContainer) {
      todoListContainer.innerHTML = '';
      this.todos.forEach((todo) => {
        const todoElement = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;

        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            todo.markCompleted();
          } else {
            todo.markIncomplete();
          }
          this.render();
        });

        todoElement.appendChild(checkbox);

        const taskText = document.createElement('span');
        taskText.textContent = todo.task;
        if (todo.completed) {
          taskText.style.textDecoration = 'line-through';
        }
        todoElement.appendChild(taskText);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';

        deleteButton.onclick = () => {
          this.removeTodo(todo.id);
        };
        todoElement.appendChild(deleteButton);
        todoListContainer.appendChild(todoElement);
      });
    }
  }
}

const todoApp = new TodoApp();

const addButton = document.getElementById('add-btn');
const taskInput = document.getElementById('task-input') as HTMLInputElement;
const markAllButton = document.getElementById('mark-all-btn');

if (addButton && taskInput) {
  addButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
      todoApp.addTodo(task);
      taskInput.value = '';
    }
  });
}

if (markAllButton) {
  markAllButton.addEventListener('click', () => {
    todoApp.markAllCompleted();
  });
}
