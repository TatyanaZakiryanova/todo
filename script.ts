interface ITodo {
  id: number;
  task: string;
  completed: boolean;
  markCompleted(): void;
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
    alert(`Task ${this.task} completed`);
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
  }

  private render(): void {
    const todoListContainer = document.getElementById('todo-list');
    if (todoListContainer) {
      todoListContainer.innerHTML = '';
      this.todos.forEach((todo) => {
        const todoElement = document.createElement('li');
        todoElement.textContent = todo.task;

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

if (addButton && taskInput) {
  addButton.addEventListener('click', () => {
    const task = taskInput.value.trim();
    if (task) {
      todoApp.addTodo(task);
      taskInput.value = '';
    }
  });
}
