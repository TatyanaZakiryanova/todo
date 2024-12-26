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
      this.todos.forEach((todo, index) => {
        const todoElement = document.createElement('li');
        todoElement.draggable = true;
        //присваивает атрибут data-index каждому li
        todoElement.dataset.index = index.toString();

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

        // Drag-and-drop события
        todoElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        todoElement.addEventListener('dragover', (e) => this.handleDragOver(e));
        todoElement.addEventListener('drop', (e) => this.handleDrop(e));
        todoElement.addEventListener('dragend', (e) => this.handleDragEnd(e));

        todoListContainer.appendChild(todoElement);
      });
    }
  }

  private handleDragStart(e: DragEvent): void {
    //получение элемента, с которого началось перетаскивание
    const target = e.target as HTMLElement;
    if (target && target.dataset.index) {
      //сохранение индекса перетаскиваемого элемента в dataTransfer
      e.dataTransfer?.setData('text/plain', target.dataset.index);
      target.classList.add('dragging');
    }
  }

  private handleDragOver(e: DragEvent): void {
    e.preventDefault();
    //получение элемента, над которым в данный момент находится перетаскиваемый элемент
    const target = e.target as HTMLElement;
    if (target && target.dataset.index) {
      //выделение рамкой возможного места для drop
      target.style.border = '2px dashed #ccc';
    }
  }

  private handleDrop(e: DragEvent): void {
    e.preventDefault();

    //индекс элемента, который перетащили
    const fromIndex = e.dataTransfer?.getData('text/plain');
    const target = e.target as HTMLElement;
    //индекс элемента, на который перетащили
    const toIndex = target.closest('li')?.dataset.index;

    if (fromIndex && toIndex && fromIndex !== toIndex) {
      const from = parseInt(fromIndex, 10);
      const to = parseInt(toIndex, 10);

      //удаление элемента из массива todos по индексу from
      //и вставка по индексу to
      const [movedTodo] = this.todos.splice(from, 1);
      this.todos.splice(to, 0, movedTodo);

      this.render();
    }
  }

  private handleDragEnd(e: DragEvent): void {
    const target = e.target as HTMLElement;
    if (target) {
      target.classList.remove('dragging');
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
